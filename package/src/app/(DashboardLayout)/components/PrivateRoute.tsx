import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) {
      router.push('/authentication/login');
    }
  }, [router]);

  // If there's no token initially, you might want to return null or a loading indicator
  const token = Cookies.get('jwt');
  if (!token) {
    return null; // Or a loading indicator
  }

  return <>{children}</>;
};

export default PrivateRoute;