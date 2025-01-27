import { ComponentMeta } from '@storybook/react';
import { Button, ButtonGroup } from '../button';
import { useTernaryState } from '../core';
import { Text } from '../text';
import { Modal } from './Modal';

export default {
	title: 'content/Modal',
	component: Modal,
} as ComponentMeta<typeof Modal>;

export const Basic = () => {
	const [isModalOpen, openModal, closeModal] = useTernaryState(false);

	return (
		<div>
			<Button onClick={openModal}>Open modal</Button>
			<Modal
				isOpen={isModalOpen}
				onDismiss={closeModal}
				title="This is the title of the modal dialog, it can span lines but should not be too long."
				actions={
					<ButtonGroup>
						<Button onClick={closeModal}>Primary button</Button>
						<Button variant="secondary" onClick={closeModal}>
							Secondary button
						</Button>
						<Button variant="tertiary" onClick={closeModal}>
							Tertiary button
						</Button>
					</ButtonGroup>
				}
			>
				<Text as="p">
					This is the Modal Body paragraph, it provides detailed instruction and
					context for the the modal action. It can also span lines but long form
					content should be avoided.
				</Text>
			</Modal>
		</div>
	);
};
