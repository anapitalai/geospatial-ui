
//geolocation

if ('geolocation' in navigator) {
    console.log('available')
    navigator.geolocation.getCurrentPosition(async function (position) {

        const lon = position.coords.longitude;
        const lat = position.coords.latitude;

        const displayLatHandle = document.getElementById('lat');
        const displayLonHandle = document.getElementById('lon');
        displayLatHandle.innerText = lat;
        displayLonHandle.innerText = lon;
        const data = { lat, lon };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch('http://localhost:4009/api', options);
    });



} else {
    console.log('not available');
}




