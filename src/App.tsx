import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
	return (
		<div>
			<h1 className="text-3xl font-bold underline">Insert Navbar Here</h1>
            <main>
                <Outlet />
            </main>
		</div>
	);
}

export default App;
