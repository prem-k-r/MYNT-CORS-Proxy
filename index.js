import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Rate limit: Allow 500 requests per 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many search requests from this IP. Try again in 15 minutes.'
});
app.use(limiter);

// 🌐 Allow CORS for all origins
app.use(cors());

app.get('/proxy', async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Missing ?url=' });

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Fetch error:', err.message);
        res.status(502).send('Proxy failed to fetch target URL');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 MYNT CORS Proxy running at http://localhost:${PORT}/proxy?url=...`);
});
