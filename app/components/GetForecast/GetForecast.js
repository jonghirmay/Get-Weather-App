'use client'

import React, { useState, useEffect } from 'react';
const styles = require('./GetForecast.module.scss')
import axios from 'axios';

export default function GetForecast() {
    const [forecastData, setForecastData] = useState([]);
    const [currentData, setCurrentData] = useState('')

    const fetchForecast = async () => {
        const url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.158/lat/58.5812/data.json';
        try {
            const response = await axios.get(url);
            const data = response.data;
            console.log(data)

            const currentRawDate = new Date(data.timeSeries[0].validTime)
            const currentFormattedDate = currentRawDate.toLocaleTimeString()

            const currentTime = {
                day: currentFormattedDate,
                temperature: data.timeSeries[0].parameters[10].values[0],
                humidity: data.timeSeries[0].parameters[15].values[0]
            }

            setCurrentData(currentTime)

            let fullData = [];

            for (let i = 1; i < 13; i++) {
                const rawDate = new Date(data.timeSeries[i].validTime)

                const formattedDate = rawDate.toLocaleTimeString()


                let forecastTime = {
                    day: formattedDate,
                    temperature: data.timeSeries[i].parameters[10].values[0],
                    humidity: data.timeSeries[i].parameters[15].values[0]
                };
                fullData.push(forecastTime);
            }

            setForecastData(fullData); // Update the state with the fetched data
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
