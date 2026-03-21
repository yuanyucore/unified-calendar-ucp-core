# Unified Calendar Protocol (UCP) Core Engine

[![NPM Version](https://img.shields.io/npm/v/@unified-calendar/core.svg?style=flat-square)](https://www.npmjs.com/package/@unified-calendar/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Maintained by Yuanyu](https://img.shields.io/badge/Maintained%20by-Yuanyu%20(元宇)-emerald?style=flat-square)](https://www.yuanyucore.com)

> **One Timestamp. Five Civilizations.** 
> The official open-source engine for synchronizing the Gregorian, Chinese, Indian (Saka), Buddhist, and Islamic (Hijri) calendars through pure astrophysics.

The **Unified Calendar Protocol (UCP)** is an open standard designed to solve the problem of "Intercalation Drift" and "Timezone Ghosts" in cultural timekeeping. It provides a single, machine-readable string that locks five major human civilizations to the same geocentric UTC moment.

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

The engine is designed to be simple and robust.

```javascript
// Import the core engine
// Assuming a structure where the main file exports the core functions
const { generateUCP, decodeUCP } = require('@unified-calendar/core');

// 1. Generate a UCP string for a specific UTC moment
const ucpString = generateUCP("2024-05-23T14:30:45Z");

console.log(ucpString);
//> UE-12024 :: 05.23-08 :: 04.16.18 H11.15 [Bing-Chen] T14:30:45Z

// 2. Decode a UCP string to get its cultural data
// The decode function would be a feature to add to the library
const decodedData = decodeUCP(ucpString); 
console.log(decodedData.indian.amantaMonth);
//> 2 (Meaning Vaisakha, the 2nd Indian month)
```

## 📋 The UCP String Anatomy

The UCP string is divided into three logical blocks, designed for both machine and human readability:

`[UNIVERSAL EPOCH] :: [SOLAR TRACK] :: [LUNAR & HIJRI TRACK] [TIME]`

1.  **Universal Epoch (UE):** Based on the Holocene Era (HE), adding 10,000 years to the Gregorian year to prevent "Year Zero" bias.
2.  **Solar Track:** Maps Gregorian `Month.Day` alongside the 24 Chinese Solar Terms (`Jieqi`).
3.  **Lunar & Hijri Track:** A dense block containing:
    *   Chinese Lunar Month (`04`)
    *   Indian Tithi (`16`) & Nakshatra (`18`)
    *   Islamic Hijri Month & Day (`H11.15`)
    *   Chinese Sexagenary Day Pillar (`[Bing-Chen]`)
4.  **Absolute Time:** Locked to UTC (`Z`) to ensure global synchronization.

---

## 🔬 Scientific Foundation

UCP is built on high-precision astronomical calculations to ensure accuracy across millennia:
- **Geocentric Lock:** All calculations are performed in UTC to prevent regional discrepancies.
- **Chinese:** Calculated using Solar Terms (Zhongqi) and a mathematically pure Sexagenary anchor.
- **Indian:** Uses **Lahiri Ayanamsa** and the **Amanta** system (New Moon to New Moon) for consistent month mapping based on solar transits.
- **Islamic:** Uses the **Umm al-Qura** algorithmic Hijri calendar, the official standard of Saudi Arabia.

---

## 🏛️ About Yuanyu (元宇) & Enterprise API (Coming Soon)

**Yuanyu (元宇)** is a technology lab focused on the core foundations of digital time and astronomical data. We believe that as humanity becomes more digitally unified, our timekeeping should respect both our shared astrophysics and our diverse cultural heritage.

While this core library is open-source and free forever under the MIT license, Yuanyu also offers a **commercial Cloud API** for enterprise applications.

### Yuanyu Calendar Cloud
The API is designed for businesses requiring:
- 🌍 **Global Holiday Data:** High-precision predictions for Lunar New Year, Eid, Diwali, Vesak, and hundreds of other cultural festivals.
- 📡 **Real-time Astronomical Events:** Notifications for Eclipses, Solstices, and New Moon sightings.
- 📈 **Guaranteed SLAs:** High-availability endpoints for international HR, payroll, and logistics platforms.

## 📄 License
MIT © [Yuanyu (元宇)](https://www.yuanyucore.com)