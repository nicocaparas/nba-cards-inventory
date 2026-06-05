import { useEffect, useMemo, useRef, useState } from 'react';
import { useCards } from '../context/CardsContext';

const TABULATOR_CSS_ID = 'tabulator-midnight-css';
const TABULATOR_SCRIPT_ID = 'tabulator-script';
const TABULATOR_CSS_URL = 'https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_midnight.min.css';
const TABULATOR_SCRIPT_URL = 'https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js';

const mockCards = [
    { id: 'mock-1', playerName: 'Michael Jordan', title: '1986 Fleer Jordan Rookie', cardBrand: 'Fleer', year: 1986, gradeLabel: 'PSA 10', gradeScore: 10, value: 285000, status: 'Vaulted', date: '2026-05-18' },
    { id: 'mock-2', playerName: 'LeBron James', title: '2003 Topps Chrome Refractor', cardBrand: 'Topps Chrome', year: 2003, gradeLabel: 'PSA 10', gradeScore: 10, value: 72000, status: 'For Sale', date: '2026-05-12' },
    { id: 'mock-3', playerName: 'Kobe Bryant', title: '1996 Topps Chrome Rookie', cardBrand: 'Topps Chrome', year: 1996, gradeLabel: 'BGS 9.5', gradeScore: 9.5, value: 41000, status: 'Holding', date: '2026-04-25' },
    { id: 'mock-4', playerName: 'Stephen Curry', title: '2009 Topps Chrome Rookie', cardBrand: 'Topps', year: 2009, gradeLabel: 'PSA 9', gradeScore: 9, value: 18500, status: 'For Sale', date: '2026-04-19' },
    { id: 'mock-5', playerName: 'Giannis Antetokounmpo', title: '2013 Panini Prizm Silver', cardBrand: 'Panini Prizm', year: 2013, gradeLabel: 'PSA 10', gradeScore: 10, value: 13250, status: 'Watching', date: '2026-04-07' },
    { id: 'mock-6', playerName: 'Luka Doncic', title: '2018 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2018, gradeLabel: 'PSA 10', gradeScore: 10, value: 12400, status: 'Vaulted', date: '2026-03-30' },
    { id: 'mock-7', playerName: 'Victor Wembanyama', title: '2023 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2023, gradeLabel: 'Raw', gradeScore: 0, value: 1550, status: 'Grading', date: '2026-03-24' },
    { id: 'mock-8', playerName: 'Anthony Edwards', title: '2020 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2020, gradeLabel: 'PSA 10', gradeScore: 10, value: 3800, status: 'Holding', date: '2026-03-18' },
    { id: 'mock-9', playerName: 'Nikola Jokic', title: '2015 Prizm Rookie', cardBrand: 'Panini Prizm', year: 2015, gradeLabel: 'PSA 9', gradeScore: 9, value: 2400, status: 'For Sale', date: '2026-03-12' },
    { id: 'mock-10', playerName: 'Kevin Durant', title: '2007 Topps Chrome Rookie', cardBrand: 'Topps Chrome', year: 2007, gradeLabel: 'BGS 9.5', gradeScore: 9.5, value: 9200, status: 'Vaulted', date: '2026-03-03' },
    { id: 'mock-11', playerName: 'Shaquille ONeal', title: '1992 Topps Gold Rookie', cardBrand: 'Topps', year: 1992, gradeLabel: 'PSA 10', gradeScore: 10, value: 5200, status: 'Holding', date: '2026-02-26' },
    { id: 'mock-12', playerName: 'Tim Duncan', title: '1997 Finest Refractor Rookie', cardBrand: 'Finest', year: 1997, gradeLabel: 'PSA 9', gradeScore: 9, value: 4700, status: 'Watching', date: '2026-02-22' },
    { id: 'mock-13', playerName: 'Dirk Nowitzki', title: '1998 Topps Chrome Refractor', cardBrand: 'Topps Chrome', year: 1998, gradeLabel: 'Raw', gradeScore: 0, value: 1350, status: 'In Transit', date: '2026-02-14' },
    { id: 'mock-14', playerName: 'Allen Iverson', title: '1996 Bowmans Best Atomic', cardBrand: 'Bowmans Best', year: 1996, gradeLabel: 'PSA 9', gradeScore: 9, value: 3600, status: 'Holding', date: '2026-02-08' },
    { id: 'mock-15', playerName: 'Jayson Tatum', title: '2017 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2017, gradeLabel: 'PSA 10', gradeScore: 10, value: 6100, status: 'For Sale', date: '2026-02-01' },
    { id: 'mock-16', playerName: 'Ja Morant', title: '2019 Optic Holo Rookie', cardBrand: 'Donruss Optic', year: 2019, gradeLabel: 'Raw', gradeScore: 0, value: 425, status: 'Watching', date: '2026-01-28' },
    { id: 'mock-17', playerName: 'Shai Gilgeous-Alexander', title: '2018 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2018, gradeLabel: 'PSA 10', gradeScore: 10, value: 5100, status: 'Vaulted', date: '2026-01-21' },
    { id: 'mock-18', playerName: 'Caitlin Clark', title: '2024 Prizm Draft Silver', cardBrand: 'Panini Prizm', year: 2024, gradeLabel: 'Raw', gradeScore: 0, value: 690, status: 'Grading', date: '2026-01-18' },
    { id: 'mock-19', playerName: 'Magic Johnson', title: '1980 Topps Bird-Magic Rookie', cardBrand: 'Topps', year: 1980, gradeLabel: 'PSA 8', gradeScore: 8, value: 12800, status: 'Holding', date: '2026-01-12' },
    { id: 'mock-20', playerName: 'Larry Bird', title: '1980 Topps Bird-Magic Rookie', cardBrand: 'Topps', year: 1980, gradeLabel: 'PSA 8', gradeScore: 8, value: 12800, status: 'Holding', date: '2026-01-12' },
    { id: 'mock-21', playerName: 'Dwyane Wade', title: '2003 Topps Chrome Rookie', cardBrand: 'Topps Chrome', year: 2003, gradeLabel: 'PSA 10', gradeScore: 10, value: 8800, status: 'Vaulted', date: '2025-12-30' },
    { id: 'mock-22', playerName: 'Chris Paul', title: '2005 Topps Chrome Refractor', cardBrand: 'Topps Chrome', year: 2005, gradeLabel: 'PSA 9', gradeScore: 9, value: 2100, status: 'Watching', date: '2025-12-18' },
    { id: 'mock-23', playerName: 'Devin Booker', title: '2015 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2015, gradeLabel: 'PSA 10', gradeScore: 10, value: 3300, status: 'For Sale', date: '2025-12-11' },
    { id: 'mock-24', playerName: 'Damian Lillard', title: '2012 Prizm Rookie', cardBrand: 'Panini Prizm', year: 2012, gradeLabel: 'Raw', gradeScore: 0, value: 520, status: 'In Transit', date: '2025-12-04' },
    { id: 'mock-25', playerName: 'Tracy McGrady', title: '1997 Metal Universe Rookie', cardBrand: 'Metal Universe', year: 1997, gradeLabel: 'PSA 9', gradeScore: 9, value: 1750, status: 'Holding', date: '2025-11-25' },
    { id: 'mock-26', playerName: 'Vince Carter', title: '1998 Topps Chrome Rookie', cardBrand: 'Topps Chrome', year: 1998, gradeLabel: 'PSA 10', gradeScore: 10, value: 3900, status: 'Vaulted', date: '2025-11-19' },
    { id: 'mock-27', playerName: 'Zion Williamson', title: '2019 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2019, gradeLabel: 'Raw', gradeScore: 0, value: 480, status: 'Watching', date: '2025-11-08' },
    { id: 'mock-28', playerName: 'Paolo Banchero', title: '2022 Prizm Silver Rookie', cardBrand: 'Panini Prizm', year: 2022, gradeLabel: 'PSA 10', gradeScore: 10, value: 1125, status: 'For Sale', date: '2025-11-01' },
];

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function makeAvatar(playerName) {
    const initials = encodeURIComponent(playerName);
    return `https://ui-avatars.com/api/?name=${initials}&background=0b1f3a&color=f8b84e&bold=true&size=96`;
}

function mapSavedCard(card) {
    const gradeLabel = card.isGraded && card.grader && card.grade ? `${card.grader} ${card.grade}` : 'Raw';
    const value = Number(card.acquirePrice || card.currentValue || 0);
    const titleParts = [card.year, card.cardBrand, card.variant || card.cardNum].filter(Boolean);

    return {
        id: card.id,
        playerName: card.playerName || 'Unknown Player',
        title: titleParts.length ? titleParts.join(' ') : 'Personal collection card',
        cardBrand: card.cardBrand || 'Collection',
        year: card.year || '',
        gradeLabel,
        gradeScore: card.isGraded && card.grade ? Number(card.grade) : 0,
        value,
        status: card.trackPrices ? 'Watching' : 'Holding',
        date: card.createdAt || card.updatedAt || new Date().toISOString().slice(0, 10),
        imageUrl: card.imageUrl || makeAvatar(card.playerName || 'NBA Card'),
    };
}

function loadTabulator() {
    if (!document.getElementById(TABULATOR_CSS_ID)) {
        const link = document.createElement('link');
        link.id = TABULATOR_CSS_ID;
        link.rel = 'stylesheet';
        link.href = TABULATOR_CSS_URL;
        document.head.appendChild(link);
    }

    if (window.Tabulator) {
        return Promise.resolve(window.Tabulator);
    }

    if (window.__tabulatorLoader) {
        return window.__tabulatorLoader;
    }

    window.__tabulatorLoader = new Promise((resolve, reject) => {
        const existingScript = document.getElementById(TABULATOR_SCRIPT_ID);

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.Tabulator), { once: true });
            existingScript.addEventListener('error', reject, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = TABULATOR_SCRIPT_ID;
        script.src = TABULATOR_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve(window.Tabulator);
        script.onerror = reject;
        document.body.appendChild(script);
    });

    return window.__tabulatorLoader;
}

function CollectionPage() {
    const { cards } = useCards();
    const [searchTerm, setSearchTerm] = useState('');
    const [loadError, setLoadError] = useState('');
    const tableElementRef = useRef(null);
    const tableInstanceRef = useRef(null);

    const tableData = useMemo(() => {
        const source = cards.length ? cards.map(mapSavedCard) : mockCards;

        return source.map((card) => ({
            ...card,
            imageUrl: card.imageUrl || makeAvatar(card.playerName),
        }));
    }, [cards]);

    useEffect(() => {
        let cancelled = false;

        loadTabulator()
            .then((Tabulator) => {
                if (cancelled || !tableElementRef.current) {
                    return;
                }

                if (tableInstanceRef.current) {
                    tableInstanceRef.current.destroy();
                }

                tableInstanceRef.current = new Tabulator(tableElementRef.current, {
                    data: tableData,
                    layout: 'fitColumns',
                    height: '680px',
                    pagination: 'local',
                    paginationSize: 20,
                    paginationSizeSelector: [20, 40, true],
                    placeholder: 'No NBA cards found',
                    initialSort: [{ column: 'value', dir: 'desc' }],
                    columns: [
                        {
                            title: '',
                            field: 'imageUrl',
                            width: 74,
                            hozAlign: 'center',
                            headerSort: false,
                            formatter: (cell) => {
                                const { playerName } = cell.getRow().getData();
                                return `<img class="cards-avatar" src="${escapeHtml(cell.getValue())}" alt="${escapeHtml(playerName)} card avatar" />`;
                            },
                        },
                        {
                            title: 'Card',
                            field: 'title',
                            minWidth: 260,
                            formatter: (cell) => {
                                const row = cell.getRow().getData();
                                return `
                                    <div class="cards-title">${escapeHtml(row.title)}</div>
                                    <div class="cards-subtitle">${escapeHtml(row.playerName)} - ${escapeHtml(row.year || 'Modern')} ${escapeHtml(row.cardBrand)}</div>
                                `;
                            },
                        },
                        {
                            title: 'Player',
                            field: 'playerName',
                            minWidth: 160,
                            visible: false,
                        },
                        {
                            title: 'Grade',
                            field: 'gradeScore',
                            width: 132,
                            sorter: 'number',
                            formatter: (cell) => {
                                const { gradeLabel } = cell.getRow().getData();
                                const className = gradeLabel === 'Raw' ? 'grade-raw' : gradeLabel === 'PSA 10' ? 'grade-gem' : 'grade-graded';
                                return `<span class="grade-badge ${className}">${escapeHtml(gradeLabel)}</span>`;
                            },
                        },
                        {
                            title: 'Value',
                            field: 'value',
                            width: 140,
                            hozAlign: 'right',
                            sorter: 'number',
                            formatter: (cell) => `<span class="cards-value">${formatCurrency(cell.getValue())}</span>`,
                        },
                        {
                            title: 'Status',
                            field: 'status',
                            width: 140,
                            formatter: (cell) => {
                                const status = cell.getValue();
                                const safeStatus = String(status).toLowerCase().replace(/\s+/g, '-');
                                return `<span class="status-tag status-${escapeHtml(safeStatus)}">${escapeHtml(status)}</span>`;
                            },
                        },
                        {
                            title: 'Date',
                            field: 'date',
                            width: 132,
                            sorter: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
                            formatter: (cell) => new Date(cell.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        },
                    ],
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadError('The Tabulator CDN did not load. Please check your network and refresh this page.');
                }
            });

        return () => {
            cancelled = true;

            if (tableInstanceRef.current) {
                tableInstanceRef.current.destroy();
                tableInstanceRef.current = null;
            }
        };
    }, [tableData]);

    useEffect(() => {
        const table = tableInstanceRef.current;

        if (!table) {
            return;
        }

        if (!searchTerm.trim()) {
            table.clearFilter();
            return;
        }

        table.setFilter('playerName', 'like', searchTerm.trim());
    }, [searchTerm]);

    return (
        <div className="cards-dashboard -mt-7">
            <section className="dashboard-hero">
                <div>
                    <p className="dashboard-kicker">Pro Dashboard</p>
                    <h1>NBA Card Inventory</h1>
                    <p>
                        Track high-value cards with fast search, sortable market fields, and a collector-grade table experience.
                    </p>
                </div>

                <div className="dashboard-stats" aria-label="Collection summary">
                    <div>
                        <span>{tableData.length}</span>
                        <small>Cards</small>
                    </div>
                    <div>
                        <span>{formatCurrency(tableData.reduce((total, card) => total + Number(card.value || 0), 0))}</span>
                        <small>Portfolio Value</small>
                    </div>
                </div>
            </section>

            <section className="table-shell">
                <div className="table-toolbar">
                    <div>
                        <h2>Collection Table</h2>
                        <p>Sorting is enabled on value, grade, and date. Pagination is set to 20 rows.</p>
                    </div>

                    <label className="table-search">
                        <span>Search Player</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Jordan, Curry, Wembanyama..."
                        />
                    </label>
                </div>

                {loadError ? (
                    <div className="table-error">{loadError}</div>
                ) : (
                    <div ref={tableElementRef} className="cards-tabulator" />
                )}
            </section>
        </div>
    );
}

export default CollectionPage;
