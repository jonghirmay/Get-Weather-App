// pages/api/bigQueryData.js
import { BigQuery } from '@google-cloud/bigquery';

const bq_client = new BigQuery();

export default async function handler(req, res) {
    console.log('API Request received');
    console.log('Query Parameters:', req.query);
    console.log('Request Body:', req.body); // Useful if you handle POST requests
    console.log('Request Method:', req.method);

    const { type } = req.query;

    try {
        let data;
        if (type === 'fetch') {
            console.log('Handling fetch...');
            data = await getBigQueryTableData();
        } else if (type === 'match') {
            console.log('Handling match...');
            data = await matchServices(getBigQueryTableData);
        }
        console.log('Sending data:', data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
}

async function getBigQueryTableData() {
    const query = `SELECT * FROM \`partna-marketing-data.partna_agencies_dataset.agency_details\` LIMIT 100`;
    try {
        const [rows] = await bq_client.query(query);
        // Process rows as necessary
        return rows.map(company => {
            // Assuming projectIndustries and topSkills are JSON strings that need parsing.

                // Corrects errors in format in BigQueryTable projectIndustries column to correct JSON format
            let correctedJSONIndustries = company.projectIndustries
                .replace(/```json|```/g, '') // Remove Markdown code block notation
                .replace(/'(.*?)'/g, `"${'$1'}"`) // Replace single quotes with double quotes around JSON values
                .replace(/(\{|,)\s*(\w+):/g, '$1 "$2":') // Ensure property names are in double quotes
                .replace(/:\s*''/g, ': ""'); // Correct empty strings

            // Corrects errors in format in BigQueryTable for topskill column to correct JSON format
            let correctedJSONServices = company.topSkills
                .replace(/```json|```/g, '') // Remove Markdown code block notation
                .replace(/'(.*?)'/g, `"${'$1'}"`) // Replace single quotes with double quotes around JSON values
                .replace(/(\{|,)\s*(\w+):/g, '$1 "$2":') // Ensure property names are in double quotes
                .replace(/:\s*''/g, ': ""'); // Correct empty strings

            return {
                ...company,
                projectIndustries: JSON.parse(correctedJSONIndustries || '{}'),
                topSkills: JSON.parse(correctedJSONServices || '{}')
            };
        });
    } catch (error) {
        console.error('Error querying BigQuery', error);
        throw new Error('Failed to fetch data from BigQuery');
    }
}

async function matchServices(dataFetcher) {
    const servicesIndustries = {
        services: ['E-Commerce Solutions', 'Mobile App Development'],
        industries: ['Healthcare', 'Finance']
    };
    const companyData = await dataFetcher();
    return companyData.filter(company => {
        return company.topSkills.some(skill => servicesIndustries.services.includes(skill.service) &&
            company.projectIndustries.some(industry => servicesIndustries.industries.includes(industry.industry)));
    }).slice(0, 5);
}