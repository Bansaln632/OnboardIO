import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * OAuth2 Redirect Handler
 * This component handles the redirect from backend after successful Google Sign-In
 * It extracts the JWT token from URL params and stores it in localStorage
 */
function OAuth2Redirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Handle error
      console.error('OAuth2 error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode token to get user role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        // Redirect based on role
        if (role === 'ROLE_ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        navigate('/login?error=invalid_token');
      }
    } else {
      // No token provided
      navigate('/login?error=no_token');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-700">Signing you in...</p>
      </div>
    </div>
  );
}

export default OAuth2Redirect;
