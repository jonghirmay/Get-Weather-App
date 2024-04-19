
'use client'
const styles = require('./GetLatestSensorData.module.scss');
import React, { useEffect, useState } from 'react';
const axios = require('axios')

export default function GetLatestSensorData() {

    const [data, setData] = useState([]);

    async function fetchData() {

      try {

        const response = await axios.get('http://localhost:5001/data')

        if(response && response.data) {
          setData(response.data)
        }
        
      } catch (error) {
        console.error('Fetch error', error.message)
      }
    }

    return(
        <div className={styles.wrapper}>
            <h3>Sensor Data</h3>
            <label>Press button and get the latest hours temp in local time.</label>
            <button className={styles.fetchButton} onClick={fetchData}>Press</button>
            <table>
                <thead>
                    <tr>
                        <th>Temperature (°C)</th>
                        <th>Humidity (%)</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.temperature}</td>
                            <td>{item.humidity}</td>
                            <td>{new Date(item.timestamp.value).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )


}