async function getTLEData() {
    try {
        const response = await fetch('https://tle.ivanstanojevic.me/api/tle/25544') // get TLE data by id
        const data = await response.json()

        return [data.line1, data.line2]
    }
    catch(error) {
        console.error('Error in getTLEData: ', error)
    }
}

export default getTLEData