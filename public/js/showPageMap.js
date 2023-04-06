
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: prospect.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(prospect.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${prospect.name}</h3>`
    )
)
.addTo(map)
