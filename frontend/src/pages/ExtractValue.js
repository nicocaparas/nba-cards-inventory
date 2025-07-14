import { useState, useEffect } from 'react';

const ExtractValue = () => {
    const [query, setQuery] = useState('Apple iPhone 8 64GB');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            // Simulate delay — e.g. 1.5 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/ebay-extract/analyze?query=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            // If backend returns error then display error 
            if (!response.ok) {
                setError(data.error || 'Failed to fetch data.');
                return;
              }

            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Network error. Please check your connection and try again.');
            alert('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // REMOVE THIS WHEN LIVE
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 mb-10 -mt-7">
            {/* Page Title */}
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                📈 Extract Card Average Value
            </h2>

            <p className="text-center text-gray-600 mb-6">
                Search recent sold listings and average prices for your NBA cards using eBay data.
            </p>

            <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 p-3 rounded mb-4">
                <strong>Note:</strong> This demo automatically loads results for “Apple iPhone 8 64GB” using mock data. 
                Searching for any other terms will result in an error, as the live eBay API integration is still pending approval.
            </p>


            {/* Search Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter card name, year, brand..."
                    className="border border-gray-300 p-3 rounded w-full max-w-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded shadow hover:bg-blue-700 transition"
                >
                    Extract Value
                </button>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <p className="text-center text-gray-500 mb-4 animate-pulse">Loading data...</p>
            )}

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-600 font-medium mb-6">
                    {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="bg-white rounded-2xl shadow p-6 mt-8">
                    <h3 className="text-3xl font-bold text-blue-500 mb-4">Results</h3>

                    <p className="text-sm text-gray-600 mt-4 mb-4">
                        <strong>Disclaimer:</strong> The results shown below are based on mock data
                        for demonstration purposes only. This page simulates how the application
                        will display average prices and sample listings once connected to the live
                        eBay API. The listings and prices shown are not real eBay data and do not
                        reflect actual search results.
                    </p>

                    <div className="mb-4">
                        <h4 className="text-2xl font-extrabold text-gray-800 mb-2">
                            Item Name: Apple iPhone 8 64GB
                        </h4>

                        <p className="text-2xl">
                            <span className="font-bold text-gray-700">Average Value:</span>{' '}
                            <span className="text-green-600 font-bold">
                                ${result.averagePrice?.toFixed(2)}
                            </span>
                        </p>
                        <p className="text-2xl">
                            <span className="font-bold text-gray-700">Sample Count:</span>{' '}
                            {result.sampleCount}
                        </p>
                    </div>

                    {/* Adds a horizontal line */}
                    <hr className="my-4 border-gray-200" />

                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                        Sample Listings
                    </h4>
                    <ul className="space-y-3">
                        {result.usedListings?.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-gray-700">{item.title}</p>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800 text-sm mt-1 inline-block"
                                    >
                                        View on eBay
                                    </a>
                                    <p className="text-gray-500 text-sm">
                                        Sold on {item.date}
                                    </p>
                                </div>
                                <p className="text-green-600 font-bold text-lg">
                                    ${item.price}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ExtractValue;
