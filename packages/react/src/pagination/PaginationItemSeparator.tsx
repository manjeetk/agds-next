import { Flex } from '../box';
import { Text } from '../text';
import { BUTTON_SIZE } from './utils';

export function PaginationItemSeparator() {
	return (
		<Flex
			as="li"
			width={BUTTON_SIZE}
			height={BUTTON_SIZE}
			alignItems="center"
			justifyContent="center"
		>
			<Text>&hellip;</Text>
		</Flex>
	);
}