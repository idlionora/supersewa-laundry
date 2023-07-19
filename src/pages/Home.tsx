import { Outlet } from "react-router-dom";

function Home() {
	return (
		<>
			<h1 className="text-3xl">path: home</h1>
			<Outlet />
		</>
	);
}

export default Home;
