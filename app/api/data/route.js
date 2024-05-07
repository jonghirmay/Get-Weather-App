

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:5003/api/data')
        return response

    } catch (error) {
        console.error('Error fetching data:', error);
        return { props: { error: 'Failed to fetch data.' } };
    }
}

export async function GET() {
    try {
        const data = await fetchData();
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