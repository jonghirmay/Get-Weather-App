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
        setDisplayData(selectedData)
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
            </div>
            {displayData && (
                <div>
                    <p>Timestamp: {displayData.timestamp}</p>
                    <p>Temperature: {displayData.smhi_data.temperature} °C</p>
                    <p>Humidity: {displayData.smhi_data.humidity} %</p>
                </div>
            )}
        </div>
    )


}