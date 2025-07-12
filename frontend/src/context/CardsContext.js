import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a Context
const CardsContext = createContext();

// Create a Provider Component
export function CardsProvider({ children }) {
    const [cards, setCards] = useState([]);

    // Function to fetch cards from backend
    const fetchCards = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/cards`)
            .then((response) => {
                // Sort cards by playerName (A → Z)
                const sortedCards = response.data.sort((a, b) =>
                    a.playerName.localeCompare(b.playerName)
                );
                setCards(sortedCards);
            })
            .catch((error) => {
                console.error('Error fetching cards:', error);
                alert('Failed to load cards. Please try again later.');
            });
    };

    // Fetch cards on first load
    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <CardsContext.Provider value={{ cards, setCards, fetchCards }}>
            {children}
        </CardsContext.Provider>
    );
}

// Create a custom hook to access the context
export function useCards() {
    const context = useContext(CardsContext);
    if (!context) {
        throw new Error('useCards must be used within a CardsProvider');
    }
    return context;
  }