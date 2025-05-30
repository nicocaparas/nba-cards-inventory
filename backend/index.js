// Imports express, cors, PrismaClient and loads env variables (DATABASE_URL from .env)
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Initialization 
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // parses incoming JSON in POST/PUT requests so you can use req.body

// Set Port 
const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
  res.send('NBA Card Inventory Backend is running');
});

// Routes are custom paths that the frontend and backend agree to use for communication.

// GET /cards → Return all cards
app.get('/cards', async (req, res) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// POST /cards → put a card into the database
app.post('/cards', async (req, res) => {
  try {
    const {
      playerName,
      year,
      cardBrand,
      variant,
      isRookie,
      isGraded,
      grader,
      grade,
      acquirePrice,
      estimatedValue,
      lastUpdated,
      listedForSale,
    } = req.body;

    const newCard = await prisma.card.create({
      data: {
        playerName,
        year,
        cardBrand,
        variant,
        isRookie,
        isGraded,
        grader,
        grade,
        acquirePrice,
        estimatedValue,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
        listedForSale,
      },
    });

    res.status(201).json(newCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// DELETE a specific card from the database

app.delete('/cards/:id', async (req, res) => {
  const cardId = parseInt(req.params.id);

  try {
    const deletedCard = await prisma.card.delete({
      where: { id: cardId },
    });

    res.json({ message: 'Card deleted successfully', card: deletedCard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});


// Start the server 
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
