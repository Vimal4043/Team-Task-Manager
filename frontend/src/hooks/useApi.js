import { useCallback, useState } from 'react';

const useApi = (requestFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError('');
        const data = await requestFn(...args);
        return data;
      } catch (err) {
        const message = err?.response?.data?.message || 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFn]
  );

  return { loading, error, execute, setError };
};

export default useApi;
