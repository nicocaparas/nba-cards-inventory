import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'; // Fallback safety

export async function searchEbayCards(query) {
    const response = await axios.get(`${BASE}/api/ebay/search?q=${encodeURIComponent(query)}`);
    return response.data;
}