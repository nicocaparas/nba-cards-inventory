import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCards } from '../context/CardsContext';
import axios from 'axios';
import CardForm from '../components/CardForm';
import proDashboardCards from '../data/proDashboardCards';
import './CollectionPage.css';

const TABULATOR_CSS_ID = 'tabulator-cdn-css';
const TABULATOR_SCRIPT_ID = 'tabulator-cdn-script';
const TABULATOR_CSS_URL = 'https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator.min.css';
const TABULATOR_SCRIPT_URL = 'https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator.min.js';

function useTabulatorLibrary() {
    const [isReady, setIsReady] = useState(() => Boolean(window.Tabulator));

    useEffect(() => {
        if (window.Tabulator) {
            setIsReady(true);
            return undefined;
        }

        if (!document.getElementById(TABULATOR_CSS_ID)) {
            const link = document.createElement('link');
            link.id = TABULATOR_CSS_ID;
            link.rel = 'stylesheet';
            link.href = TABULATOR_CSS_URL;
            document.head.appendChild(link);
        }

        let script = document.getElementById(TABULATOR_SCRIPT_ID);
        const handleLoad = () => setIsReady(Boolean(window.Tabulator));

        if (!script) {
            script = document.createElement('script');
            script.id = TABULATOR_SCRIPT_ID;
            script.src = TABULATOR_SCRIPT_URL;
            script.async = true;
            script.addEventListener('load', handleLoad);
            document.body.appendChild(script);
        } else {
            script.addEventListener('load', handleLoad);
        }

        return () => {
            script.removeEventListener('load', handleLoad);
        };
    }, []);

    return isReady;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[character]));
}

function sortIsoDateStrings(leftDate, rightDate) {
    return String(leftDate || '').localeCompare(String(rightDate || ''));
}

