'use client'

import { useState, useEffect } from 'react';

const axios = require('axios');
const styles = require('./GetLatestHourTempHum.module.scss');


export default function GetLatestHourTempHum() {

    const version = '1.0';
    const tempParameter = '1';
    const humidityParameter = '6'
    const measuringStations = '97100'; // Tullinge
    const tempUrl = `https://opendata-download-metobs.smhi.se/api/version/${version}/parameter/${tempParameter}/station/${measuringStations}/period/latest-hour/data.json`;
    const humidityUrl = `https://opendata-download-metobs.smhi.se/api/version/${version}/parameter/${humidityParameter}/station/${measuringStations}/period/latest-hour/data.json`



    const [latestTempReport, setLatestTempReport] = useState({ dateTime: '', temp: ''})
    const [latestHumidityReport, setLatestHumidityReport] = useState({humidity: ''})


    const fetchHumidity = async () => {

        const response = await axios.get(humidityUrl)

        if(response.data && response.data.value.length > 0) {
            const humidity = `${response.data.value[0].value}`
            setLatestHumidityReport({humidity: humidity})

            return latestHumidityReport
        }else {
            console.log('No humidity data available')
        }
    }



        const fetchTemp = async () => {

            try {
                const response = await axios.get(tempUrl);
                if(response.data && response.data.value.length > 0) {

                    const latestTempTime = new Date(response.data.value[0].date).toLocaleTimeString();
                    const latestTempDate = new Date(response.data.value[0].date).toLocaleDateString();
                    
                    const dateAndTime = `${latestTempDate} - ${latestTempTime}`
                    const temperature =  `${response.data.value[0].value} °C`
                    const humidity = `${fetchHumidity()}%`
                    setLatestTempReport({dateTime: dateAndTime, temp: temperature})


                }else {
                    console.log('No temp data available')
                }



                
            } catch (error) {
                console.error('Failed to fetch latest hours temp: ', error.message);
                
            }
        }




    

    return(
        <div className={styles.wrapper}>
            <h3>SMHI API Data</h3>
            <label>Press button and get the current hours temp in local time.</label>
            <button className={styles.fetchButton} onClick={fetchTemp}>Press</button>    
            <p>Date & Time: {latestTempReport.dateTime}</p>
            <p>Temperature: {latestTempReport.temp}</p>
            <p>Humidity: {latestHumidityReport.humidity}</p>
        </div>
    )


    
}
