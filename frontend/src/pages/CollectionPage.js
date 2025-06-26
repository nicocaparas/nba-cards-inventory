import { useState } from 'react';
import { useCards } from '../context/CardsContext';
import axios from 'axios';
import CardForm from '../components/CardForm';

function CollectionPage() {
    const { cards, setCards, fetchCards } = useCards(); // use Context
    const [editVisibleId, setEditVisibleId] = useState(null); // For the edit button 
    const [editingCard, setEditingCard] = useState(null);

    const [editFormData, setEditFormData] = useState({
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
        trackPrices: false,
    });

    // Function to handle deleting a card by its ID
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/cards/${id}`)
            .then(() => {
                // Remove the card from card context 
                setCards((prevCards) => prevCards.filter((card) => card.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting card:', error);
            });
    };

    // Toggle edit visibility per card
    const toggleEdit = (id) => {
        setEditVisibleId((prevId) => (prevId === id ? null : id));
    };

    // When user clicks Edit button, preload form
    const handleEditClick = (card) => {
        // Sets editingCard to the card object 
        setEditingCard(card); 
        // Sets the form with card metadata
        setEditFormData({
            playerName: card.playerName || '',
            year: card.year || '',
            cardBrand: card.cardBrand || '',
            cardNum: card.cardNum || '',
            variant: card.variant || '',
            isRookie: card.isRookie || false,
            isGraded: card.isGraded || false,
            grader: card.grader || '',
            grade: card.grade || '',
            acquirePrice: card.acquirePrice || '',
            trackPrices: card.trackPrices || false,
        });
    };

    // Handle form submit to update card
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Clean empty strings → nulls
        const cleanedData = {
            ...editFormData,
            grader: editFormData.grader && editFormData.grader.trim() !== '' ? editFormData.grader.trim() : null,
            grade: editFormData.grade !== '' ? parseFloat(editFormData.grade) : null,
        };

        try {
            const response = await axios.put(`http://localhost:5000/cards/${editingCard.id}`, cleanedData);

            console.log('Card updated:', response.data);

            await fetchCards(); // 🟢 Updates the cards list
            setEditingCard(null); // Close the form after successful edit
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Failed to update the card. Please try again.');
          }
    };

    return (
        <div>
            {/* Card List */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
                    📚 Your Collection
                </h2>

                <div className="flex flex-col gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="flex flex-col gap-2">
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
                                        <>
                                            <button
                                                onClick={() => handleDelete(card.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition font-semibold"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(card)}
                                                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition font-semibold"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => toggleEdit(card.id)}
                                        className="transform hover:scale-125 transition-all duration-200"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>

                                {editingCard && editingCard.id === card.id && (
                                    <CardForm
                                        formData={editFormData}
                                        setFormData={setEditFormData}
                                        handleSubmit={handleFormSubmit}
                                        isEditMode={true}
                                        setEditingCard={setEditingCard}
                                    />
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CollectionPage;
  