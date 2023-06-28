const express = require('express');
const app = express();
const { thriftsWithinRadius } = require('./api/placesAPI.js');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

// thriftsWithinRadius([41.988721379924996, -71.33801148811348], 20000)
//     .then(result => {
//         console.log(result);
//     });

app.use('/api/searchCircle/pos/:lat,:lon/rad/:radius', (req, res)=>{
    thriftsWithinRadius([req.params.lat, req.params.lon], req.params.radius)
        .then(result => {
            res.send(result);
        });
});

app.listen(PORT, () => { console.log(`App serving at port: ${PORT}`) });