const processListings = require('./processListings');
const scrape130Point = require('./scrape130point.js'); 
const fs = require('fs');
const path = require('path');

const today = new Date();
const toDateStr = d => d.toISOString().split('T')[0];

// Helper to clone and subtract days
function daysAgo(n) {
    const d = new Date(today); // clone today to avoid mutating it
    d.setDate(d.getDate() - n);
    return d;
  }

// Mock test listings for each field 
const testTitleListings = [
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10', // this works
        price: 200.00,
        date: toDateStr(daysAgo(1))
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10',
        price: 210,
        date: toDateStr(daysAgo(1)) // Extreme Outlier
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10',
        price: 100,
        date: toDateStr(daysAgo(1)) // this works too just on the bottom threshold 
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10',
        price: 99,
        date: toDateStr(daysAgo(1)) // this should NOT work - just below the bottom threshold 
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10',
        price: 1000,
        date: toDateStr(daysAgo(1)) // Extreme Outlier
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 9', // this is only a PSA 9
        price: 150.00,
        date: toDateStr(daysAgo(1))
    },
    {
        title: '2020 Zion Williamson Silver Prizm PSA 10 Auto', // same query but with Auto should be omitted
        price: 150.00,
        date: toDateStr(daysAgo(1))
    },
    {
        title: '2019 Zion Williamson Silver Prizm PSA 10', // Different year
        price: 190.00,
        date: toDateStr(daysAgo(1))
    },
    {
        title: 'Random Card PSA 10', // Completely Different card
        price: 50.00,
        date: toDateStr(daysAgo(1))
    }
];

const testPriceListings = [
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 500, // valid price 
        date: toDateStr(daysAgo(1)),
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 0, // treated as invalid 
        date: toDateStr(daysAgo(1))
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: '120', // string instead of number 
        date: toDateStr(daysAgo(1))
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: NaN,
        date: toDateStr(daysAgo(1))
    }, 
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: null,
        date: toDateStr(daysAgo(1))
    }, 
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: undefined,
        date: toDateStr(daysAgo(1))
    }, 
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: -50, // negative number 
        date: toDateStr(daysAgo(1))
    }, 
  ];

const testDateListings = [
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 100,
        date: toDateStr(today), // today (NOT processed, will be processed in next Cron job)
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 400,
        date: toDateStr(daysAgo(1)), // yesterday - accepted
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 200,
        date: toDateStr(daysAgo(7)), // exactly 7 days ago - accepted 
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 120,
        date: toDateStr(daysAgo(8)), // 8 days ago (too old)
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 130,
        date: "invalid-date", // Case 4 invalid date 
    },
    {
        title: "2020 Zion Williamson Silver Prizm PSA 10",
        price: 140,
        date: null, // Case 5 Null date
    }
  ];

// Define query
//const query = "2023 Wembanyama Prizm Silver PSA 10 136";
const query = "2018 Luka Doncic Prizm Silver PSA 10 280";

// Run function
// (async () => {
//     const titleResult = await processListings(testTitleListings, query);
//     const priceResult = await processListings(testPriceListings, query);
//     const dateResult = await processListings(testDateListings, query);

//     console.log('[Title Result]', titleResult);
//     console.log('[Price Result]', priceResult);
//     console.log('[Date Result]', dateResult);
// })();

/// Scrape 130point
(async () => {
    console.log('Scraping listings...');
    const sampleListings = await scrape130Point(query);

    fs.writeFileSync(path.join('test_files', 'scrapedListings.json'), JSON.stringify(sampleListings, null, 2));
    console.log('[✅ sampleListings written to test_files/scrapedListings.json]');

    console.log('Processing listings for accuracy...');
    const processListingsResult = await processListings(sampleListings, query);
    fs.writeFileSync(path.join('test_files', 'processedResult.json'), JSON.stringify(processListingsResult, null, 2));
    console.log('[✅ Processed results written to test_files/processedResult.json]');
})();

// BUGS FOUND

// Exact same query but with additional words like "Auto"
// Solution: filter out based on average prices, for example: remove outliers

// Implement both isLikelyVariant and removeOutliers functions check ChatGPT