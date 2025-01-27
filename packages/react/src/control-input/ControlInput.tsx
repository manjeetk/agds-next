import { forwardRef, InputHTMLAttributes } from 'react';
import { visuallyHiddenStyles } from '../a11y';
import { packs } from '../core';

export type ControlInputProps = InputHTMLAttributes<HTMLInputElement>;

export const ControlInput = forwardRef<HTMLInputElement, ControlInputProps>(
	function ControlInput(props, ref) {
		return (
			<input
				ref={ref}
				css={{
					...visuallyHiddenStyles,
					// When this component is focused, outline the indicator (`RadioIndicator` and `CheckboxIndicator`)
					'&:focus ~ span:first-of-type': packs.outline,
					// When this component is checked, show the indicators active state
					'&:checked ~ span > *': { display: 'block' },
				}}
				{...props}
			/>
		);
	}
);
