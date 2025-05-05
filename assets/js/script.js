const stepTracker = { currentStep: 0 };
let map;
let markers = [];


document.addEventListener("DOMContentLoaded", function () {
    const nextPageIntro = document.getElementById("nextPageIntro");

    if (nextPageIntro) {
      nextPageIntro.addEventListener("click", nextFunction);
    }
  });

  function nextFunction() {
    let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
    if (currentPage) {
      currentPage.classList.add("hidden");
    }
  
    stepTracker.currentStep++;
  
    let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
    if (nextPage) {
      nextPage.classList.remove("hidden");
    }
  
    if (stepTracker.currentStep > 2) {
      stepTracker.currentStep = 2; // Prevent going beyond the last step
    }
  }

// Initialize the map
function initMap() {
    const fallbackLocation = { lat: 48.8566, lng: 2.3522 }; // Paris
  
    map = new google.maps.Map(document.getElementById("map"), {
      center: fallbackLocation,
      zoom: 13,
    });
  
    // Try to use user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          map.setCenter(userLocation);
          map.setZoom(14);
  
          searchNearby("tourist attractions", userLocation, "attractions");
          searchNearby("restaurants", userLocation, "restaurants");
          searchNearby("hotels", userLocation, "hotels");
        },
        (error) => {
          console.warn("Geolocation failed or was denied. Using fallback location.");
          runDefaultSearch(fallbackLocation);
        }
      );
    } else {
      console.warn("Geolocation not supported. Using fallback location.");
      runDefaultSearch(fallbackLocation);
    }
  
    // Handle map movement
    map.addListener("idle", () => {
      const center = map.getCenter();
      const location = {
        lat: center.lat(),
        lng: center.lng(),
      };
      clearMarkers();
      searchNearby("tourist attractions", location, "attractions");
      searchNearby("restaurants", location, "restaurants");
      searchNearby("hotels", location, "hotels");
    });
  
    // City input
    document.getElementById("cityInput").addEventListener("change", () => {
      const city = document.getElementById("cityInput").value;
      geocodeCity(city);
    });
  }
  
  // Helper to run fallback search
  function runDefaultSearch(location) {
    map.setCenter(location);
    map.setZoom(13);
    searchNearby("tourist attractions", location, "attractions");
    searchNearby("restaurants", location, "restaurants");
    searchNearby("hotels", location, "hotels");
  }
  

// Geocode city name into coordinates
function geocodeCity(city) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: city }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(13);

      const loc = {
        lat: location.lat(),
        lng: location.lng(),
      };
      clearMarkers();
      searchNearby("tourist attractions", loc, "attractions");
      searchNearby("restaurants", loc, "restaurants");
      searchNearby("hotels", loc, "hotels");
    } else {
      alert("Could not find location: " + status);
    }
  });
}

// Search using new Places API v1 (HTTP)
async function searchNearby(query, location, elementId, radius = 2000) {
  const apiKey = "AIzaSyBpcwXrwFvLRqOc0PPMlUT7rmbrRswwPTM"; // 🔒 Replace with your actual API key

  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;

  const requestBody = {
    textQuery: query,
    locationBias: {
      circle: {
        center: {
          latitude: location.lat,
          longitude: location.lng,
        },
        radius: radius,
      },
    },
    maxResultCount: 5,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.photos",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    const list = document.getElementById(elementId);
    list.innerHTML = "";

    if (data.places && data.places.length > 0) {
      data.places.forEach((place) => {
        const name = place.displayName?.text || "Unknown Place";
        const address = place.formattedAddress || "No address";

        // Add marker to map
        const lat = place.location.latitude;
        const lng = place.location.longitude;
        const marker = new google.maps.Marker({
          map,
          position: { lat, lng },
          title: name,
        });
        markers.push(marker);

        // Append to list
        const li = document.createElement("li");
        li.textContent = `${name} – ${address}`;
        list.appendChild(li);
      });
    } else {
      console.warn(`No places found for: ${query}`);
    }
  } catch (error) {
    console.error(`❌ Error during Places API search for "${query}":`, error);
  }
}

// Clear markers and results
function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];

  ["attractions", "restaurants", "hotels"].forEach((id) => {
    const list = document.getElementById(id);
    if (list) list.innerHTML = "";
  });
}

