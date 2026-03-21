// math-eastern.js
const { Solar } = require('lunar-javascript');
const Astronomy = require('astronomy-engine');

// --- CONSTANTS ---
// We need both an Array (for our custom math) and a Map (for the library's character output).
const STEMS_ARRAY = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const BRANCHES_ARRAY = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
const BRANCHES_MAP_FROM_CHAR = { "子":"Zi", "丑":"Chou", "寅":"Yin", "卯":"Mao", "辰":"Chen", "巳":"Si", "午":"Wu", "未":"Wei", "申":"Shen", "酉":"You", "戌":"Xu", "亥":"Hai" };

const JIEQI = ["立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至","小寒","大寒"];

/**
 * Calculates the Sexagenary (Stem-Branch) day cycle using pure, timezone-agnostic math.
 * This function bypasses the buggy part of the lunar-javascript library and uses a verified astronomical anchor.
 * @param {Date} date - The input UTC date.
 * @returns {string} The correct Stem-Branch string (e.g., "Geng-Shen").
 */
function calculateStemBranch(date) {
    // ASTRONOMICAL ANCHOR POINT: The Unix Epoch (1970-01-01 00:00:00 UTC).
    // After rigorous testing and verification, the correct mathematical anchor to align the cycle is Xin-Si.
    const ANCHOR_DATE = new Date('1970-01-01T00:00:00Z');
    const ANCHOR_STEM_INDEX = 7;  // Xin is the 8th stem (index 7)
    const ANCHOR_BRANCH_INDEX = 5;  // Si is the 6th branch (index 5)

    // Calculate the number of full days that have passed since the anchor.
    const daysSinceAnchor = Math.floor((date.getTime() - ANCHOR_DATE.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate the current stem and branch using modulo arithmetic.
    const currentStemIndex = (ANCHOR_STEM_INDEX + daysSinceAnchor) % 10;
    const currentBranchIndex = (ANCHOR_BRANCH_INDEX + daysSinceAnchor) % 12;

    const stem = STEMS_ARRAY[ (currentStemIndex + 10) % 10 ];
    const branch = BRANCHES_ARRAY[ (currentBranchIndex + 12) % 12 ];

    return `${stem}-${branch}`;
}


function getEasternData(date) {
    // --- PART 1: CHINESE CALENDAR DATA ---
    // Use Solar.fromDate for the parts we trust (Months, Solar Terms).
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    
    let rawMonth = lunar.getMonth();
    let isLeap = rawMonth < 0;
    let lunarMonth = Math.abs(rawMonth);
    let lunarDay = lunar.getDay();

    let prevJieQi = lunar.getPrevJieQi(true);
    let jieqiName = prevJieQi.getName();
    let solarTermIndex = JIEQI.indexOf(jieqiName) + 1;
    if (solarTermIndex === 0) solarTermIndex = 1;

    // Use our OWN robust function for the Day Pillar to defeat the timezone bug.
    const stemBranch = calculateStemBranch(date);
    const timeBranch = BRANCHES_MAP_FROM_CHAR[lunar.getTimeZhi()];


    // --- PART 2: INDIAN & BUDDHIST CALENDAR DATA (This part remains correct) ---
    const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, date, true);
    const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, date, true);
    
    const sunLon = Astronomy.Ecliptic(sunVec).elon;
    const moonLon = Astronomy.Ecliptic(moonVec).elon;

    let angle = (moonLon - sunLon + 360) % 360;
    let tithi = Math.ceil(angle / 12);
    if (tithi === 0) tithi = 30;

    let nakshatra = Math.ceil(moonLon / (360 / 27));
    if (nakshatra === 0) nakshatra = 27;

    const isUposatha = [8, 14, 15, 23, 29, 30].includes(tithi);

    // --- PART 3: ISLAMIC (HIJRI) CALENDAR DATA ---
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric'
    });
    
    const parts = hijriFormatter.formatToParts(date);
    let hDay, hMonth, hYear;
    for (let p of parts) {
        if (p.type === 'day') hDay = parseInt(p.value, 10);
        if (p.type === 'month') hMonth = parseInt(p.value, 10);
        if (p.type === 'year') hYear = parseInt(p.value.split(' ')[0], 10);
    }

    return {
        lunarMonth: lunarMonth,
        lunarDay: lunarDay,
        isLeapMonth: isLeap,
        solarTerm: solarTermIndex,
        stemBranch: stemBranch,
        timeBranch: timeBranch,
        tithi: tithi,
        nakshatra: nakshatra,
        isUposatha: isUposatha,
        hijriMonth: hMonth,
        hijriDay: hDay,
        hijriYear: hYear
    };
}

module.exports = { getEasternData };