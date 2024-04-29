'use client'

import { useState, useEffect } from 'react';

const axios = require('axios');
const styles = require('./GetLatestHourTempHum.module.scss');


export default function GetLatestHourTempHum() {

    const version = '1.0';
    const parameter = '1';
    const measuringStations = '97100'; // Tullinge
    const baseUrl = `https://opendata-download-metobs.smhi.se/api/version/${version}/parameter/${parameter}/station/${measuringStations}/period/latest-hour/data.json`;




    const [latestTempReport, setLatestTempReport] = useState({ dateTime: '', temp: ''})



        const fetchData = async () => {



            try {
                const response = await axios.get(baseUrl);
                if(response.data && response.data.value.length > 0) {

                    const latestTempTime = new Date(response.data.value[0].date).toLocaleTimeString();
                    const latestTempDate = new Date(response.data.value[0].date).toLocaleDateString();
                    
                    const dateAndTime = `${latestTempDate} - ${latestTempTime}`
                    const temperature =  `${response.data.value[0].value}`
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
            <label>Press button and get the latest hours temp in local time.</label>
            <button className={styles.fetchButton} onClick={fetchData}>Press</button>    
            <p>Date & Time: {latestTempReport.dateTime}</p>
            <p>Temperature: {latestTempReport.temp}</p>
        </div>
    )


    
}
