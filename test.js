// test.js
const { decodeUCP } = require('./index.js');

// 定义你要测试的日期列表
const testDates = [
    "2026-03-21T14:30:00Z", // 你刚才提供的测试日期（Saka历的年末）
    "2026-03-22T14:30:00Z", // Saka历的新年第一天
    "2024-05-23T14:30:45Z"  // 卫塞节测试
];

console.log("=======================================================");
console.log("          UCP 7-CALENDAR ENGINE TEST SUITE             ");
console.log("=======================================================\n");

testDates.forEach(dateStr => {
    console.log(`\n▶ Testing UTC Date: ${dateStr}`);
    console.log("-------------------------------------------------------");
    
    const data = decodeUCP(dateStr);
    
    if (data) {
        console.log(`[UCP String] : ${data.ucpString}`);
        console.log(`[Gregorian]  : ${data.gregorian}`);
        console.log(`[Xia (Hsia)] : ${data.xia}`);
        console.log(`[Chinese]    : ${data.chinese}`);
        console.log(`[Hindu]      : ${data.hindu}`);
        console.log(`[Buddhist]   : ${data.buddhist}`);
        console.log(`[Saka]       : ${data.saka}`);
        console.log(`[Islamic]    : ${data.islamic}`);
    } else {
        console.log("Error: Failed to decode date.");
    }
});
console.log("\n=======================================================");