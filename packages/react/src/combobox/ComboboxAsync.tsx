import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useCombobox } from 'downshift';
import { ComboboxBase, CommonComboboxProps } from './ComboboxBase';
import {
	DefaultComboboxOption,
	filterOptions,
	useComboboxInputId,
} from './utils';

export type ComboboxAsyncProps<Option extends DefaultComboboxOption> =
	CommonComboboxProps<Option> & {
		/** Function to be used when options need to be loaded over the network. */
		loadOptions: (inputValue: string) => Promise<Option[]>;
	};

export function ComboboxAsync<Option extends DefaultComboboxOption>({
	loadOptions: loadOptionsProp,
	showDropdownTrigger = true,
	...props
}: ComboboxAsyncProps<Option>) {
	const inputId = useComboboxInputId(props.id);

	const [state, setState] = useState<{
		inputItems: Option[] | undefined;
		loading: boolean;
		networkError: boolean;
	}>({
		inputItems: undefined,
		loading: false,
		networkError: false,
	});

	const isInputDirty = useRef(false);

	const downshift = useCombobox<Option>({
		selectedItem: props.value,
		inputId,
		items: state.inputItems ?? [],
		itemToString: (item) => item?.label ?? '',
		onSelectedItemChange: ({ selectedItem = null }) => {
			props.onChange?.(selectedItem);
		},
		onInputValueChange: () => {
			isInputDirty.current = true;
		},
		stateReducer: (state, actionAndChanges) => {
			const { type: actionAndChangesType, changes } = actionAndChanges;
			switch (actionAndChangesType) {
				// Reset the input value when the menu is closed
				case useCombobox.stateChangeTypes.InputBlur:
					return {
						...changes,
						inputValue: state.selectedItem?.label ?? '',
					};
				default:
					return changes;
			}
		},
	});

	// Keep track of the debounced input value to prevent unnecessary network requests
	const [debouncedInputValue] = useDebounce(downshift.inputValue, 300);

	const shouldLoadOptions = useMemo(() => {
		// Do load options when...
		if (
			// User has just started typing, so this avoids the flicker of the empty state
			(!debouncedInputValue && downshift.inputValue) ||
			// User has manually triggered the dropdown menu open
			(showDropdownTrigger && downshift.isOpen && !downshift.selectedItem)
		) {
			return true;
		}
		// Do NOT load options when...
		const selectedItemLabel = downshift.selectedItem?.label;
		if (
			// Options are already being loaded
			state.loading ||
			// Options have failed to load
			state.networkError ||
			// Dropdown is closed
			!downshift.isOpen ||
			// If a selection has just been made, no not need to load options again
			(selectedItemLabel && selectedItemLabel === debouncedInputValue) ||
			// When there is no dropdown trigger (e.g. Autocomplete), only load the options if the user has interacted with the input
			(!showDropdownTrigger && !isInputDirty.current)
		) {
			return false;
		}
		return true;
	}, [
		debouncedInputValue,
		downshift.inputValue,
		downshift.isOpen,
		downshift.selectedItem,
		showDropdownTrigger,
		state.loading,
		state.networkError,
	]);

	// Keep track of search terms/loaded options to prevent unnecessary network requests
	const cache = useRef<Record<string, Option[]>>({});

	useEffect(() => {
		async function loadOptions(shouldLoadOptions: boolean) {
			if (!shouldLoadOptions) return;
			// sanitize the input value
			const inputValue = debouncedInputValue?.toLowerCase() ?? '';

			// If there are cached options for the search term, use that
			const cachedInputItems = cache.current[inputValue];
			if (cachedInputItems) {
				setState({
					inputItems: cachedInputItems,
					loading: false,
					networkError: false,
				});
				return;
			}

			// No cached options found, so kick off the loading state
			setState({ inputItems: undefined, loading: true, networkError: false });
			try {
				// Load the options
				const inputItems = await loadOptionsProp(inputValue);
				const filteredInputItems = filterOptions(inputItems, inputValue);
				// Update the cache
				cache.current[inputValue] = filteredInputItems;
				// Update the UI
				setState({
					inputItems: filteredInputItems,
					loading: false,
					networkError: false,
				});
			} catch {
				// An error occurred while loading options
				setState({ inputItems: undefined, loading: false, networkError: true });
			}
		}

		loadOptions(shouldLoadOptions);
	}, [shouldLoadOptions, debouncedInputValue, loadOptionsProp]);

	return (
		<ComboboxBase
			downshift={downshift}
			inputId={inputId}
			loading={state.loading}
			networkError={state.networkError}
			inputItems={state.inputItems}
			showDropdownTrigger={showDropdownTrigger}
			{...props}
		/>
	);
}
