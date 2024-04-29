'use client'
const styles = require('./GetLatestSmhiData.module.scss')
import { useState, useEffect } from 'react';
const axios = require('axios')



export default function GetLatestSmhiData() {

    const [data, setData] = useState([]);
    const [selectedTimeStamp, setSelectedTimestamp] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    

    async function fetchData() {

      try {

        const response = await axios.get('http://localhost:3001/api/smhi-data')

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
            <h3>SMHI Data</h3>
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
                    <p>Temperature: {displayData.temperature} °C</p>
                    <p>Humidity: {displayData.humidity} %</p>
                </div>
            )}
            {/* <label>Press button and get the latest temp in local time.</label>    
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
                    <label>All data</label>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.temperature}</td>
                            <td>{item.humidity}</td>
                            <td>{item.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    )


}