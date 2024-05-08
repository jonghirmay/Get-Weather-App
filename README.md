
# Get-Weather-App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Raspberry Pi, Temperature and Humidity app 

Python script on Raspberry Pi sends data to MongoDB database in three different collections:
* sensor_data 
* smhi_data
* combined_data


```python

import os
import time
import requests
import Adafruit_DHT
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# inititalize env variable
load_dotenv()

# Setup locale
import locale
locale.setlocale(locale.LC_TIME, 'sv_SE.UTF-8')

# Environment variables for credentials and connection strings
MONGO_URI = os.getenv('MONGO_URI')
SENSOR_PIN = 4

# Setup sensor
sensor = Adafruit_DHT.DHT11

# MongoDB connection setup
client = MongoClient(MONGO_URI)
db = client['tempHum_db']
sensor_data_collection = db['sensor_data']
smhi_data_collection = db['smhi_data']
combined_data_collection = db['combined_data']

def read_sensor(pin):
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    return temperature, humidity

def fetch_data_from_api(parameter, measuringStations):
    version = "1.0"
    baseUrl = f"https://opendata-download-metobs.smhi.se/api/version/{version}/parameter/{parameter}/station/{measuringStations}/period/latest-hour/data.json"
    response = requests.get(baseUrl)
    if response.ok:
        data = response.json()
        latest_entry = data['value'][-1]
        return float(latest_entry['value'])
    else:
        raise Exception(f"Failed to retrieve data: {response.status_code}")

def send_to_mongo(collection, data):
    result = collection.insert_one(data)
    if result.acknowledged:
        print('Data successfully inserted into MongoDB.')
    else:
        print('Failed to insert data into MongoDB.')


def main():
    try:
        while True:
            time.sleep(3600) # Runs script every hour

            temperature, humidity = read_sensor(SENSOR_PIN)
            if temperature is not None and humidity is not None:
                timestamp = datetime.datetime.now().strftime('%c')
                sensor_data = {
                    'temperature': temperature,
                    'humidity': humidity,
                    'timestamp': timestamp
                }
                send_to_mongo(sensor_data_collection, sensor_data)

                try:
                    api_temperature = fetch_data_from_api(1, "97100")  # Temperature parameter ID and station
                    api_humidity = fetch_data_from_api(6, "97100")     # Humidity parameter ID and station
                    smhi_data = {
                        'temperature': api_temperature,
                        'humidity': api_humidity,
                        'timestamp': timestamp
                    }

                    send_to_mongo(smhi_data_collection, smhi_data)

                    combined_data = {
                        'sensor_data': {
                            'temperature': sensor_data['temperature'],
                            'humidity': sensor_data['humidity']
                        },
                        'smhi_data': {
                            'temperature': smhi_data['temperature'],

                            'humidity': smhi_data['humidity']
                        },
                        'timestamp': timestamp
                    }

                    send_to_mongo(combined_data_collection, combined_data)



                except Exception as error:
                    print(f"Error: {error}")

                print(f"Temperature: {temperature} C, Humidity: {humidity}%, Timestamp: {timestamp}")

    except KeyboardInterrupt:
        print('Program stopped manually')
    except Exception as e:
        print(f'An error occurred: {e}')


if __name__ == '__main__':
    main()

```



*"OPTIONAL"* Node backend as middleware between front-end and Database.

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const CombinedData = require('./models/CombinedData');


const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.use(cors());

app.get('/api/data', async (req,res) => {
    try {
        const data = await CombinedData.find({})


        console.log(`Data: ${data}`)
        res.send(data)

    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve data', details: error.message})
    }
})

app.get('/', async (req, res) => {
    try {
        res.send('Welcome to My Weather App')
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

const PORT = process.env.PORT || 5003
app.listen(PORT, () => [
    console.log('Server running on port ', PORT)
])


```


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

*"OPTIONAL"* Then run Nodebackend.
```bash
node server.js
```
Run raspberry python script
```bash
python3 script.py

```

Logic exists to run without Nodebackend and directly from the Next app using the api/ routes in the application.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
