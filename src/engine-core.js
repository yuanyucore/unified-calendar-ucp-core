// ucp-core.js
const { getWesternData } = require('./math-western');
const { getEasternData } = require('./math-eastern');

function generateUCP(dateString) {
    const date = new Date(dateString);

    const w = getWesternData(date);
    const e = getEasternData(date);

    const pad = (num) => num.toString().padStart(2, '0');

    const lmString = e.isLeapMonth ? `L${pad(e.lunarMonth)}` : pad(e.lunarMonth);
    const uposathaFlag = e.isUposatha ? " (U)" : "";

    const block1 = `UE-${w.epoch}`;
    const block2 = `${pad(w.month)}.${pad(w.day)}-${pad(e.solarTerm)}`;
    
    // ADDED HIJRI TRACK: H11.15
    const hijriString = `H${pad(e.hijriMonth)}.${pad(e.hijriDay)}`;
    
    // Assembled Lunar block now includes the Hijri data securely
    const block3 = `${lmString}.${pad(e.tithi)}.${pad(e.nakshatra)} ${hijriString}${uposathaFlag} [${e.stemBranch}]`;
    
    const timeStr = `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}Z`;

    return `${block1} :: ${block2} :: ${block3} ${timeStr}`;
}

module.exports = { generateUCP };