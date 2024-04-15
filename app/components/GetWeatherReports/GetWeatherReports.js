'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const styles = require('./GetWeatherReports.module.scss');

export default function GetWeatherReports() {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0)

    const version = '1.0';
    const parameter = '1';
    const measuringStations = '98210';
    const baseUrl = `https://opendata-download-metobs.smhi.se/api/version/${version}/parameter/${parameter}/station/${measuringStations}/period/latest-months/data.json`;

    useEffect(() => {
        axios.get(baseUrl).then(response => {
            const formattedArray = response.data.value.map(item => ({
                date: new Date(item.date).toUTCString(),
                temp: item.value,
            }));

            setData(formattedArray);
        }).catch(error => {
            console.error('Error fetching data', error.message);
        });
    }, []);

    return (
        <div className={styles.wrapper}>
            {data.length > 0 ? (
                <>
                    <button onClick={() => {
                        setCount(count => count +2)
                    }}>increment</button>
                    <p>{data[count]?.date}</p>
                    <p>{data[count]?.temp + ' C'}</p>
                    <button onClick={() => {
                        setCount(count => count -2)
                    }}>decrement</button>
                    <p>{count}</p>
                </>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}