// index.js
process.env.TZ = 'UTC'; 

const { generateUCP } = require('./src/engine-core');
const { getEasternData } = require('./src/math-eastern');
const { getWesternData } = require('./src/math-western');
const Astronomy = require('astronomy-engine');

const HIJRI_MONTHS = [
    "", "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", 
    "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"
];

function decodeUCP(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error("Error: Invalid date provided to decodeUCP.");
        return null;
    }

    const ucpString = generateUCP(dateString);
    const e = getEasternData(date);
    const w = getWesternData(date);
    const yearCE = w.epoch - 10000;

    const buddhistBE = yearCE + 543;
    let buddhistMonth = (e.lunarMonth + 2) % 12 || 12;

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
    let amantaMonth = (rasi + 2) % 12 || 12;

    return {
        ucpString,
        western: `Year ${yearCE}, Month ${w.month}, Day ${w.day}`,
        chinese: `Year ${yearCE + 2698}, M: ${e.isLeapMonth ? 'Leap ' : ''}${e.lunarMonth}, D: ${e.lunarDay} [${e.stemBranch}]`,
        buddhist: `Year BE ${buddhistBE}, Lunar Month ${buddhistMonth}, Day ${e.lunarDay} ${e.isUposatha ? '(Holy Day)' : ''}`,
        indian: `Year Saka ${indianSaka}, Amanta Month ${amantaMonth}, Tithi ${e.tithi}, Nakshatra ${e.nakshatra}`,
        islamic: `Year ${e.hijriYear} AH, ${HIJRI_MONTHS[e.hijriMonth]} (M: ${e.hijriMonth}), Day ${e.hijriDay}`
    };
}

// This block lets the file work as a library OR a CLI
if (require.main === module) {
    const customDate = process.argv[2];
    if (customDate) {
        const dateToTest = customDate.includes('T') ? customDate : `${customDate}T00:00:00Z`;
        const data = decodeUCP(dateToTest);
        console.log(data);
    }
} else {
    module.exports = { generateUCP, decodeUCP };
}