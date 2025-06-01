import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch cards from the backend
    axios.get('http://localhost:5000/cards')
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
      });
  }, []);

  // Function to handle deleting a card by its ID
  // Sends a DELETE request to the backend and updates the local state
  const handleDelete = (id) => {
  axios.delete(`http://localhost:5000/cards/${id}`)
    .then(() => {
      // Update the state by filtering out the deleted card
      setCards(cards.filter((card) => card.id !== id));
    })
    .catch((error) => {
      console.error('Error deleting card:', error);
    });
  };



  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
        NBA Card Inventory
      </h1>

      {/* Card List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="border p-5 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{card.playerName}</h2>
            <p className="text-gray-600">{card.cardBrand} - {card.year}</p>
            {card.variant && <p className="text-sm italic text-gray-500">{card.variant}</p>}
            <p className="text-green-600 font-bold">${card.estimatedValue || "N/A"}</p>
            {card.isRookie && (
              <span className="text-xs bg-yellow-300 p-1 rounded inline-block mt-2">
                Rookie Card
              </span>
            )}
            {card.isGraded && (
              <p className="text-sm mt-1">
                Graded: {card.grade} ({card.grader})
              </p>
            )}
            <button
              onClick={() => handleDelete(card.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

