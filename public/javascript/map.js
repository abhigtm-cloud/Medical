mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoaS0zMDAzIiwiYSI6ImNtOXZsazUxejBrODAyaXNnNXFlc3h3YngifQ.qZInPAbK5nxe4dMrUPOqpQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'my-class' }) // Add a popup
            .setHTML(`<p>${listing.location}</p>`)
    )
    .addTo(map);

// Open the popup by default
marker.getPopup().addTo(map);