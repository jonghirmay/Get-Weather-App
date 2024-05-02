
'use client'
const styles = require('./GetLatestSensorData.module.scss');
import React, { useEffect, useState } from 'react';
const axios = require('axios')

export default function GetLatestSensorData() {

    const [data, setData] = useState([]);
    const [selectedTimeStamp, setSelectedTimestamp] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    

    async function fetchData() {

      try {

        const response = await axios.get('/api/combined-data')

        if(response && response.data) {
          setData(response.data)
        }
        
      } catch (error) {
        console.error('Fetch error', error.message)
      }
    }

    const handleTimeStampChange = (event) => {
        const timestamp = event.target.value;
        const selectedData = data.find(item => item.timestamp === timestamp);
        setSelectedTimestamp(selectedData);
    }

    const handleDisplayData = () => {
        if(selectedTimeStamp) {
            setDisplayData(selectedTimeStamp);  
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return(
        <div className={styles.wrapper}>
            <h3>Sensor Data</h3>
            <div>
                <label htmlFor={styles.dataSelect}>Choose timestamp</label>
                <select id={styles.dataSelect} onChange={handleTimeStampChange}>
                    {data.map((item, index) => (
                    <option key={index} value={item.timestamp}>
                        {item.timestamp}
                    </option>
                ))}
                </select>
                <button onClick={handleDisplayData}>Press</button>
            </div>
            {displayData && (
                <div>
                    <p>Timestamp: {displayData.timestamp}</p>
                    <p>Temperature: {displayData.sensor_data.temperature} °C</p>
                    <p>Humidity: {displayData.sensor_data.humidity} %</p>
                </div>
            )}
        </div>
    )


}