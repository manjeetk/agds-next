import { Fragment, useRef } from 'react';
import useSWR from 'swr';
import { Stack } from '@ag.ds-next/react/box';
import { SkeletonText } from '@ag.ds-next/react/skeleton';
import { Text } from '@ag.ds-next/react/text';
import { PageContent } from '@ag.ds-next/react/content';
import { Card, CardInner, CardLink } from '@ag.ds-next/react/card';
import { Columns } from '@ag.ds-next/react/columns';
import { SkeletonHeading } from '@ag.ds-next/react/skeleton';
import { Heading } from '@ag.ds-next/react/heading';
import { VisuallyHidden } from '@ag.ds-next/react/a11y';

export default {
	title: 'Patterns/Remote data',
	parameters: {
		layout: 'fullscreen',
	},
};

const fetcher = async (url: string) => {
	const res = await fetch(url);
	const json = await res.json();
	// Fake a slow network
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return json;
};

export function RemoteDataCards() {
	const { data, error } = useSWR<{
		count: number;
		results: { name: string; population: string; climate: string }[];
	}>(`https://swapi.dev/api/planets/?page=1`, fetcher);

	const totalPages = useRef<number>(0);
	if (data?.count) totalPages.current = data.count / 10;

	if (error) return <Text>An error occurred</Text>;

	return (
		<PageContent>
			<Stack gap={2}>
				<Heading type="h2">Star wars planets</Heading>
				<Columns as="ul" cols={[1, 2, 3, 3, 4]}>
					{!data ? (
						<Fragment>
							{Array.from(Array(10).keys()).map((i) => (
								<Card as="li" key={i} shadow>
									<CardInner>
										<Stack gap={1}>
											<SkeletonHeading type="h3" width="50%" />
											<SkeletonText fontSize="sm" width="25%" />
											<VisuallyHidden>Loading</VisuallyHidden>
										</Stack>
									</CardInner>
								</Card>
							))}
						</Fragment>
					) : (
						<Fragment>
							{data.results.map((item) => {
								const parsedPopulation = parseInt(item.population);
								return (
									<Card as="li" key={item.name} shadow clickable>
										<CardInner>
											<Stack gap={1}>
												<Heading type="h3">
													<CardLink href="#">{item.name}</CardLink>
												</Heading>
												<Text as="p">
													Population:{' '}
													{isNaN(parsedPopulation)
														? 'Unknown'
														: numberFormatter.format(parsedPopulation)}
												</Text>
											</Stack>
										</CardInner>
									</Card>
								);
							})}
						</Fragment>
					)}
				</Columns>
			</Stack>
		</PageContent>
	);
}

const numberFormatter = new Intl.NumberFormat();
