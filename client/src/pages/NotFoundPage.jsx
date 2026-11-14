import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const NotFoundPage = () => {
    usePageTitle('Page not found');

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <div className="text-6xl font-bold text-brand">404</div>
                <h1 className="mt-4 text-2xl font-semibold">This page does not exist</h1>
                <p className="mt-2 text-slate-500">The link may be broken or the page was moved</p>
                <Link
                    to="/"
                    className="mt-6 inline-block rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2"
                >
                    Go to home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;