import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;