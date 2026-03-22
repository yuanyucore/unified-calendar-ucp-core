// index.js
process.env.TZ = 'UTC'; 

const { generateUCP } = require('./src/engine-core');
const { getEasternData } = require('./src/math-eastern');
const { getWesternData } = require('./src/math-western');
const Astronomy = require('astronomy-engine');
const { Solar } = require('lunar-javascript');

// --- CONSTANTS ---
const HIJRI_MONTHS = [
    "", "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", 
    "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"
];

const JIEQI_MAP = {
  "立春": { pinyin: "Lichun", english: "Start of Spring" }, "雨水": { pinyin: "Yushui", english: "Rain Water" },
  "惊蛰": { pinyin: "Jingzhe", english: "Awakening of Insects" }, "春分": { pinyin: "Chunfen", english: "Spring Equinox" },
  "清明": { pinyin: "Qingming", english: "Clear and Bright" }, "谷雨": { pinyin: "Guyu", english: "Grain Rain" },
  "立夏": { pinyin: "Lixia", english: "Start of Summer" }, "小满": { pinyin: "Xiaoman", english: "Lesser Fullness" },
  "芒种": { pinyin: "Mangzhong", english: "Grain in Ear" }, "夏至": { pinyin: "Xiazhi", english: "Summer Solstice" },
  "小暑": { pinyin: "Xiaoshu", english: "Lesser Heat" }, "大暑": { pinyin: "Dashu", english: "Great Heat" },
  "立秋": { pinyin: "Liqiu", english: "Start of Autumn" }, "处暑": { pinyin: "Chushu", english: "End of Heat" },
  "白露": { pinyin: "Bailu", english: "White Dew" }, "秋分": { pinyin: "Qiufen", english: "Autumn Equinox" },
  "寒露": { pinyin: "Hanlu", english: "Cold Dew" }, "霜降": { pinyin: "Shuangjiang", english: "Frost's Descent" },
  "立冬": { pinyin: "Lidong", english: "Start of Winter" }, "小雪": { pinyin: "Xiaoxue", english: "Lesser Snow" },
  "大雪": { pinyin: "Daxue", english: "Great Snow" }, "冬至": { pinyin: "Dongzhi", english: "Winter Solstice" },
  "小寒": { pinyin: "Xiaohan", english: "Lesser Cold" }, "大寒": { pinyin: "Dahan", english: "Great Cold" }
};

// --- THE MASTER DECODE FUNCTION ---
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

    // --- 1. Xia (Hsia) Calendar - With English Translations ---
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    
    // Get Pinyin from library
    const yearPinyin = `${lunar.getYearGan()}-${lunar.getYearZhi()}`;
    const monthPinyin = `${lunar.getMonthGan()}-${lunar.getMonthZhi()}`;
    // Get Chinese characters from library
    const yearChar = lunar.getYearInGanZhi();
    const monthChar = lunar.getMonthInGanZhi();
    const dayChar = lunar.getDayInGanZhi();

    // Get Solar Term and its English translation from our map
    const jieqiName = lunar.getPrevJieQi(true).getName();
    const solarTermInfo = JIEQI_MAP[jieqiName] || { english: 'Unknown' };

    const xiaString = `Year ${yearPinyin} (${yearChar}), Month ${monthPinyin} (${monthChar}), Day ${e.stemBranch} (${dayChar}) (Term: ${jieqiName} / ${solarTermInfo.english})`;

    // --- 2. Buddhist Calendar ---
    const buddhistBE = yearCE + 543;
    const buddhistMonth = e.lunarMonth;
    const buddhistDay = e.lunarDay;

    // --- 3. Saka Samvat National Calendar ---
    const isLeapYear = (yearCE % 4 === 0 && yearCE % 100 !== 0) || (yearCE % 400 === 0);
    let indianSaka = yearCE - 78;
    const sakaYearStartDate = new Date(Date.UTC(yearCE, 2, isLeapYear ? 21 : 22));
    
    let yearToUseForCalc = yearCE;
    if (date < sakaYearStartDate) {
        indianSaka -= 1;
        yearToUseForCalc -= 1;
    }

    const isSakaLeap = (yearToUseForCalc % 4 === 0 && yearToUseForCalc % 100 !== 0) || (yearToUseForCalc % 400 === 0);
    const startOfThisSakaYear = new Date(Date.UTC(yearToUseForCalc, 2, isSakaLeap ? 21 : 22));
    const dayOfYear = Math.floor((date - startOfThisSakaYear) / 86400000) + 1;

    const m1 = isSakaLeap ? 31 : 30;
    let indianMonth, indianDay;
    
    if (dayOfYear <= m1) { indianMonth = 1; indianDay = dayOfYear; }
    else if (dayOfYear <= m1 + 31) { indianMonth = 2; indianDay = dayOfYear - m1; }
    else if (dayOfYear <= m1 + 62) { indianMonth = 3; indianDay = dayOfYear - (m1 + 31); }
    else if (dayOfYear <= m1 + 93) { indianMonth = 4; indianDay = dayOfYear - (m1 + 62); }
    else if (dayOfYear <= m1 + 124) { indianMonth = 5; indianDay = dayOfYear - (m1 + 93); }
    else if (dayOfYear <= m1 + 155) { indianMonth = 6; indianDay = dayOfYear - (m1 + 124); }
    else if (dayOfYear <= m1 + 185) { indianMonth = 7; indianDay = dayOfYear - (m1 + 155); }
    else if (dayOfYear <= m1 + 215) { indianMonth = 8; indianDay = dayOfYear - (m1 + 185); }
    else if (dayOfYear <= m1 + 245) { indianMonth = 9; indianDay = dayOfYear - (m1 + 215); }
    else if (dayOfYear <= m1 + 275) { indianMonth = 10; indianDay = dayOfYear - (m1 + 245); }
    else if (dayOfYear <= m1 + 305) { indianMonth = 11; indianDay = dayOfYear - (m1 + 275); }
    else { indianMonth = 12; indianDay = dayOfYear - (m1 + 305); }

    // --- 4. Hindu Lunisolar Calendar ---
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
        xia: xiaString,
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