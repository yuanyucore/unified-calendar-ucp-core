// math-western.js

function getWesternData(date) {
    // We strictly use UTC to align with the Geocentric rule of the UCP standard
    const yearCE = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // Universal Epoch (Holocene Era)
    const epoch = yearCE + 10000;

    return {
        epoch: epoch,
        month: month,
        day: day
    };
}

module.exports = { getWesternData };