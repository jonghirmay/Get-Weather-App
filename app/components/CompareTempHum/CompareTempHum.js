'use client'
const styles = require('./CompareTempHum.module.scss')
import React, { useEffect, useState } from 'react';
const axios = require('axios')

export default function GetLatestSensorData() {

    const [data, setData] = useState([]); // 
    const [displayData, setDisplayData] = useState(null)
    const [currentData, setCurrentData] = useState({
        timestamp: '',
        sensor_data: {
            temperature: null,
            humidity: null
        },
        smhi_data: {
            temperature: null,
            humidity: null
        }
    })
    
    // fetches data from the node backend
    async function fetchData() {

      try {

        const response = await axios.get('http://localhost:5003/api/data')

        // sets useState data = response.data
        if(response && response.data) {
          setData(response.data)
        }
        const latestData = response.data[response.data.length - 1];

        setCurrentData({
            timestamp: latestData.timestamp,
            sensor_data: {
                temperature: latestData.sensor_data.temperature,
                humidity: latestData.sensor_data.humidity,
            },
            smhi_data: {
                temperature: latestData.smhi_data.temperature,
                humidity: latestData.smhi_data.humidity,
            },
        });

        
      } catch (error) {
        console.error('Fetch error', error.message)
      }
    }

    const handleTimeStampChange = (event) => {
        const timestamp = event.target.value;
        const selectedData = data.find(item => item.timestamp === timestamp);
        setDisplayData(selectedData)
    }




    useEffect(() => {
        fetchData();    //Empty dependency array to ensure this effect runs only once after initial render
    }, [])

    return(
        <div className={styles.wrapper}>
            <h3>Temperature and humidity Data</h3>
            <div className={styles.currentResultsDiv}>
                <div>
                    <h4>Latest Weather data stored from SMHI</h4>
                    <p><b>Timestamp:</b> {currentData.timestamp}</p>
                    <p><b>Temperature:</b> {currentData.smhi_data.temperature} °C </p>
                    <p><b>Humidity:</b> {currentData.smhi_data.humidity} %</p>
                </div>
                <div>
                     <h4>Latest sensor data from inside my bedroom</h4>
                    <p><b>Timestamp:</b> {currentData.timestamp}</p>
                    <p><b>Temperature:</b> {currentData.sensor_data.temperature} °C </p>
                    <p><b>Humidity:</b> {currentData.sensor_data.humidity} %</p>
                </div>
            </div>

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
