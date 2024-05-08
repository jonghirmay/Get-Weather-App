'use client'
const styles = require('./CompareTempHum.module.scss')
import React, { useEffect, useState } from 'react';
const axios = require('axios')

export default function GetLatestSensorData() {

    const [data, setData] = useState([]); // 
    const [selectedTimeStamp, setSelectedTimestamp] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    
    // fetches data from the node backend
    async function fetchData() {

      try {

        const response = await axios.get('http://localhost:5003/api/data')

        // sets useState data = response.data
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
        // setSelectedTimestamp(selectedData);
        setDisplayData(selectedData)
    }

    // const handleDisplayData = () => {
    //     if(selectedTimeStamp) {
    //         setDisplayData(selectedTimeStamp);  
    //     }
    // }


    useEffect(() => {
        fetchData();    //Empty dependency array to ensure this effect runs only once after initial render
    }, [])

    return(
        <div className={styles.wrapper}>
            <h3>Temperature and humidity Data</h3>
            <div>
                <label htmlFor={styles.dataSelect}>Choose timestamp</label>
                <select id={styles.dataSelect} onChange={handleTimeStampChange}>
                    {data.map((item, index) => (
                    <option key={index} value={item.timestamp}>
                        {item.timestamp}
                    </option>
                ))}
                </select>
            </div>
            <div className={styles.resultsDiv}>
                <div>
                {displayData && (
                    <div>
                        <h4>Outside Weather data stored from SMHI</h4>
                        <p><b>Timestamp:</b> {displayData.timestamp}</p>
                        <p><b>Temperature:</b> {displayData.smhi_data.temperature} °C </p>
                        <p><b>Humidity:</b> {displayData.smhi_data.humidity} %</p>
                    </div>
                )}
                </div>
                <div>
                {displayData && (
                    <div>
                        <h4>Sensor data from inside my bedroom</h4>
                        <p><b>Timestamp:</b> {displayData.timestamp}</p>
                        <p><b>Temperature:</b> {displayData.sensor_data.temperature} °C </p>
                        <p><b>Humidity:</b> {displayData.sensor_data.humidity} %</p>
                    </div>
                )}

                </div>
            </div>


        </div>
    )

    
}
