import express from 'express';
import { thriftsWithinRadius } from './api/placesAPI.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 8080;
const app = express();

app.use(express.static('public'));

// thriftsWithinRadius([41.988721379924996, -71.33801148811348], 20000)
//     .then(result => {
//         console.log(result);
//     });

app.use('/api/searchCircle/pos/:lat,:lon/rad/:radius', (req, res) => {
    thriftsWithinRadius([req.params.lat, req.params.lon], req.params.radius)
        .then(result => {
            res.send(result);
        });
});

app.listen(PORT, () => { console.log(`App serving at port: ${PORT}`) });