'use client'

import React, { useState, useEffect } from 'react';
const styles = require('./GetForecast.module.scss')
import axios from 'axios';

export default function GetForecast() {
    const [forecastData, setForecastData] = useState([]); 
    const [currentData, setCurrentData] = useState('') 

    // fetches data from the 'smhi open api'
    const fetchForecast = async () => {
        const url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.548/lat/59.1637/data.json';
        try {
            const response = await axios.get(url);
            const data = response.data;
            console.log(data)

            const currentRawDate = new Date(data.timeSeries[0].validTime)
            const currentFormattedDate = currentRawDate.toLocaleTimeString()

            const currentTime = {
                day: currentFormattedDate,
                temperature: data.timeSeries[0].parameters[0].values,
                humidity: data.timeSeries[0].parameters[5].values
            }
            console.log(currentTime)
            
            setCurrentData(currentTime)// Updates the value with the latest fetched forecastdata

            let fullData = [];

            for (let i = 1; i < 13; i++) { 
                const rawDate = new Date(data.timeSeries[i].validTime)

                const formattedDate = rawDate.toLocaleTimeString()


                let forecastTime = {
                    day: formattedDate,
                    temperature: data.timeSeries[i].parameters[0].values,
                    humidity: data.timeSeries[i].parameters[5].values
                };
                fullData.push(forecastTime);
                console.log(fullData)
            }

            setForecastData(fullData); // Updates the array with fetched forecastdata
        } catch (error) {
            console.error('Failed to fetch forecast:', error);
        }   
    };

    useEffect(() => {

        fetchForecast();
    }, []); // Empty dependency array to ensure this effect runs only once after initial render

    return (
        <div className={styles.wrapper}>
            <h2>Weather Forecast</h2>
            <div className={styles.forecast}>
                <h4 className={styles.subHeader}>Current Weather</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>{currentData.day}</td>
                                <td>{currentData.temperature} °C</td>
                                <td>{currentData.humidity}%</td>
                            </tr>
                    </tbody>
                </table>
                <h4 className={styles.subHeader}>Coming Weather</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.day}</td>
                                <td>{item.temperature} °C</td>
                                <td>{item.humidity}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            
        </div>
    );
}
