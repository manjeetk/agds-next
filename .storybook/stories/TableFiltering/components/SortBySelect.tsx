import { Select } from '@ag.ds-next/react/select';
import { GetDataSort } from '../lib/getData';
import { BusinessForAudit } from '../lib/generateBusinessData';
import { tableId } from './DashboardTable';

export const SortBySelect = ({
	sort,
	setSort,
}: {
	sort: GetDataSort;
	setSort: (sort: GetDataSort) => void;
}) => {
	return (
		<Select
			label="Sort by"
			hideOptionalLabel
			options={[
				{
					value: 'businessName-ASC',
					label: 'Business name (A-Z)',
				},
				{
					value: 'businessName-DESC',
					label: 'Business name (Z-A)',
				},
				{
					value: 'assignee-ASC',
					label: 'Assignee (A-Z)',
				},
				{
					value: 'assignee-DESC',
					label: 'Assignee (Z-A)',
				},
				{
					value: 'requestDate-ASC',
					label: 'Date registered (oldest first)',
				},
				{
					value: 'requestDate-DESC',
					label: 'Date registered (newest first)',
				},
			]}
			value={`${sort.field}-${sort.order}`}
			aria-controls={tableId}
			onChange={(e) => {
				const [field, order] = e.target.value.split('-');
				setSort({
					field: field as keyof BusinessForAudit,
					order: order as 'ASC' | 'DESC',
				});
			}}
		/>
	);
};
