import { Navigate, Outlet, useLocation } from 'react-router-dom';

function Redirect() {
    const location = useLocation();

    if (location.pathname === '/') {
		return <Navigate to="orders" />;
	}

    return <Outlet />;
}

export default Redirect;
