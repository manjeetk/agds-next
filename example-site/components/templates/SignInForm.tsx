import { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@ag.ds-next/react/button';
import { FormStack } from '@ag.ds-next/react/form-stack';
import { TextInput } from '@ag.ds-next/react/text-input';
import { Stack } from '@ag.ds-next/react/box';
import { PageAlert } from '@ag.ds-next/react/page-alert';
import { Prose } from '@ag.ds-next/react/prose';
import { useScrollToField } from '@ag.ds-next/react/field';
import { TextLink } from '@ag.ds-next/react/text-link';
import { PageContent } from '@ag.ds-next/react/content';
import { Column, Columns } from '@ag.ds-next/react/columns';
import { PageTitle } from '../PageTitle';
import { FormDivider } from '../FormDivider';

const formSchema = yup
	.object({
		email: yup.string().email('Invalid email').required('Enter your email'),
		password: yup.string().required('Enter your password'),
	})
	.required();

type FormSchema = yup.InferType<typeof formSchema>;

const SignInForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const networkErrorPageAlertRef = useRef<HTMLDivElement>(null);
	const [networkErrorMessage, setNetworkErrorMessage] = useState<string>();
	const clientErrorPageAlertRef = useRef<HTMLDivElement>(null);
	const [hasFocusedClientErrorRef, setHasFocusedClientErrorRef] =
		useState(false);

	const scrollToField = useScrollToField();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormSchema>({
		resolver: yupResolver(formSchema),
	});

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		console.log(data);
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setNetworkErrorMessage('Incorrect username or password');
		}, 3000);
	};

	const onError: SubmitErrorHandler<FormSchema> = (errors, event) => {
		console.log(errors, event);
		setHasFocusedClientErrorRef(false);
	};

	// Only show the page alert if there is more than 1 error
	const hasClientErrors = Object.keys(errors).length > 1;

	useEffect(() => {
		if (!(hasClientErrors || hasFocusedClientErrorRef)) return;
		clientErrorPageAlertRef.current?.focus();
		setHasFocusedClientErrorRef(true);
	}, [hasFocusedClientErrorRef, hasClientErrors]);

	const hasNetworkErrors = Boolean(networkErrorMessage);

	useEffect(() => {
		if (!hasNetworkErrors) return;
		networkErrorPageAlertRef.current?.focus();
	}, [hasNetworkErrors]);

	return (
		<Stack gap={3}>
			{hasNetworkErrors && (
				<PageAlert ref={networkErrorPageAlertRef} tabIndex={-1} tone="error">
					<Prose>
						<p>{networkErrorMessage}</p>
					</Prose>
				</PageAlert>
			)}
			{hasClientErrors && (
				<PageAlert
					ref={clientErrorPageAlertRef}
					tabIndex={-1}
					tone="error"
					title="There is a problem"
				>
					<Prose>
						<p>Please correct the following fields and try again</p>
						<ul>
							{Object.entries(errors).map(([key, value]) => (
								<li key={key}>
									<a href={`#${key}`} onClick={scrollToField}>
										{value.message}
									</a>
								</li>
							))}
						</ul>
					</Prose>
				</PageAlert>
			)}
			<form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
				<FormStack>
					<TextInput
						label="Email"
						type="email"
						{...register('email')}
						id="email"
						invalid={Boolean(errors.email?.message)}
						message={errors.email?.message}
						maxWidth="xl"
						required
					/>
					<Stack gap={0.75}>
						<TextInput
							label="Password"
							type="password"
							{...register('password')}
							id="password"
							invalid={Boolean(errors.password?.message)}
							message={errors.password?.message}
							maxWidth="xl"
							required
						/>
						<TextLink href="#" css={{ alignSelf: 'flex-start' }}>
							Forgot password?
						</TextLink>
					</Stack>
					<div>
						<Button type="submit" loading={isSubmitting}>
							Sign in
						</Button>
					</div>
				</FormStack>
			</form>
		</Stack>
	);
};

export const SignInFormPage = () => {
	return (
		<PageContent>
			<Columns>
				<Column columnSpan={{ xs: 12, md: 7 }}>
					<Stack gap={3}>
						<PageTitle
							title="Sign in form - xxl/display (H1)"
							introduction="Introductory paragraph providing context for this sign in form. All questions on page must be related - md/default (P)."
						/>
						<SignInForm />
						<FormDivider />
						<Prose>
							<p>
								Don&apos;t have an account? <a href="#">Create account</a>
							</p>
							<p>
								Read our <a href="#">privacy policy</a>
							</p>
						</Prose>
					</Stack>
				</Column>
			</Columns>
		</PageContent>
	);
};
