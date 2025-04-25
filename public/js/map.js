mapboxgl.accessToken = mapToken;

// Check if listing has valid geometry
if (!listing || !listing.geometry || !listing.geometry.coordinates) {
  console.error('Invalid listing data for map:', listing);
  document.getElementById('map').innerHTML = '<div class="alert alert-warning">Map location data unavailable</div>';
} else {
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12", // fixed style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
  });

  const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);
    
  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());
} 