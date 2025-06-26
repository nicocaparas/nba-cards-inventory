import { useState } from 'react';
import { useCards } from '../context/CardsContext';
import axios from 'axios';
import CardForm from '../components/CardForm';

function AddCardPage() {
    const { setCards } = useCards(); // Get setCards from Context

    // Local form state (only for this page)
    const [newCard, setNewCard] = useState({
        playerName: '',
        year: '',
        cardBrand: '',
        cardNum: '',
        variant: '',
        isRookie: false,
        isGraded: false,
        grader: '',
        grade: '',
        acquirePrice: '',
    });

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

        // Sends card data to the backend
        axios.post('http://localhost:5000/cards', cardData)
            .then((response) => {
                // Backend sends card data back once successfully added to the database
                const createdCard = response.data;
                setCards((prevCards) => [...prevCards, createdCard]); // Update the Context

                // Clear the form after submit
                setNewCard({
                    playerName: '',
                    year: '',
                    cardBrand: '',
                    cardNum: '',
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

    
    return (
        <div>
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
                    ➕ Add New Card
                </h2>
                <CardForm
                    formData={newCard}
                    setFormData={setNewCard}
                    handleSubmit={handleAddCard}
                    isEditMode={false}
                />
            </div>
        </div>
    );
}

export default AddCardPage;
