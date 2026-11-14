const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-brand text-white flex-col justify-between p-12">
                <div className="text-2xl font-bold">QueueFlow</div>
                <div>
                    <h1 className="text-4xl font-bold leading-tight">Manage queues effortlessly</h1>
                    <p className="mt-4 text-indigo-100 max-w-md">
                        Add people, change the order, serve the next token and see how long everyone waits.
                    </p>
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