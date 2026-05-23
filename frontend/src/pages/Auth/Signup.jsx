import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await signup(values);
      navigate(data?.user?.role === 'admin' ? '/dashboard' : '/projects');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-app-pattern px-4 py-10">
      <AuthForm
        title="Create Account"
        subtitle="Join your workspace and start collaborating with your team."
        fields={[
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
          {
            name: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            options: [
              { value: 'member', label: 'Member' },
              { value: 'admin', label: 'Admin' },
            ],
          },
        ]}
        values={values}
        onChange={(e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitLabel="Sign Up"
        footer={
          <p>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-cyan-700 hover:text-cyan-900">
              Login
            </Link>
          </p>
        }
      />
    </div>
  );
};

export default Signup;