function normalizeCard(card) {
    const grade = card.grade === null || card.grade === undefined || card.grade === ''
        ? null
        : Number(card.grade);
    const grader = card.grader || (card.isGraded ? 'PSA' : 'Raw');
    const cardTitle = card.cardTitle
        || [card.year, card.cardBrand, card.playerName, card.variant].filter(Boolean).join(' ');

    return {
        ...card,
        cardTitle,
        playerName: card.playerName || 'Unknown Player',
        image: card.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(card.playerName || 'NBA Card')}&background=0d1b3e&color=f5a623`,
        grader,
        grade,
        gradeLabel: grade ? `${grader} ${grade}` : 'Raw',
        acquirePrice: Number(card.acquirePrice) || 0,
        status: card.status || (grade ? 'Hold' : 'Raw'),
        acquiredDate: card.acquiredDate || new Date().toISOString().slice(0, 10),
    };
}

function CollectionPage() {
    const { cards, setCards, fetchCards } = useCards(); // use Context
    const [editingCard, setEditingCard] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const tableRef = useRef(null);
    const tableInstanceRef = useRef(null);
    const isTabulatorReady = useTabulatorLibrary();

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

    const tableData = useMemo(() => {
        const sourceCards = cards.length > 0 ? cards : proDashboardCards;
        return sourceCards.map(normalizeCard);
    }, [cards]);

    // Function to handle deleting a card by its ID
    const handleDelete = useCallback((id) => {
        if (!process.env.REACT_APP_BASE_URL || String(id).startsWith('mock-')) {
            setCards((prevCards) => prevCards.filter((card) => card.id !== id));
            return;
        }

        axios.delete(`${process.env.REACT_APP_BASE_URL}/cards/${id}`)
            .then(() => {
                // Remove the card from card context 
                setCards((prevCards) => prevCards.filter((card) => card.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting card:', error);
                alert('Failed to delete card. Please try again later.');
            });
    }, [setCards]);

    // When user clicks Edit button, preload form
    const handleEditClick = useCallback((card) => {
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
    }, []);

    useEffect(() => {
        if (!isTabulatorReady || !tableRef.current) {
            return undefined;
        }

        tableInstanceRef.current = new window.Tabulator(tableRef.current, {
            data: tableData,
            layout: 'fitColumns',
            pagination: true,
            paginationSize: 20,
            paginationSizeSelector: [20, 50, 100],
            placeholder: 'No cards match this view.',
            initialSort: [{ column: 'acquiredDate', dir: 'desc' }],
            columns: [
                {
                    title: '',
                    field: 'image',
                    width: 74,
                    headerSort: false,
                    formatter: (cell) => `<img class="card-avatar" alt="" src="${escapeHtml(cell.getValue())}" />`,
                },
                {
                    title: 'Card',
                    field: 'cardTitle',
                    minWidth: 250,
                    formatter: (cell) => {
                        const row = cell.getRow().getData();
                        return `<span class="card-title-cell"><strong>${escapeHtml(row.cardTitle)}</strong><span>${escapeHtml(row.playerName)}</span></span>`;
                    },
                },
                {
                    title: 'Grade',
                    field: 'grade',
                    width: 120,
                    sorter: 'number',
                    formatter: (cell) => {
                        const row = cell.getRow().getData();
                        const className = row.grade >= 10 ? 'grade-badge--gem' : row.grade ? 'grade-badge--graded' : 'grade-badge--raw';
                        return `<span class="grade-badge ${className}">${escapeHtml(row.gradeLabel)}</span>`;
                    },
                },
                {
                    title: 'Value',
                    field: 'acquirePrice',
                    width: 130,
                    sorter: 'number',
                    hozAlign: 'right',
                    formatter: (cell) => `<strong>${formatCurrency(cell.getValue())}</strong>`,
                },
                {
                    title: 'Status',
                    field: 'status',
                    width: 130,
                    formatter: (cell) => `<span class="status-tag">${escapeHtml(cell.getValue())}</span>`,
                },
                {
                    title: 'Date',
                    field: 'acquiredDate',
                    width: 128,
                    sorter: sortIsoDateStrings,
                },
                {
                    title: 'Actions',
                    field: 'id',
                    width: 150,
                    headerSort: false,
                    formatter: () => `
                        <button class="table-action" type="button" data-action="edit">Edit</button>
                        <button class="table-action table-action--danger" type="button" data-action="delete">Delete</button>
                    `,
                    cellClick: (event, cell) => {
                        const action = event.target.dataset.action;
                        const card = cell.getRow().getData();

                        if (action === 'edit') {
                            handleEditClick(card);
                        }

                        if (action === 'delete') {
                            handleDelete(card.id);
                        }
                    },
                },
            ],
        });

        return () => {
            tableInstanceRef.current?.destroy();
            tableInstanceRef.current = null;
        };
    }, [handleDelete, handleEditClick, isTabulatorReady, tableData]);

    useEffect(() => {
        if (!tableInstanceRef.current) {
            return;
        }

        if (!globalSearch.trim()) {
            tableInstanceRef.current.clearFilter();
            return;
        }

        tableInstanceRef.current.setFilter('playerName', 'like', globalSearch.trim());
    }, [globalSearch, isTabulatorReady, tableData]);

    // Handle form submit to update card
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Clean empty strings → nulls
        const cleanedData = {
            ...editFormData,
            grader: editFormData.grader && editFormData.grader.trim() !== '' ? editFormData.grader.trim() : null,
            grade: editFormData.grade !== '' ? parseFloat(editFormData.grade) : null,
        };

        if (!process.env.REACT_APP_BASE_URL || String(editingCard.id).startsWith('mock-')) {
            setCards((prevCards) => prevCards.map((card) => (
                card.id === editingCard.id ? { ...card, ...cleanedData } : card
            )));
            setEditingCard(null);
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/cards/${editingCard.id}`, cleanedData);

            console.log('Card updated:', response.data);

            await fetchCards(); // 🟢 Updates the cards list
            setEditingCard(null); // Close the form after successful edit
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Failed to update the card. Please try again.');
          }
    };

    return (
        <div className="pro-dashboard">
            <div className="pro-dashboard__header">
                <div>
                    <h2 className="pro-dashboard__title">Pro Dashboard Cards</h2>
                    <p className="pro-dashboard__subtitle">
                        Interactive Tabulator.js table with NBA card mock data, sortable value/grade/date columns, player search, and 20-row pagination.
                    </p>
                </div>

                <input
                    type="search"
                    className="pro-dashboard__search"
                    placeholder="Search player name..."
                    value={globalSearch}
                    onChange={(event) => setGlobalSearch(event.target.value)}
                    aria-label="Search by player name"
                />
            </div>

            {!isTabulatorReady && (
                <div className="pro-dashboard__loading">Loading Tabulator table...</div>
            )}
            <div className="pro-dashboard__table" ref={tableRef} />

            {editingCard && (
                <div className="pro-dashboard__edit-panel">
                    <CardForm
                        formData={editFormData}
                        setFormData={setEditFormData}
                        handleSubmit={handleFormSubmit}
                        isEditMode={true}
                        setEditingCard={setEditingCard}
                    />
                </div>
            )}
        </div>
    );
}

export default CollectionPage;
