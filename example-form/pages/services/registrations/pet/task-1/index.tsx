import { PageContent } from '@ag.ds-next/content';
import { Columns, Column } from '@ag.ds-next/columns';
import { Prose } from '@ag.ds-next/prose';
import { Stack } from '@ag.ds-next/box';
import { H2 } from '@ag.ds-next/heading';
import { DirectionLink } from '@ag.ds-next/direction-link';
import { ButtonLink } from '@ag.ds-next/button';
import { AppLayout } from '../../../../../components/AppLayout';
import { DocumentTitle } from '../../../../../components/DocumentTitle';
import { FormHelpCallout } from '../../../../../components/FormHelpCallout';
import { PageTitle } from '../../../../../components/PageTitle';
import { FormDivider } from '../../../../../components/FormDivider';

export default function FormRegisterPetTask1HomePage() {
	return (
		<>
			<DocumentTitle title="Your personal details" />
			<AppLayout focusMode>
				<PageContent>
					<Columns>
						<Column columnSpan={{ xs: 12, md: 8 }}>
							<Stack gap={3}>
								<DirectionLink
									href="/services/registrations/pet"
									direction="left"
								>
									Back
								</DirectionLink>
								<PageTitle
									title="Your personal details"
									introduction="To complete this process you can check, update and confirm your current contact and address details"
								/>
								<Stack gap={1.5}>
									<H2>Registration requirements</H2>
									<Prose>
										<p>
											To speed up the process of registering you pet you will
											need to provide:
										</p>
										<ul>
											<li>Personal details</li>
											<li>Address details</li>
											<li>Contact details</li>
										</ul>
									</Prose>
								</Stack>
								<div>
									<ButtonLink href="/services/registrations/pet/task-1/form">
										Get started
									</ButtonLink>
								</div>
								<FormDivider />
								<FormHelpCallout />
							</Stack>
						</Column>
					</Columns>
				</PageContent>
			</AppLayout>
		</>
	);
}