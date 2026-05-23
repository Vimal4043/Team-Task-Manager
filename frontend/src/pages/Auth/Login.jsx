import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-app-pattern px-4 py-10">
      <AuthForm
        title="Welcome Back"
        subtitle="Log in to continue managing tasks and team delivery."
        fields={[
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
        ]}
        values={values}
        onChange={(e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitLabel="Login"
        footer={
          <p>
            No account yet?{' '}
            <Link to="/auth/signup" className="font-semibold text-cyan-700 hover:text-cyan-900">
              Sign up
            </Link>
          </p>
        }
      />
    </div>
  );
};

export default Login;
