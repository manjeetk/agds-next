import { normalize } from 'path';
import { boxPalette } from '@ag.ds-next/react/core';
import { Box, Flex, Stack } from '@ag.ds-next/react/box';
import { Card, CardLink, CardInner } from '@ag.ds-next/react/card';
import { Columns } from '@ag.ds-next/react/columns';
import { mq } from '@ag.ds-next/react/core';
import { Text } from '@ag.ds-next/react/text';
import { getMarkdownData } from '../../lib/mdxUtils';
import { getTemplateList, TEMPLATES_PATH } from '../../lib/mdx/templates';
import { DocumentTitle } from '../../components/DocumentTitle';
import { CategoryPageTemplate } from '../../components/CategoryPageTemplate';

type StaticProps = Awaited<ReturnType<typeof getStaticProps>>['props'];

export default function TemplatesPage({
	title,
	description,
	templateLinks,
}: StaticProps) {
	return (
		<>
			<DocumentTitle title="Templates" description={description} />
			<CategoryPageTemplate
				title={title}
				description={description}
				editPath="/docs/content/templates/index.mdx"
			>
				<Columns as="ul" gap={1.5} cols={{ xs: 1, sm: 2, lg: 3 }}>
					{templateLinks.map((template) => {
						return <TemplateCard key={template.slug} {...template} />;
					})}
				</Columns>
			</CategoryPageTemplate>
		</>
	);
}

const TemplateCard = ({
	slug,
	label,
	description,
}: {
	slug: string;
	label: string;
	description: string;
}) => {
	return (
		<Card as="li" clickable shadow>
			<Flex flexDirection="column-reverse">
				<CardInner>
					<Stack gap={1} flexGrow={1}>
						<Box as="h3">
							<CardLink href={`/templates/${slug}`}>{label}</CardLink>
						</Box>
						<Text>{description}</Text>
					</Stack>
				</CardInner>
				<img
					src={`/img/templates/${slug}.webp`}
					role="presentation"
					alt=""
					height="auto"
					width="100%"
					css={mq({
						borderBottom: `1px solid ${boxPalette.borderMuted}`,
						objectFit: 'cover',
					})}
				/>
			</Flex>
		</Card>
	);
};

export async function getStaticProps() {
	const { data } = await getMarkdownData(
		normalize(`${TEMPLATES_PATH}/index.mdx`)
	);
	const templateList = await getTemplateList();

	const templateLinks = templateList.map(({ slug, title, description }) => ({
		href: `/templates/${slug}`,
		slug,
		label: title,
		description: description || null,
	}));

	return {
		props: {
			title: data?.title as string,
			description: data?.description as string,
			templateLinks,
		},
	};
}
