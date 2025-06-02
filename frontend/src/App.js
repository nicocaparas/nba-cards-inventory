import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // For the list 
  const [cards, setCards] = useState([]);

  // For the form 
  const [newCard, setNewCard] = useState({
    playerName: '',
    year: '',
    cardBrand: '',
    variant: '',
    isRookie: false,
    isGraded: false,
    grader: '',
    grade: '',
    acquirePrice: '',
    estimatedValue: '',
    lastUpdated: '',
    listedForSale: false,
  });
  
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

  // Submits the form to add a new card:
  // - Sends POST request to backend
  // - Updates cards state on success
  // - Clears the form after submission
  const handleAddCard = (e) => {
    e.preventDefault();

    // Prepare the data
    const cardData = {
      ...newCard,
      lastUpdated: newCard.lastUpdated ? new Date(newCard.lastUpdated).toISOString() : null,
    };

    axios.post('http://localhost:5000/cards', cardData)
      .then((response) => {
        setCards([...cards, response.data]);  // Add the new card to the list
        // Clear the form
        setNewCard({
          playerName: '',
          year: '',
          cardBrand: '',
          variant: '',
          isRookie: false,
          isGraded: false,
          grader: '',
          grade: '',
          acquirePrice: '',
          estimatedValue: '',
          lastUpdated: '',
          listedForSale: false,
        });
      })
      .catch((error) => {
        console.error('Error adding card:', error);
      });
  };  

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

      {/* Form to add new cards */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
          ➕ Add New Card
        </h2>
        <form
          onSubmit={handleAddCard}
          className="p-5 border rounded-lg shadow-lg grid gap-4 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Player Name"
            value={newCard.playerName}
            onChange={(e) => setNewCard({ ...newCard, playerName: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Year"
            value={newCard.year}
            onChange={(e) => setNewCard({ ...newCard, year: parseInt(e.target.value) })}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Card Brand"
            value={newCard.cardBrand}
            onChange={(e) => setNewCard({ ...newCard, cardBrand: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Variant"
            value={newCard.variant}
            onChange={(e) => setNewCard({ ...newCard, variant: e.target.value })}
            className="border p-2 rounded"
          />

          {/* Checkboxes */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newCard.isRookie}
              onChange={(e) => setNewCard({ ...newCard, isRookie: e.target.checked })}
            />
            Rookie Card
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newCard.isGraded}
              onChange={(e) => setNewCard({ ...newCard, isGraded: e.target.checked })}
            />
            Graded
          </label>

          {/* Grader and Grade */}
          <input
            type="text"
            placeholder="Grader"
            value={newCard.grader}
            onChange={(e) => setNewCard({ ...newCard, grader: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Grade"
            value={newCard.grade}
            onChange={(e) => setNewCard({ ...newCard, grade: parseFloat(e.target.value) })}
            className="border p-2 rounded"
            step="0.1"
          />

          <input
            type="number"
            placeholder="Acquire Price"
            value={newCard.acquirePrice}
            onChange={(e) => setNewCard({ ...newCard, acquirePrice: parseFloat(e.target.value) })}
            className="border p-2 rounded"
            step="0.01"
          />

          <input
            type="number"
            placeholder="Estimated Value"
            value={newCard.estimatedValue}
            onChange={(e) => setNewCard({ ...newCard, estimatedValue: parseFloat(e.target.value) })}
            className="border p-2 rounded"
            step="0.01"
          />

          <input
            type="date"
            value={newCard.lastUpdated}
            onChange={(e) => setNewCard({ ...newCard, lastUpdated: e.target.value })}
            className="border p-2 rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newCard.listedForSale}
              onChange={(e) => setNewCard({ ...newCard, listedForSale: e.target.checked })}
            />
            Listed for Sale
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Card
          </button>
        </form>
      </div>
      

      {/* Card List */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
          📚 Your Collection
        </h2>

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
    </div>
  );
}

export default App;

