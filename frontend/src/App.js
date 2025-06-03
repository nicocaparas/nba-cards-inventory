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
  });

  // For the edit button 
  const [editVisibleId, setEditVisibleId] = useState(null);

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
      grader: newCard.grader ? newCard.grader : null,   
      grade: newCard.grade ? parseFloat(newCard.grade) : null, 
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

  const toggleEdit = (id) => {
    if (editVisibleId === id) {
      setEditVisibleId(null); // close if already open
    } else {
      setEditVisibleId(id); // show for this card
    }
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
          className="mb-10 p-8 border rounded-lg shadow-lg grid gap-6 max-w-2xl mx-auto bg-white"
        >
          {/* Player Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Player Info</h3>
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Rookie Checkbox — add it below the grid for better flow */}
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newCard.isRookie}
                  onChange={(e) => setNewCard({ ...newCard, isRookie: e.target.checked })}
                />
                Rookie Card
              </label>
            </div>
          </div>


          {/* Card Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Card Info</h3>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Grading Info */}
          <div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newCard.isGraded}
                  onChange={(e) => setNewCard({ ...newCard, isGraded: e.target.checked })}
                /> Graded
              </label>
            </div>
            {newCard.isGraded && (
              <div className="mt-4">
                {/* Move the title OUTSIDE the grid */}
                <h3 className="text-lg font-semibold mb-2">Grading Info</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Grader Dropdown */}
                  <select
                    value={newCard.grader}
                    onChange={(e) => setNewCard({ ...newCard, grader: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Grader</option>
                    <option value="PSA">PSA</option>
                    <option value="BGS">BGS</option>
                  </select>

                  {/* Grade Dropdown */}
                  <select
                    value={newCard.grade}
                    onChange={(e) => setNewCard({ ...newCard, grade: parseFloat(e.target.value) })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Grade</option>
                    <option value="10">10</option>
                    <option value="9.5">9.5</option>
                    <option value="9">9</option>
                    <option value="8.5">8.5</option>
                    <option value="8">8</option>
                    <option value="7.5">7.5</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>
            )}
            </div>

          {/* Price Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Pricing Info</h3>
            <input
              type="number"
              placeholder="Acquire Price"
              value={newCard.acquirePrice}
              onChange={(e) => setNewCard({ ...newCard, acquirePrice: parseFloat(e.target.value) })}
              className="border p-2 rounded"
              step="0.01"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-lg font-semibold shadow-md"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
      

      {/* Card List */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
          📚 Your Collection
        </h2>

        <div className="flex flex-col gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between border border-gray-300 p-4 rounded-2xl shadow-md bg-white hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              {/* Player Name + RC */}
              <div className="flex items-center gap-2 w-1/5 font-bold">
                {card.playerName}
                {card.isRookie && (
                  <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                    RC
                  </span>
                )}
              </div>

              {/* Year + Brand */}
              <div className="w-1/5 text-gray-600">{card.year} {card.cardBrand}</div>

              {/* Variant */}
              <div className="w-1/5 text-gray-500">{card.variant || "-"}</div>

              {/* Grader + Grade */}
              <div className="w-1/5 text-sm">
                {card.isGraded ? (
                  <>{card.grader} {card.grade}</>
                ) : (
                  <>-</>
                )}
              </div>

              {/* Price */}
              <div className="w-1/12 text-green-600 font-bold">
                {card.acquirePrice ? `$${card.acquirePrice}` : "—"}
              </div>

              {/* Edit Icon */}
              <div className="flex items-center justify-end gap-2 w-1/12">
                {editVisibleId === card.id && (
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition font-semibold"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => toggleEdit(card.id)}
                  className="transform hover:scale-125 transition-all duration-200"
                >
                  ✏️
                </button>
              </div>

            </div>
          
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

