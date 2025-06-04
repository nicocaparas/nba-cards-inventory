
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AddCardPage from './pages/AddCardPage';
import CollectionPage from './pages/CollectionPage';
import Navbar from './components/Navbar';


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
    <Router>
      <Navbar />
      <div className="p-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-card" element={
            <AddCardPage
              newCard={newCard}
              setNewCard={setNewCard}
              handleAddCard={handleAddCard}
            />
          } />
          <Route path="/collection" element={
            <CollectionPage
              cards={cards}
              handleDelete={handleDelete}
              editVisibleId={editVisibleId}
              toggleEdit={toggleEdit}
            />
          } />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;

