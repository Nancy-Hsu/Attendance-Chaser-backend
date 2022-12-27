if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const express = require('express')
const methodOverride = require('method-override')
const routes = require('./routes/index.js')
require('express-async-errors');
const cors = require('cors')
const { apiErrorHandler } = require('./middleware/error-handler')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/api', routes)
app.use(apiErrorHandler)

axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.google_KEY}`)
.then(res => {
  // console.log(res)
})

// function distance(lat1, lon1, lat2, lon2, unit) {
//   if ((lat1 == lat2) && (lon1 == lon2)) {
//     return 0;
//   }
//   else {
//     var radlat1 = Math.PI * lat1 / 180;
//     var radlat2 = Math.PI * lat2 / 180;
//     var theta = lon1 - lon2;
//     var radtheta = Math.PI * theta / 180;
//     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     if (dist > 1) {
//       dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = dist * 180 / Math.PI;
//     dist = dist * 60 * 1.1515;
//     if (unit == "K") { dist = dist * 1.609344 *1000 }
//     if (unit == "N") { dist = dist * 0.8684 }
//     return dist;
//   }
// }
// const one= {
//   lat: 24.786133772441204,
//   lng: 121.02081632363519
// }
// const two = {
//   lat: 24.786077688690614,
//   lng: 121.02062920169567
// }
// const { distanceDiff } = require('./helpers/distanceDiff-helper')
// console.log(distance(25.05758954887687, 121.61231323665174, 25.05734171246579, 121.6119055409079, 'K'))
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})


