import { ExampleSmall } from './ExampleSmall';
import { ExampleMedium } from './ExampleMedium';
import { useSortAndFilter } from './lib/useSortAndFilter';
import { generateTableCaption, useData } from './lib/utils';
import { useRef } from 'react';
import { DraftBanner } from './components/DraftBanner';

export default {
	title: 'Patterns/Data Filtering (WIP)',
	parameters: {
		layout: 'fullscreen',
	},
};

export const Small = () => {
	const tableRef = useRef<HTMLTableElement>(null);
	const { sort, filters, pagination, setSort, setFilters, setPagination } =
		useSortAndFilter({
			tableRef,
		});

	const { loading, data, totalPages, totalItems } = useData({
		filters,
		pagination,
		sort,
	});

	const tableCaption = generateTableCaption({
		loading,
		totalItems,
		pagination,
	});

	return (
		<>
			<DraftBanner />
			<ExampleSmall
				sort={sort}
				setSort={setSort}
				filters={filters}
				setFilters={setFilters}
				pagination={pagination}
				setPagination={setPagination}
				totalPages={totalPages}
				loading={loading}
				data={data}
				tableRef={tableRef}
				tableCaption={tableCaption}
				totalItems={totalItems}
			/>
		</>
	);
};

export const Medium = () => {
	const tableRef = useRef<HTMLTableElement>(null);
	const {
		filters,
		pagination,
		resetFilters,
		removeFilter,
		setFilters,
		setPagination,
		setSort,
		sort,
	} = useSortAndFilter({
		tableRef,
	});

	const { loading, data, totalPages, totalItems } = useData({
		filters,
		pagination,
		sort,
	});

	const tableCaption = generateTableCaption({
		loading,
		totalItems,
		pagination,
	});

	return (
		<>
			<DraftBanner />
			<ExampleMedium
				data={data}
				filters={filters}
				loading={loading}
				pagination={pagination}
				resetFilters={resetFilters}
				setFilters={setFilters}
				removeFilter={removeFilter}
				setPagination={setPagination}
				setSort={setSort}
				sort={sort}
				tableRef={tableRef}
				tableCaption={tableCaption}
				totalPages={totalPages}
				totalItems={totalItems}
			/>
		</>
	);
};
