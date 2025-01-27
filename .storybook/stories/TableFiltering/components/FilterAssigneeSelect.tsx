import { Select } from '@ag.ds-next/react/select';
import { GetDataFilters } from '../lib/getData';
import { assignees } from '../lib/generateBusinessData';
import { tableId } from './DashboardTable';

export const FilterAssigneeSelect = ({
	filters,
	setFilters,
}: {
	filters: GetDataFilters;
	setFilters: (filters: GetDataFilters) => void;
}) => {
	return (
		<Select
			label="Assignee"
			placeholder="All"
			hideOptionalLabel
			aria-controls={tableId}
			options={assignees.map((option) => ({
				label: option,
				value: option,
			}))}
			value={filters.assignee || ''}
			onChange={(e) => {
				const value = e.target.value;
				setFilters({
					...filters,
					assignee: value === '' ? undefined : value,
				});
			}}
		/>
	);
};
