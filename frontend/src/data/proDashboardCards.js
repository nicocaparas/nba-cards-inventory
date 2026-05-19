const palette = [
    ['#f5a623', '#0d1b3e'],
    ['#16a34a', '#06151f'],
    ['#38bdf8', '#071828'],
    ['#f97316', '#17130a'],
    ['#a3e635', '#111a07'],
];

function initialsFor(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

export function avatarDataUri(name, index = 0) {
    const [accent, base] = palette[index % palette.length];
    const initials = initialsFor(name);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
            <rect width="96" height="96" rx="48" fill="${base}"/>
            <circle cx="48" cy="48" r="42" fill="none" stroke="${accent}" stroke-width="5"/>
            <text x="48" y="57" text-anchor="middle" font-size="28" font-family="Inter, Arial, sans-serif" font-weight="800" fill="${accent}">${initials}</text>
        </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function card(id, playerName, year, brand, gradeLabel, value, status, dateAdded, index) {
    const lastName = playerName.split(' ').slice(-1)[0];
    const rawGrade = gradeLabel === 'Raw' ? 0 : Number(gradeLabel.replace(/[^0-9.]/g, ''));

    return {
        id,
        playerName,
        avatar: avatarDataUri(playerName, index),
        cardTitle: `${year} ${brand} ${lastName}`,
        gradeLabel,
        gradeSort: rawGrade,
        value,
        status,
        dateAdded,
    };
}

const proDashboardCards = [
    card(1, 'Michael Jordan', 1986, 'Fleer', 'PSA 10', 238000, 'Vaulted', '2026-05-10', 0),
    card(2, 'LeBron James', 2003, 'Topps Chrome', 'PSA 10', 42500, 'For Sale', '2026-05-06', 1),
    card(3, 'Kobe Bryant', 1996, 'Topps Chrome', 'PSA 9', 18500, 'Vaulted', '2026-04-27', 2),
    card(4, 'Stephen Curry', 2009, 'Topps Chrome', 'PSA 10', 30200, 'Watch', '2026-04-22', 3),
    card(5, 'Victor Wembanyama', 2023, 'Prizm Silver', 'PSA 10', 6200, 'Incoming', '2026-04-19', 4),
    card(6, 'Luka Doncic', 2018, 'Prizm Silver', 'PSA 10', 9400, 'For Sale', '2026-04-15', 5),
    card(7, 'Giannis Antetokounmpo', 2013, 'Prizm', 'PSA 9', 7600, 'Vaulted', '2026-04-09', 6),
    card(8, 'Kevin Durant', 2007, 'Topps Chrome', 'PSA 9', 5600, 'Watch', '2026-04-02', 7),
    card(9, 'Shaquille ONeal', 1992, 'Stadium Club Beam Team', 'PSA 8', 2100, 'Vaulted', '2026-03-27', 8),
    card(10, 'Allen Iverson', 1996, 'Topps Chrome', 'PSA 9', 3900, 'For Sale', '2026-03-21', 9),
    card(11, 'Tim Duncan', 1997, 'Topps Chrome', 'PSA 9', 2850, 'Vaulted', '2026-03-17', 10),
    card(12, 'Dirk Nowitzki', 1998, 'Topps Chrome', 'PSA 9', 3100, 'Watch', '2026-03-10', 11),
    card(13, 'Nikola Jokic', 2015, 'Prizm Silver', 'PSA 10', 4800, 'For Sale', '2026-03-04', 12),
    card(14, 'Jayson Tatum', 2017, 'Prizm Silver', 'PSA 10', 3350, 'Vaulted', '2026-02-28', 13),
    card(15, 'Anthony Edwards', 2020, 'Prizm Silver', 'PSA 10', 4100, 'Incoming', '2026-02-22', 14),
    card(16, 'Ja Morant', 2019, 'Prizm Silver', 'PSA 9', 1150, 'Watch', '2026-02-16', 15),
    card(17, 'Shai Gilgeous-Alexander', 2018, 'Prizm Silver', 'PSA 10', 2700, 'Vaulted', '2026-02-10', 16),
    card(18, 'Carmelo Anthony', 2003, 'Topps Chrome Refractor', 'PSA 9', 1550, 'For Sale', '2026-02-04', 17),
    card(19, 'Dwyane Wade', 2003, 'Topps Chrome', 'PSA 9', 1900, 'Vaulted', '2026-01-29', 18),
    card(20, 'Chris Paul', 2005, 'Topps Chrome', 'PSA 9', 820, 'Watch', '2026-01-22', 19),
    card(21, 'Tracy McGrady', 1997, 'Topps Chrome', 'PSA 8', 650, 'For Sale', '2026-01-18', 20),
    card(22, 'Yao Ming', 2002, 'Topps Chrome', 'PSA 9', 1220, 'Vaulted', '2026-01-12', 21),
    card(23, 'Zion Williamson', 2019, 'Prizm Silver', 'Raw', 480, 'Raw Review', '2026-01-07', 22),
    card(24, 'Paolo Banchero', 2022, 'Prizm Silver', 'PSA 10', 740, 'Incoming', '2025-12-29', 23),
    card(25, 'Chet Holmgren', 2022, 'Prizm Silver', 'PSA 10', 690, 'For Sale', '2025-12-21', 24),
    card(26, 'Scoot Henderson', 2023, 'Prizm Silver', 'Raw', 210, 'Raw Review', '2025-12-12', 25),
];

export default proDashboardCards;
