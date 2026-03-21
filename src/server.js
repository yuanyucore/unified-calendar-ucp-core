// server.js
const express = require('express');
const { generateUCP } = require('./engine-core');
const app = express();

app.get('/api/ucp/now', (req, res) => {
    const ucp = generateUCP(new Date().toISOString());
    res.json({ ucpString: ucp });
});

app.listen(3000, () => console.log('UCP API server running on port 3000'));