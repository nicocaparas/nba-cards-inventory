import { useEffect, useState } from 'react';
import { searchEbayCards } from '../services/ebay';

function EbayTest() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        searchEbayCards('2003 Lebron topps PSA 10')
            .then((data) => {
                console.log('eBay listings:', data);  // 🐞 Log here
                setResults(data);
            })
            .catch((err) => {
                console.error('eBay error:', err);   // 🐞 And here
            });
    }, []);
      

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">🔍 eBay Listings Test</h1>
            {results.length === 0 ? (
                <p>Loading or no results found...</p>
            ) : (
                <ul className="space-y-4">
                    {results.map((item) => (
                        <li key={item.itemId} className="border p-4 rounded shadow">
                            <a href={item.itemWebUrl} target="_blank" rel="noreferrer">
                                <h2 className="font-bold text-lg">{item.title}</h2>
                                <p>Price: {item.price?.value} {item.price?.currency}</p>
                                {item.image?.imageUrl && (
                                    <img src={item.image.imageUrl} alt={item.title} className="w-48 mt-2" />
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EbayTest;
