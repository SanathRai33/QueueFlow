import { useAuth } from '../context/AuthContext';

const QueuesPage = () => {
  const { manager, logout } = useAuth();

  return (
    <div className="p-6">
      <div className="text-2xl font-semibold text-brand">QueuesPage</div>
      <p className="mt-2 text-slate-600">Logged in as {manager.email}</p>
      <button onClick={logout} className="mt-4 rounded-lg border px-3 py-1.5">
        Logout
      </button>
    </div>
  );
};

export default QueuesPage;