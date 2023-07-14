import express from 'express';
import { placesAPIRouter } from './api/placesAPI.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 8080;
const app = express();

app.use(placesAPIRouter);

app.use(express.static('dist'));

app.listen(PORT, () => { console.log(`App serving at port: ${PORT}`) });