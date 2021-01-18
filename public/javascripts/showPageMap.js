mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: tour.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(tour.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})    
        .setHTML(
            `<h3>${tour.title}</h3><p>${tour.location}</p>`
        )
    )
    .addTo(map)