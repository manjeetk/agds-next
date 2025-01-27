import { AppLayout } from '../components/AppLayout';
import { DocumentTitle } from '../components/DocumentTitle';
import { NotFound } from '../components/templates/NotFound';

export default function NotFoundPage() {
	return (
		<>
			<DocumentTitle title="Error 404" />
			<AppLayout template={{ name: '404', slug: '404' }}>
				<NotFound />
			</AppLayout>
		</>
	);
}
