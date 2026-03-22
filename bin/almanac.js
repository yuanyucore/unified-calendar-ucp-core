// bin/almanac.js
process.env.TZ = 'UTC'; // Force UTC-Locked Environment

// IMPORT THE PERFECTED MASTER FUNCTION
const { decodeUCP } = require('../index.js'); 

// --- THE YEAR GENERATOR LOOP ---
function generateFullYear(targetYear) {
    console.log(`=======================================================`);
    console.log(`  GENERATING UCP 7-CALENDAR ALMANAC FOR YEAR: ${targetYear}  `);
    console.log(`=======================================================\n`);

    // Start on January 1st of the target year at 00:00:00 UTC
    let currentDate = new Date(Date.UTC(targetYear, 0, 1));

    // Loop until the year changes (Handles leap years automatically!)
    while (currentDate.getUTCFullYear() === targetYear) {
        
        const dateString = currentDate.toISOString();
        
        // 1. Let the core engine do all the heavy lifting
        const data = decodeUCP(dateString);

        // 2. Print the 7 Calendars neatly
        if (data) {
            console.log(`[${data.gregorian}] ${data.ucpString}`);
            console.log(`  [XA] Xia     : ${data.xia}`);
            console.log(`  [CN] Chinese : ${data.chinese}`);
            console.log(`  [HD] Hindu   : ${data.hindu}`);
            console.log(`  [BD] Buddhist: ${data.buddhist}`);
            console.log(`  [SK] Saka    : ${data.saka}`);
            console.log(`  [IS] Hijri   : ${data.islamic}`);
            console.log(`-------------------------------------------------------`);
        }

        // Advance the date by exactly 1 day (24 hours)
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    console.log(`\n✅ Almanac Generation Complete for ${targetYear}`);
}

// --- EXECUTION ---
// Check if a year was passed as a command-line argument
const inputYear = parseInt(process.argv[2], 10);

if (!isNaN(inputYear)) {
    generateFullYear(inputYear);
} else {
    console.log("Error: Please provide a valid Gregorian year.");
    console.log("Usage: npm run almanac 2006   OR   node bin/almanac.js 2006");
}