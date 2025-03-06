require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new PlaidApi(
    new Configuration({
        basePath: PlaidEnvironments.sandbox, // Change for dev/prod
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
            },
        },
    })
);

let ACCESS_TOKEN = '';

app.post('/get_access_token', async (req, res) => {
    try {
        const { public_token } = req.body;
        const response = await client.itemPublicTokenExchange({ public_token });
        ACCESS_TOKEN = response.data.access_token;
        res.json({ access_token: ACCESS_TOKEN });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/get_transactions', async (req, res) => {
    try {
        const response = await client.transactionsGet({
            access_token: ACCESS_TOKEN,
            start_date: '2024-01-01',
            end_date: '2024-03-06',
        });

        res.json(response.data.transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('✅ Server running on port 5000'));
