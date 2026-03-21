// index.js
process.env.TZ = 'UTC'; 

const { generateUCP } = require('./src/engine-core');
const { getEasternData } = require('./src/math-eastern');
const { Solar } = require('lunar-javascript');
const Astronomy = require('astronomy-engine');

function pad(n) { return n.toString().padStart(2, '0'); }

// Traditional Islamic Month Names
const HIJRI_MONTHS = [
    "", "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", 
    "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"
];

function decodeUCP(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error("Error: Invalid date provided.");
        return;
    }

    const ucpString = generateUCP(dateString);
    const e = getEasternData(date);
    const lunarObj = Solar.fromDate(date).getLunar();

    const hr = pad(date.getUTCHours());
    const min = pad(date.getUTCMinutes());
    const sec = pad(date.getUTCSeconds());
    const timeFull = `${hr}:${min}:${sec} UTC`;
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

    // Output formatting
    console.log(`Input (UTC) : ${date.toUTCString()}`);
    console.log(`UCP String  : ${ucpString}`);
    console.log(`\n--- SYNCHRONIZED CALENDAR DATA (All Timezone: UTC) ---`);
    console.log(`[Western]  : Year ${yearCE}, Month ${date.getUTCMonth()+1}, Day ${date.getUTCDate()} | Time: ${timeFull}`);
    console.log(`[Chinese]  : Year ${chineseHE} [${yearPillar}], Month ${e.isLeapMonth ? 'Leap ' : ''}${e.lunarMonth}, Day ${e.lunarDay} [${e.stemBranch}] | Time: ${timeFull} (Hour of the ${e.timeBranch})`);
    console.log(`[Buddhist] : Year BE ${buddhistBE}, Lunar Month ${buddhistMonth}, Day ${e.lunarDay} ${e.isUposatha ? '(Holy Day)' : ''} | Time: ${timeFull}`);
    console.log(`[Indian]   : Year Saka ${indianSaka}, Amanta Month ${indianMonth}, Tithi ${e.tithi}, Nakshatra ${e.nakshatra} | Time: ${timeFull}`);
    console.log(`[Islamic]  : Year ${e.hijriYear} AH, ${HIJRI_MONTHS[e.hijriMonth]} (M: ${e.hijriMonth}), Day ${e.hijriDay} | Time: ${timeFull}`);
    console.log("=======================================================\n");
}

console.log("=======================================================");
console.log("        UNIFIED CALENDAR PROTOCOL (UCP) v1.7           ");
console.log("=======================================================\n");

const customDate = process.argv[2];

if (customDate) {
    console.log(`TEST EVENT: Custom Date from Command Line`);
    const dateToTest = customDate.includes('T') ? customDate : `${customDate}T00:00:00Z`;
    decodeUCP(dateToTest);
} else {
    const tests = [
        { name: "Unix Epoch (Astronomical Sync)", date: "1970-01-01T00:00:00Z" },
        { name: "Vesak Purnima (Five Civilizations Test)", date: "2024-05-23T14:30:45Z" },
    ];
    tests.forEach(test => {
        console.log(`TEST EVENT: ${test.name}`);
        decodeUCP(test.date);
    });
}