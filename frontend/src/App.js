import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AddCardPage from './pages/AddCardPage';
import CollectionPage from './pages/CollectionPage';
import Navbar from './components/Navbar';

import { CardsProvider } from './context/CardsContext'; 

function App() {
  return (
    <CardsProvider>
      <Router>
        <Navbar />
        <div className="p-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-card" element={<AddCardPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </div>
      </Router>
    </CardsProvider>  
  );
}

export default App;

