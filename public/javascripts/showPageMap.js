mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: tour.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});
	map.addControl(new mapboxgl.NavigationControl());
	new mapboxgl.Marker()
	    .setLngLat(tour.geometry.coordinates)
	    .setPopup(
	        new mapboxgl.Popup({
	            offset: 25
	        })
	        .setHTML(
	            `<h3>${tour.title}</h3><p>${tour.location}</p>`
	        )
	    )
	    .addTo(map)