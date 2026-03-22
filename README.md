# Unified Calendar Protocol (UCP) Core Engine

[![NPM Version](https://img.shields.io/npm/v/@unified-calendar/core.svg?style=flat-square)](https://www.npmjs.com/package/@unified-calendar/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Maintained by Yuanyu](https://img.shields.io/badge/Maintained%20by-Yuanyu%20(元宇)-emerald?style=flat-square)](https://www.yuanyucore.com)

> **One Timestamp. Seven Calendars.**
> The official open-source engine for synchronizing seven major world calendars through pure, geocentric astrophysics.

The **Unified Calendar Protocol (UCP)** is an open standard designed to solve "Intercalation Drift" and "Timezone Ghosts" in cultural timekeeping. It provides a single, machine-readable string that locks the following seven calendar systems to the same UTC moment:

1.  **Gregorian Calendar** (Standard Civil)
2.  **Xia (Hsia) Calendar** (Chinese Solar Term & Stem-Branch)
3.  **Chinese Traditional Calendar** (Lunisolar)
4.  **Hindu Lunisolar Calendar** (Vedic Tithi & Nakshatra)
5.  **Buddhist Era (BE) Calendar**
6.  **Saka Samvat Calendar** (National Calendar of India)
7.  **Hijri Calendar** (Islamic, Umm al-Qura)

This library is the core reference implementation, designed, built, and maintained by **[Yuanyu (元宇)](https://www.yuanyucore.com)**.

---

## 🚀 Installation

This package is a modern Node.js module.

```bash
# Using npm
npm install @unified-calendar/core

# Using yarn
yarn add @unified-calendar/core
```
*(Note: The core dependencies `astronomy-engine` and `lunar-javascript` will be installed automatically.)*

## 🛠️ Usage

The engine is designed to be simple and robust. The `decodeUCP` function is the primary entry point.

```javascript
const { decodeUCP } = require('@unified-calendar/core');

// 1. Decode a UTC timestamp to get all 7 calendar data points
const data = decodeUCP("2026-03-21T14:30:00Z");

// 2. Print the full decoded object
console.log(data);
/*
{
  ucpString: 'UE-12026 :: 03.21-04 :: 02.03.03 H10.02 (U) [Jia-Wu] T14:30:00Z',
  gregorian: 'Year 2026, Month 3, Day 21',
  xia: 'Year 丙午, Month 辛卯, Day Jia-Wu (Solar Term: 春分)',
  chinese: 'Year 4724, M: 2, D: 3',
  hindu: 'Amanta Month 1, Tithi 3, Nakshatra 3',
  buddhist: 'Year BE 2569, Lunar Month 2, Day 3',
  saka: 'Year Saka 1947, Month 12, Day 30',
  islamic: 'Year 1447 AH, Shawwal (M: 10), Day 2'
}
*/

// 3. Access a specific calendar
console.log(data.saka);
//> Year Saka 1947, Month 12, Day 30
```

## 🗓️ Almanac Generator

The library includes a powerful CLI tool to generate a full year's worth of synchronized data. This is perfect for testing, research, or generating almanacs.

```bash
# Generate the full almanac for 2026 and print to console
npm run almanac 2026

# Or, export the full almanac to a text file
node bin/almanac.js 2026 > 2026_almanac.txt
```

## 🔬 Scientific Foundation

UCP separates astronomical and civil calendars for maximum precision:
- **Geocentric Lock:** All calculations are performed in UTC.
- **Chinese Systems:**
    - **Xia Calendar (Solar):** Tracks the 24 Solar Terms (`Jieqi`) and the pure mathematical progression of the Sexagenary (Stem-Branch) cycle for year, month, and day.
    - **Traditional Calendar (Lunisolar):** Tracks the familiar lunar month and day used for festivals like the Spring Festival.
- **Indian Systems:**
    - **Hindu Lunisolar (Vedic):** Based on true astronomical positions of the Sun and Moon to calculate the `Tithi` (lunar day) and `Nakshatra` (lunar mansion) for religious observances. Uses **Lahiri Ayanamsa**.
    - **Saka Samvat (National):** The official civil calendar of India, a tropical solar calendar with a fixed start date (March 22, or 21 in a leap year).
- **Islamic:** Uses the **Umm al-Qura** algorithmic Hijri calendar, the official standard of Saudi Arabia.

---

## 🏛️ About Yuanyu (元宇) & Enterprise API (Coming Soon)

**Yuanyu (元宇)** is a technology lab focused on the core foundations of digital time and astronomical data. We believe that as humanity becomes more digitally unified, our timekeeping should respect both our shared astrophysics and our diverse cultural heritage.

While this core library is open-source and free forever under the MIT license, Yuanyu will also be offering a **commercial Cloud API** for enterprise applications.

### Yuanyu Calendar Cloud
The API is designed for businesses requiring:
- 🌍 **Global Holiday Data:** High-precision predictions for festivals across all 7 calendar systems (e.g., Lunar New Year, Eid, Diwali, Holi, Vesak).
- 📡 **Real-time Astronomical Events:** Notifications for Eclipses, Solstices, and New Moon sightings.
- 📈 **Guaranteed SLAs:** High-availability endpoints for international HR, payroll, and logistics platforms.

## 📄 License
MIT © [Yuanyu (元宇)](https://www.yuanyucore.com)