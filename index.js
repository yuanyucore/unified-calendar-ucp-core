// index.js
process.env.TZ = 'UTC'; 

const { generateUCP } = require('./src/engine-core');
const { getEasternData } = require('./src/math-eastern');
const { getWesternData } = require('./src/math-western');
const Astronomy = require('astronomy-engine');
const { Solar } = require('lunar-javascript'); // 引入 Lunar 库获取夏历数据

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

    // --- 1. Xia (Hsia) Calendar Math (夏历：干支与节气) ---
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const yearPillar = lunar.getYearInGanZhiExact();
    const monthPillar = lunar.getMonthInGanZhiExact();
    const jieqiName = lunar.getPrevJieQi(true).getName();

    // --- 2. Buddhist Calendar Math (佛历) ---
    const buddhistBE = yearCE + 543;
    const buddhistMonth = e.lunarMonth;
    const buddhistDay = e.lunarDay;

    // --- 3. Saka Samvat National Calendar (印度国定历 - 纯太阳历) ---
    const isLeapYear = (yearCE % 4 === 0 && yearCE % 100 !== 0) || (yearCE % 400 === 0);
    let indianSaka = yearCE - 78;
    const sakaYearStartDate = new Date(Date.UTC(yearCE, 2, isLeapYear ? 21 : 22));
    
    let yearToUseForCalc = yearCE;
    if (date < sakaYearStartDate) {
        indianSaka -= 1;
        yearToUseForCalc -= 1;
    }

    // 判断当前所在的 Saka 年，其对应的格里高利年是否是闰年
    const isSakaLeap = (yearToUseForCalc % 4 === 0 && yearToUseForCalc % 100 !== 0) || (yearToUseForCalc % 400 === 0);
    const startOfThisSakaYear = new Date(Date.UTC(yearToUseForCalc, 2, isSakaLeap ? 21 : 22));
    const dayOfYear = Math.floor((date - startOfThisSakaYear) / 86400000) + 1;

    // 修复：Saka 历的第一月在平年是 30 天，闰年是 31 天
    const m1 = isSakaLeap ? 31 : 30; 
    let indianMonth, indianDay;
    
    if (dayOfYear <= m1) { indianMonth = 1; indianDay = dayOfYear; }
    else if (dayOfYear <= m1 + 31) { indianMonth = 2; indianDay = dayOfYear - m1; }
    else if (dayOfYear <= m1 + 62) { indianMonth = 3; indianDay = dayOfYear - (m1 + 31); }
    else if (dayOfYear <= m1 + 93) { indianMonth = 4; indianDay = dayOfYear - (m1 + 62); }
    else if (dayOfYear <= m1 + 124) { indianMonth = 5; indianDay = dayOfYear - (m1 + 93); }
    else if (dayOfYear <= m1 + 155) { indianMonth = 6; indianDay = dayOfYear - (m1 + 124); }
    // 下半年的月份（7-12月）都是 30 天
    else if (dayOfYear <= m1 + 185) { indianMonth = 7; indianDay = dayOfYear - (m1 + 155); }
    else if (dayOfYear <= m1 + 215) { indianMonth = 8; indianDay = dayOfYear - (m1 + 185); }
    else if (dayOfYear <= m1 + 245) { indianMonth = 9; indianDay = dayOfYear - (m1 + 215); }
    else if (dayOfYear <= m1 + 275) { indianMonth = 10; indianDay = dayOfYear - (m1 + 245); }
    else if (dayOfYear <= m1 + 305) { indianMonth = 11; indianDay = dayOfYear - (m1 + 275); }
    else { indianMonth = 12; indianDay = dayOfYear - (m1 + 305); }

    // --- 4. Hindu Lunisolar Calendar (印度教阴阳历 - Tithi/Nakshatra) ---
    const prevNewMoon = Astronomy.SearchMoonPhase(0, date, -30).date;
    const sunVecNM = Astronomy.GeoVector(Astronomy.Body.Sun, prevNewMoon, true);
    const sunLonNM = Astronomy.Ecliptic(sunVecNM).elon;
    const nmYear = prevNewMoon.getUTCFullYear();
    const ayanamsa = 23.85 + ((nmYear - 2000) * 0.0139);
    const siderealSun = (sunLonNM - ayanamsa + 360) % 360;
    const rasi = Math.floor(siderealSun / 30);
    let amantaMonth = (rasi + 2) % 12 || 12;

    // --- Assemble Final 7 Calendars Object ---
    return {
        ucpString,
        gregorian: `Year ${yearCE}, Month ${w.month}, Day ${w.day}`,
        xia: `Year ${yearPillar}, Month ${monthPillar}, Day ${e.stemBranch} (Solar Term: ${jieqiName})`,
        chinese: `Year ${yearCE + 2698}, M: ${e.isLeapMonth ? 'Leap ' : ''}${e.lunarMonth}, D: ${e.lunarDay}`,
        hindu: `Amanta Month ${amantaMonth}, Tithi ${e.tithi}, Nakshatra ${e.nakshatra}`,
        buddhist: `Year BE ${buddhistBE}, Lunar Month ${buddhistMonth}, Day ${buddhistDay} ${e.isUposatha ? '(Holy Day)' : ''}`,
        saka: `Year Saka ${indianSaka}, Month ${indianMonth}, Day ${indianDay}`,
        islamic: `Year ${e.hijriYear} AH, ${HIJRI_MONTHS[e.hijriMonth]} (M: ${e.hijriMonth}), Day ${e.hijriDay}`
    };
}

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