import { useState } from 'react';
import { useCards } from '../context/CardsContext';

function HomePage() {
    const { cards } = useCards(); // Get cards from Context

    const [searchTerm, setSearchTerm] = useState('');

    // Filter cards based on search
    const filteredCards = cards.filter(card =>
        card.playerName.toLowerCase().includes(searchTerm.toLowerCase())
    ); 

    return (
        <div className="-mt-7">
            <div className="flex justify-center mb-6">
                <div className="inline-block text-center bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded p-3">
                    Tip: Use the menu above to add cards, manage your collection, or try the "Get eBay Values" feature to analyze market prices.
                </div>
            </div>

            {/* Website Title */}
            <h1 className="text-5xl font-bold text-center text-blue-600 mb-10">
                NBA Card Inventory
            </h1>

            {/* Search Bar */}
            <p className="text-center text-gray-600 mb-6">
                Search your collection to quickly find NBA cards you’ve added.
            </p>

            <div className="mb-10 flex justify-center">
                <input
                    type="text"
                    placeholder="Search for cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full max-w-2xl shadow"
                />
            </div>

            {/* Search Results Section */}
            {searchTerm && (
                <div className={`mb-10 px-4 transition-opacity transition-transform duration-700 ease-in-out ${searchTerm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                    }`}>                
                    <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
                        Search Results
                    </h2>

                    {filteredCards.length > 0 ? (
                        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                            {filteredCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="flex items-center justify-between border border-gray-300 p-4 rounded-2xl shadow-md bg-white hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold">{card.playerName}</h3>
                                        <p className="text-gray-600 text-sm">
                                            {[card.year, card.cardBrand, card.variant, card.isGraded ? `${card.grader} ${card.grade}` : null]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </p>
                                    </div>
                                    {/* Placeholder for action buttons (optional) */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No cards found.</p>
                    )}
                </div>
            )}

            {/* Hot Cards Section */}

            <div className="mb-10 bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
                    🔥 Hot Cards 🔥
                </h2>

                <p className="text-center text-sm text-gray-500 mb-6">
                    Demo data only. The Hot Cards shown here are fictional and do not reflect actual market trends.
                </p>

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
  