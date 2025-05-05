
let map;
let service;
let markers = [];

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Set the user's location (you might get this from geolocation or hardcode it)
  const userLocation = { lat: 51.406, lng: 0.013 };

  // Initialize the map
  map = new Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 15,
  });

  // Now trigger the nearby search
  searchNearby("hotels", userLocation);
  searchNearby("restaurants", userLocation);
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


  

async function searchNearby(type, location, radius = 1500) {
    const apiKey = 'AIzaSyBpcwXrwFvLRqOc0PPMlUT7rmbrRswwPTM';
  
    const url = `https://places.googleapis.com/v1/places:searchText`;
  
    const requestBody = {
      textQuery: type,
      locationBias: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: radius
        }
      },
      maxResultCount: 10
    };
  
    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.photos'
        },
        body: JSON.stringify(requestBody)
      });
  
      const data = await response.json();
      console.log('✅ Nearby places for', type, ':', data);
  
      if (data.places && Array.isArray(data.places)) {
        data.places.forEach(place => {
          const name = place.displayName?.text || 'Unknown';
          const address = place.formattedAddress || 'No address available';
          console.log(`- ${name}, ${address}`);
        });
      } else {
        console.warn('⚠️ No places found for:', type);
      }
  
    } catch (error) {
      console.error('❌ Error in searchNearby:', error);
    }
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