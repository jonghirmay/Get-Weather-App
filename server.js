const express = require('express');
const cors = require('cors')
const { BigQuery } = require('@google-cloud/bigquery');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH,
})

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/data', async (req, res) => {
    try {
        const query = 'SELECT * FROM `partna-collected-data.test_dataset.tempHum` LIMIT 10'
        const options = {
            query: query,
            location: 'EU',
        }

        const [rows] = await bigquery.query(options);
        res.json(rows);

    } catch (error) {
        console.error('Error querying BigQuery', error);
        res.status(500).json({error})
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
