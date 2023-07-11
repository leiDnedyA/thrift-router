import dotenv from 'dotenv';

dotenv.config();

/**
 * Makes a request to a places API to find thrift shops
 * within a given radius (in meters)
 * 
 * Note: currently using the geoapify places API but that
 * may change in the near future
 * 
 * @param {number[]} latLng lat and long of search point
 * @param {number} radius radius in meters of search
 * @returns {{name: string, position: number[]}[]} objects representing found theift shops
 * 
 */
async function thriftsWithinRadius(latLng, radius) {
    console.log(latLng);
    return fetch(`https://api.geoapify.com/v2/places?categories=commercial.second_hand,commercial.antiques&filter=circle:${latLng[1]},${latLng[0]},${radius}&bias=proximity:${latLng[1]},${latLng[0]}&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`)
    .then(res=>res.json())
    .then(result=>{
        return result.features.reduce((accumulator, curr)=>{
            console.log(curr);
            const currProps = curr.properties;
            const currPlace = {
                name: currProps.name,
                position: [currProps.lat, currProps.lon]
            };
            if (currProps.hasOwnProperty("address_line1") && currProps.hasOwnProperty("address_line2")) {
                currPlace.address = {
                    "line1" : currProps.address_line1,
                    "line2": currProps.address_line2
                }
            }
            accumulator.push(currPlace);
            return accumulator;
        }, []);
    })
}

export {thriftsWithinRadius}