let map;
let service;
let markers = [];

function initMap() {
  const defaultLocation = { lat: 48.8566, lng: 2.3522 }; // Paris
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  document.getElementById('cityInput').addEventListener('change', () => {
    const city = document.getElementById('cityInput').value;
    geocodeCity(city);
  });
}

function geocodeCity(city) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: city }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(13);
      clearMarkers();
      searchNearby(location, 'tourist_attraction', 'attractions');
      searchNearby(location, 'restaurant', 'restaurants');
      searchNearby(location, 'lodging', 'hotels');
    } else {
      alert("Could not find location: " + status);
    }
  });
}

function searchNearby(location, type, elementId) {
  const request = {
    location,
    radius: 2000,
    type: [type]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const list = document.getElementById(elementId);
      list.innerHTML = '';
      results.slice(0, 5).forEach(place => {
        createMarker(place);
        const li = document.createElement('li');
        li.textContent = place.name;
        list.appendChild(li);
      });
    }
  });
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  markers.push(marker);
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  ['attractions', 'restaurants', 'hotels'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
}