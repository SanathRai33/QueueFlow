import { Lottie } from 'lottie-react';
import queueAnimation from '../../assets/animations/Queue.json';
import Logo from '../../assets/animations/Logo.json';

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-brand text-white flex-col justify-between p-12">
                <div className="text-2xl font-bold">
                     <Lottie
                            src={Logo}
                            autoplay
                            loop
                            style={{ width: '240px', height: '64px' }}
                        />
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <Lottie
                            src={queueAnimation}
                            autoplay
                            loop
                            style={{ width: '100%', height: '240px' }}
                        />
                    </div>

                    <div className="mt-10 w-full">
                        <h1 className="text-4xl font-bold leading-tight">Manage queues effortlessly</h1>
                        <p className="mt-4 text-indigo-100">
                            Add people, change the order, serve the next token and see how long everyone waits.
                        </p>
                    </div>
                </div>

                <div className="text-sm text-indigo-200">Simple queue management for your team</div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden text-2xl font-bold text-brand mb-8">QueueFlow</div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="mt-1 mb-6 text-slate-500">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;