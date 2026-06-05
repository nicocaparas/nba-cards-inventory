import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import proDashboardCards from '../data/proDashboardCards';

// Create a Context
const CardsContext = createContext();

// Create a Provider Component
export function CardsProvider({ children }) {
    const [cards, setCards] = useState(proDashboardCards);

    // Function to fetch cards from backend
    const fetchCards = () => {
        if (!process.env.REACT_APP_BASE_URL) {
            setCards(proDashboardCards);
            return Promise.resolve(proDashboardCards);
        }

        return axios.get(`${process.env.REACT_APP_BASE_URL}/cards`)
            .then((response) => {
                // Sort cards by playerName (A → Z)
                const sortedCards = response.data.sort((a, b) =>
                    a.playerName.localeCompare(b.playerName)
                );
                setCards(sortedCards);
                return sortedCards;
            })
            .catch((error) => {
                console.error('Error fetching cards:', error);
                setCards(proDashboardCards);
                return proDashboardCards;
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
