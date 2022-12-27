module.exports = {
  distanceDiff: (origin, destination) => {
    const lats = [origin.lat, destination.lat]
    const lngs = [origin.lng, destination.lng]
    if (lats.length < 2 || lngs.length < 2) return
    const radLats = lats.map(lat => {
      return Math.PI * lat / 180
    })
    const radLng = Math.PI * (lngs[0] - lngs[1]) / 180
    let distanceDiff = Math.sin(radLats[0]) * Math.sin(radLats[1]) + Math.cos(radLats[0]) * Math.cos(radLats[1]) * Math.cos(radLng)
    distanceDiff = Math.acos(distanceDiff)
    distanceDiff = distanceDiff * 180 / Math.PI * 60 * 1.1515
    distanceDiff = distanceDiff * 1.609344 * 1000
    return Math.round(distanceDiff)
  }
}
