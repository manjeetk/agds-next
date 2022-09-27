import { ReactNode } from 'react';
import { Stack } from '@ag.ds-next/box';
import { PageAlert } from '@ag.ds-next/page-alert';
import { Prose } from '@ag.ds-next/prose';
import { PageTitle } from '../PageTitle';
import { useFormRegisterPetPersonalDetails } from './FormRegisterPetPersonalDetails';

export const FormRegisterPetPersonalDetailsContainer = ({
	children,
	title,
	introduction,
	callToAction,
}: {
	children: ReactNode;
	title: string;
	introduction: string;
	callToAction?: ReactNode;
}) => {
	const { hasCompletedPreviousSteps } = useFormRegisterPetPersonalDetails();
	return (
		<Stack gap={3} width="100%">
			<PageTitle
				pretext="Your personal details"
				title={title}
				introduction={introduction}
				callToAction={callToAction}
			/>
			{hasCompletedPreviousSteps ? (
				children
			) : (
				<PageAlert
					tone="warning"
					title="This section of the form is not ready to be completed"
				>
					<Prose>
						<p>
							Before starting this part of the form, you will need to go back
							and complete all of the previous sections.
						</p>
					</Prose>
				</PageAlert>
			)}
		</Stack>
	);
};