import { MongoClient } from 'mongodb';



// Function to fetch data from MongoDB
async function fetchSensorData() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME); // Use your actual database name
    const collection = db.collection('sensor_data');
    const data = await collection.find({}).toArray();
    return data;
  } finally {
    client.close();
  }
}

// Export a named function for the GET HTTP method
export async function GET() {
  try {
    const data = await fetchSensorData();
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { 'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allows all origins. For production, replace * with your frontend's origin
      'Access-Control-Allow-Methods': 'GET, OPTIONS', // Specify allowed methods
      'Access-Control-Allow-Headers': 'Content-Type'
       },
      
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to connect to the database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}