import { Navigate, Outlet, useLocation } from 'react-router-dom';

function Redirect() {
    const location = useLocation();
    console.log(location)

    if (location.pathname === '/') {
		return <Navigate to="orders" />;
	}

    return <Outlet />;
}

export default Redirect;
