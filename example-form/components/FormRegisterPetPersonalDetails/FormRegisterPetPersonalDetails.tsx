import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import { Column, Columns } from '@ag.ds-next/columns';
import { PageContent, ContentBleed } from '@ag.ds-next/content';
import { ProgressIndicator } from '@ag.ds-next/progress-indicator';
import { Stack } from '@ag.ds-next/box';
import { Text } from '@ag.ds-next/text';
import { DirectionButton } from '@ag.ds-next/direction-link';
import { AppLayout } from '../AppLayout';
import { useFormRegisterPet } from '../FormRegisterPetContext';
import {
	FormRegisterPetPersonalDetailsStep0,
	FormSchema as FormRegisterPetPersonalDetailsStep0Schema,
} from './FormRegisterPetPersonalDetailsStep0';
import {
	FormRegisterPetPersonalDetailsStep1,
	FormSchema as FormRegisterPetPersonalDetailsStep1Schema,
} from './FormRegisterPetPersonalDetailsStep1';
import {
	FormRegisterPetPersonalDetailsStep2,
	FormSchema as FormRegisterPetPersonalDetailsStep2Schema,
} from './FormRegisterPetPersonalDetailsStep2';
import { FormRegisterPetPersonalDetailsStep3 } from './FormRegisterPetPersonalDetailsStep3';

export const FORM_STEPS = [
	{
		label: 'Personal details',
		component: FormRegisterPetPersonalDetailsStep0,
	},
	{
		label: 'Address details',
		component: FormRegisterPetPersonalDetailsStep1,
	},
	{
		label: 'Contact method',
		component: FormRegisterPetPersonalDetailsStep2,
	},
	{
		label: 'Confirm and submit',
		component: FormRegisterPetPersonalDetailsStep3,
	},
];

const TOTAL_STEPS = FORM_STEPS.length - 1;

type ContextType = {
	/** When called, the user will be taken back to the previous step */
	back: () => void;
	/** When called, the user will be taken forward to the the next step */
	next: (stepFormState?: StepFormState) => void;
	/** When called, the user will be taken to the provided step */
	goToStep: (step: number) => void;
	/** The current step of the form */
	currentStep: number;
	/** If true, the user has completed the previous step of the form */
	hasCompletedPreviousSteps: boolean;
	/** If true, the current from step is being submitted */
	isSubmittingStep: boolean;
	/** When called, the users progress will be saved and they will be taken to the home page */
	saveAndExit: () => void;
	/** If true, the user is about to exit the form */
	isSavingBeforeExiting: boolean;
	/** When called, the user will to the forms home page */
	cancel: () => void;
	/** The state of the entire form */
	formState: FormState;
	/** The state of the form of the current step */
	stepFormState: StepFormState;
};

const context = createContext<ContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepFormState = Record<string, any>;

export type FormState = Partial<{
	[0]: FormRegisterPetPersonalDetailsStep0Schema;
	[1]: FormRegisterPetPersonalDetailsStep1Schema;
	[2]: FormRegisterPetPersonalDetailsStep2Schema;
}>;

export const FormRegisterPetPersonalDetails = () => {
	const { submitStep } = useFormRegisterPet();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);

	const [formState, setFormState] = useState<FormState>({
		0: {
			firstName: 'Alex',
			lastName: 'Citizen',
			email: 'alex.citizen@gmail.com',
			dob: new Date('1999-09-09'),
		},
		1: {
			streetAddress: '21 East Wallaby Way',
			suburbTownCity: 'Petsville',
			state: 'nsw',
			postcode: '2123',
		},
	});

	const backToHomePage = useCallback(() => {
		router.push('/services/registrations/pet');
	}, [router]);

	/** When called, the user will be taken back to the previous step */
	const back = useCallback(() => {
		if (currentStep === 0) backToHomePage();
		setCurrentStep(currentStep - 1);
	}, [currentStep, backToHomePage]);

	const [isSubmittingStep, setIsSubmittingStep] = useState(false);

	/** When called, the user will be taken forward to the the next step */
	const next = useCallback(
		(stepFormState?: StepFormState) => {
			setIsSubmittingStep(true);

			if (stepFormState) {
				setFormState((current) => ({
					...current,
					[currentStep]: stepFormState,
				}));
			}

			// Using a `setTimeout` to replicate a call to a back-end API
			setTimeout(() => {
				setIsSubmittingStep(false);
				if (currentStep === TOTAL_STEPS) {
					submitStep(formState);
					router.push(`/services/registrations/pet/task-2`);
				} else {
					setCurrentStep(currentStep + 1);
				}
			}, 1500);
		},
		[currentStep, formState, submitStep, router]
	);

	const [isSavingBeforeExiting, setIsSavingBeforeExiting] = useState(false);

	/** When called, the users progress will be saved and they will be taken to the home page */
	const saveAndExit = useCallback(() => {
		setIsSavingBeforeExiting(true);
		// Using a `setTimeout` to replicate a call to a back-end API
		setTimeout(() => {
			backToHomePage();
			setIsSavingBeforeExiting(false);
		}, 1500);
	}, [backToHomePage]);

	/** If true, the user has completed the previous step of the form */
	const hasCompletedPreviousSteps = useMemo(() => {
		if (currentStep === 0) return true;
		const previousStep = currentStep - 1;
		return Boolean(previousStep in formState);
	}, [formState, currentStep]);

	const FormStepComponent = FORM_STEPS[currentStep]?.component;

	const contextValue = {
		back,
		next,
		goToStep: setCurrentStep,
		currentStep,
		isSubmittingStep,
		saveAndExit,
		isSavingBeforeExiting,
		cancel: backToHomePage,
		hasCompletedPreviousSteps,
		formState,
		stepFormState:
			(currentStep in formState &&
				formState[currentStep as keyof typeof formState]) ||
			{},
	};

	return (
		<AppLayout focusMode>
			<PageContent>
				<context.Provider value={contextValue}>
					<Columns>
						<Column columnSpan={{ xs: 12, md: 4, lg: 3 }}>
							<ContentBleed visible={{ md: false }}>
								<Stack gap={0.75}>
									<Text
										display={{ xs: 'none', md: 'block' }}
										as="h3"
										fontSize="md"
										fontWeight="bold"
										lineHeight="heading"
									>
										Progress
									</Text>
									<ProgressIndicator
										items={FORM_STEPS.map(({ label }, idx) => ({
											label,
											status:
												idx === currentStep
													? 'doing'
													: idx in formState
													? 'done'
													: 'todo',
											onClick: () => setCurrentStep(idx),
										}))}
									/>
								</Stack>
							</ContentBleed>
						</Column>
						<Column columnSpan={{ xs: 12, md: 8 }} columnStart={{ lg: 5 }}>
							<Stack gap={3} alignItems="flex-start">
								<DirectionButton direction="left" onClick={back}>
									Back
								</DirectionButton>
								{FormStepComponent ? <FormStepComponent /> : null}
							</Stack>
						</Column>
					</Columns>
				</context.Provider>
			</PageContent>
		</AppLayout>
	);
};

export const useFormRegisterPetPersonalDetails = () => {
	const value = useContext(context);

	if (!value) {
		throw new Error('Context provider not found');
	}

	return value;
};