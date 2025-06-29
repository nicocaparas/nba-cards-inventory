import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 rounded-lg mb-8 shadow-md">
            <div className="flex justify-center gap-8 text-white text-lg font-semibold">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                            : "hover:text-gray-200 transition pb-1"
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/add-card"
                    className={({ isActive }) =>
                        isActive
                            ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                            : "hover:text-gray-200 transition pb-1"
                    }
                >
                    Add Card
                </NavLink>

                <NavLink
                    to="/collection"
                    className={({ isActive }) =>
                        isActive
                            ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                            : "hover:text-gray-200 transition pb-1"
                    }
                >
                    Collection
                </NavLink>

                {/* <NavLink
                    to="/ebay-test"
                    className={({ isActive }) =>
                        isActive
                            ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                            : "hover:text-gray-200 transition pb-1"
                    }
                >
                    Ebay Test
                </NavLink> */}
            </div>
        </nav>
    );
}

export default Navbar;
