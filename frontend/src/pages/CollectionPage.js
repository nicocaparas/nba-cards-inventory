import { useEffect, useMemo, useRef, useState } from 'react';
import { useCards } from '../context/CardsContext';
import proDashboardCards, { avatarDataUri } from '../data/proDashboardCards';
import './CollectionPage.css';

const TABULATOR_CSS = 'https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css';
const TABULATOR_JS = 'https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js';

function ensureStylesheet() {
    if (document.querySelector(`link[href="${TABULATOR_CSS}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = TABULATOR_CSS;
    document.head.appendChild(link);
}

function ensureTabulatorScript() {
    if (window.Tabulator) {
        return Promise.resolve(window.Tabulator);
    }

    const existing = document.querySelector(`script[src="${TABULATOR_JS}"]`);
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve(window.Tabulator), { once: true });
            existing.addEventListener('error', reject, { once: true });
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = TABULATOR_JS;
        script.async = true;
        script.onload = () => resolve(window.Tabulator);
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function gradeClass(gradeLabel) {
    if (gradeLabel === 'Raw') {
        return 'grade-badge--raw';
    }

    if (gradeLabel.includes('10')) {
        return 'grade-badge--gem';
    }

    return 'grade-badge--graded';
}

function lastName(playerName) {
    return playerName.split(' ').slice(-1)[0] || playerName;
}

function normalizeCollectionCards(cards) {
    return cards.map((card, index) => {
        const playerName = card.playerName || 'Unknown Player';
        const year = card.year || 'Modern';
        const brand = card.cardBrand || 'HoopStock';
        const gradeLabel = card.isGraded && card.grade ? `${card.grader || 'PSA'} ${card.grade}` : 'Raw';
        const value = Number(card.acquirePrice) || 0;
        const numericGrade = gradeLabel === 'Raw' ? 0 : Number(String(card.grade).replace(/[^0-9.]/g, '')) || 0;

        return {
            id: card.id || `collection-${index}`,
            playerName,
            avatar: avatarDataUri(playerName, index),
            cardTitle: `${year} ${brand} ${lastName(playerName)}`,
            gradeLabel,
            gradeSort: numericGrade,
            value,
            status: card.trackPrices ? 'Tracked' : card.isGraded ? 'Vaulted' : 'Raw Review',
            dateAdded: card.createdAt || card.updatedAt || `2026-05-${String(20 - (index % 19)).padStart(2, '0')}`,
        };
    });
}

function currencyFormatter(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function CollectionPage() {
    const { cards } = useCards();
    const tableElementRef = useRef(null);
    const tableInstanceRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadState, setLoadState] = useState('loading');

    const rows = useMemo(() => {
        return cards.length > 0 ? normalizeCollectionCards(cards) : proDashboardCards;
    }, [cards]);

    const summary = useMemo(() => {
        const totalValue = rows.reduce((sum, card) => sum + card.value, 0);
        const gemCount = rows.filter((card) => card.gradeLabel.includes('10')).length;
        const rawCount = rows.filter((card) => card.gradeLabel === 'Raw').length;

        return {
            totalCards: rows.length,
            totalValue,
            gemCount,
            rawCount,
        };
    }, [rows]);

    useEffect(() => {
        let isCancelled = false;

        async function buildTable() {
            try {
                ensureStylesheet();
                const Tabulator = await ensureTabulatorScript();

                if (isCancelled || !tableElementRef.current) {
                    return;
                }

                if (tableInstanceRef.current) {
                    tableInstanceRef.current.destroy();
                }

                tableInstanceRef.current = new Tabulator(tableElementRef.current, {
                    data: rows,
                    layout: 'fitColumns',
                    pagination: true,
                    paginationSize: 20,
                    height: '640px',
                    placeholder: 'No NBA cards match this view.',
                    initialSort: [{ column: 'value', dir: 'desc' }],
                    columns: [
                        {
                            title: '',
                            field: 'avatar',
                            width: 72,
                            hozAlign: 'center',
                            headerSort: false,
                            formatter: (cell) => `<img class="card-avatar" src="${cell.getValue()}" alt="">`,
                        },
                        {
                            title: 'Card',
                            field: 'cardTitle',
                            minWidth: 260,
                            formatter: (cell) => {
                                const data = cell.getRow().getData();
                                return `
                                    <div class="card-title-cell">
                                        <strong>${escapeHtml(data.cardTitle)}</strong>
                                        <span>${escapeHtml(data.playerName)}</span>
                                    </div>
                                `;
                            },
                        },
                        {
                            title: 'Grade',
                            field: 'gradeSort',
                            width: 128,
                            sorter: 'number',
                            formatter: (cell) => {
                                const label = cell.getRow().getData().gradeLabel;
                                return `<span class="grade-badge ${gradeClass(label)}">${escapeHtml(label)}</span>`;
                            },
                        },
                        {
                            title: 'Value',
                            field: 'value',
                            width: 140,
                            sorter: 'number',
                            hozAlign: 'right',
                            formatter: (cell) => `<span class="currency-cell">${currencyFormatter(cell.getValue())}</span>`,
                        },
                        {
                            title: 'Status',
                            field: 'status',
                            width: 142,
                            formatter: (cell) => `<span class="status-tag">${escapeHtml(cell.getValue())}</span>`,
                        },
                        {
                            title: 'Date Added',
                            field: 'dateAdded',
                            width: 148,
                            sorter: 'date',
                            sorterParams: { format: 'yyyy-MM-dd' },
                        },
                    ],
                });

                setLoadState('ready');
            } catch (error) {
                console.error('Failed to load Tabulator dashboard:', error);
                setLoadState('error');
            }
        }

        setLoadState('loading');
        buildTable();

        return () => {
            isCancelled = true;
            if (tableInstanceRef.current) {
                tableInstanceRef.current.destroy();
                tableInstanceRef.current = null;
            }
        };
    }, [rows]);

    useEffect(() => {
        const table = tableInstanceRef.current;
        if (!table || loadState !== 'ready') {
            return;
        }

        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            table.clearFilter(true);
            return;
        }

        table.setFilter((data, params) => {
            return data.playerName.toLowerCase().includes(params.term);
        }, { term });
    }, [loadState, searchTerm]);

    return (
        <section className="collection-dashboard" aria-labelledby="collection-dashboard-title">
            <div className="collection-dashboard__header">
                <div>
                    <p className="collection-dashboard__eyebrow">C.A.R.D.S. Pro Dashboard</p>
                    <h1 className="collection-dashboard__title" id="collection-dashboard-title">
                        NBA card inventory
                    </h1>
                    <p className="collection-dashboard__copy">
                        Mock NBA card data is wired into a Tabulator.js table with player search, pagination, and sortable value,
                        grade, and date columns. Saved collection data will automatically replace the demo rows when the API is
                        available.
                    </p>
                </div>

                <div className="collection-dashboard__search">
                    <label htmlFor="player-search">Global player search</label>
                    <input
                        id="player-search"
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search Jordan, Curry, Wembanyama..."
                    />
                </div>
            </div>

            <div className="collection-dashboard__summary" aria-label="Collection summary">
                <div className="collection-dashboard__metric">
                    <span>Total cards</span>
                    <strong>{summary.totalCards}</strong>
                </div>
                <div className="collection-dashboard__metric">
                    <span>Total value</span>
                    <strong>{currencyFormatter(summary.totalValue)}</strong>
                </div>
                <div className="collection-dashboard__metric">
                    <span>PSA 10</span>
                    <strong>{summary.gemCount}</strong>
                </div>
                <div className="collection-dashboard__metric">
                    <span>Raw review</span>
                    <strong>{summary.rawCount}</strong>
                </div>
            </div>

            <div className="collection-dashboard__table-shell">
                {loadState === 'loading' && (
                    <div className="collection-dashboard__loading">Loading interactive table...</div>
                )}
                {loadState === 'error' && (
                    <div className="collection-dashboard__error">
                        Tabulator could not load from the CDN. Please check the network connection and refresh.
                    </div>
                )}
                <div ref={tableElementRef} aria-label="Interactive NBA cards table" />
            </div>
        </section>
    );
}

export default CollectionPage;
