import { useEffect } from 'react';

const useLocalStorageListener = (key, callback) => {
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue === 'true') {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, callback]);
};
export default useLocalStorageListener;
