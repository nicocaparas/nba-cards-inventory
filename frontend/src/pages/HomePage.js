function HomePage() {
    return (
        <div>
            {/* Website Title */}
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
                NBA Card Inventory
            </h1>

            {/* Search Bar */}
            <div className="mb-10 flex justify-center">
                <input
                    type="text"
                    placeholder="Search for cards..."
                    className="border p-2 rounded w-full max-w-2xl shadow"
                />
            </div>

            {/* Hot Cards Section */}

            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
                    🔥 Hot Cards 🔥
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Hot card 1 */}
                    <div className="border p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold">LeBron James</h3>
                        <p className="text-gray-600">Topps Chrome - 2003</p>
                        <p className="text-green-600 font-bold mt-2">+15% ↑</p>
                    </div>

                    {/* Hot card 2 */}
                    <div className="border p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold">Stephen Curry</h3>
                        <p className="text-gray-600">Panini Prizm - 2012</p>
                        <p className="text-green-600 font-bold mt-2">+12% ↑</p>
                    </div>

                    {/* Hot card 3 */}
                    <div className="border p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold">Giannis Antetokounmpo</h3>
                        <p className="text-gray-600">Select - 2013</p>
                        <p className="text-green-600 font-bold mt-2">+10% ↑</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
  