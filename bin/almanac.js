// generate-year.js
process.env.TZ = 'UTC'; // Force UTC-Locked Environment

const { generateUCP } = require('../src/engine-core');
const { getEasternData } = require('../src/math-eastern');
const { Solar } = require('lunar-javascript');
const Astronomy = require('astronomy-engine');

// Helper to pad numbers (e.g., 5 -> "05")
function pad(n) { return n.toString().padStart(2, '0'); }

// Traditional Islamic Month Names
const HIJRI_MONTHS = [
    "", "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", 
    "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"
];

// The core decoding function (adapted to return a clean object instead of printing to the console)
function getUCPDataForDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const ucpString = generateUCP(dateString);
    const e = getEasternData(date);
    const lunarObj = Solar.fromDate(date).getLunar();

    const yearCE = date.getUTCFullYear();
    const chineseHE = lunarObj.getYear() + 2698;
    const yearPillar = lunarObj.getYearInGanZhi(); 

    const buddhistBE = yearCE + 543;
    let buddhistMonth = (e.lunarMonth + 2) % 12; 
    if (buddhistMonth === 0) buddhistMonth = 12;

    let indianSaka = yearCE - 78;
    const isLeapYear = (yearCE % 4 === 0 && yearCE % 100 !== 0) || (yearCE % 400 === 0);
    const sakaStartDay = isLeapYear ? 21 : 22;
    if (date.getUTCMonth() < 2 || (date.getUTCMonth() === 2 && date.getUTCDate() < sakaStartDay)) {
        indianSaka -= 1;
    }

    const prevNewMoon = Astronomy.SearchMoonPhase(0, date, -30).date;
    const sunVecNM = Astronomy.GeoVector(Astronomy.Body.Sun, prevNewMoon, true);
    const sunLonNM = Astronomy.Ecliptic(sunVecNM).elon;
    const nmYear = prevNewMoon.getUTCFullYear();
    const ayanamsa = 23.85 + ((nmYear - 2000) * 0.0139);
    const siderealSun = (sunLonNM - ayanamsa + 360) % 360;
    const rasi = Math.floor(siderealSun / 30);
    let indianMonth = (rasi + 2) % 12;
    if (indianMonth === 0) indianMonth = 12;

    return {
        gregorian: `${yearCE}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
        ucp: ucpString,
        chinese: `Yr ${chineseHE} [${yearPillar}], M ${e.isLeapMonth ? 'L' : ''}${e.lunarMonth}, D ${e.lunarDay} [${e.stemBranch}]`,
        buddhist: `BE ${buddhistBE}, M ${buddhistMonth}, D ${e.lunarDay} ${e.isUposatha ? '(Holy Day)' : ''}`,
        indian: `Saka ${indianSaka}, M ${indianMonth}, Tithi ${e.tithi}`,
        islamic: `${e.hijriYear} AH, ${HIJRI_MONTHS[e.hijriMonth]} ${e.hijriDay}`
    };
}

// --- THE YEAR GENERATOR LOOP ---
function generateFullYear(targetYear) {
    console.log(`=======================================================`);
    console.log(`  GENERATING UNIFIED CALENDAR ALMANAC FOR YEAR: ${targetYear}  `);
    console.log(`=======================================================\n`);

    // Start on January 1st of the target year at 00:00:00 UTC
    let currentDate = new Date(Date.UTC(targetYear, 0, 1));

    // Loop until the year changes
    while (currentDate.getUTCFullYear() === targetYear) {
        // Convert the Date object to an ISO string
        const dateString = currentDate.toISOString();
        
        // Get the UCP data for this specific day
        const data = getUCPDataForDate(dateString);

        if (data) {
            console.log(`[${data.gregorian}] ${data.ucp}`);
            console.log(`  CN: ${data.chinese} | IN: ${data.indian}`);
            console.log(`  BD: ${data.buddhist} | IS: ${data.islamic}`);
            console.log(`-------------------------------------------------------`);
        }

        // Advance the date by exactly 1 day (24 hours)
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    console.log(`\n✅ Almanac Generation Complete for ${targetYear}`);
}

// --- EXECUTION ---
// Check if a year was passed as a command-line argument (e.g., `node generate-year.js 2006`)
const inputYear = parseInt(process.argv[2], 10);

if (!isNaN(inputYear)) {
    generateFullYear(inputYear);
} else {
    console.log("Error: Please provide a valid Gregorian year.");
    console.log("Usage: node generate-year.js 2006");
}