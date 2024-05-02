const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const RASPBERRY_PI_API = ''


const dataSchema = new mongoose.Schema({
    temperatureSensor: Number,
    humiditySensor: Number,
    temperatureSmhi: Number,
    humiditySmhi: Number,
    timestamp: String,
})

const tempHumData = mongoose.model('tempHumData', dataSchema)

try {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected...')
} catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`)
}

const smhidata = () => {
    
}

const fetchAndSaveData = () => {
    try {

        const response = axios.get(RASPBERRY_PI_API)


        
    } catch (error) {
        
    }
}