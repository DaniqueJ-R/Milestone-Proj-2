
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const userLocation = { lat: 51.406, lng: 0.013 }; // example location (can be dynamic)
  map = new Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14,
  });

//   searchNearby("hotels", userLocation);
  searchNearby("restaurants", userLocation);
//   searchNearby("attractions", userLocation);
}

async function searchNearby(query, location, radius = 1500) {
  try {
    const { Place } = await google.maps.importLibrary("places");

    const place = new Place();

    const request = {
      textQuery: query,
      locationBias: {
        center: location,
        radius: radius,
      },
      fields: ["displayName", "location", "formattedAddress", "photos"],
    };

    const { places } = await place.searchByText(request);

    if (!places || places.length === 0) {
      console.warn(`No places found for ${query}`);
      return;
    }

    places.forEach((place) => {
      const position = place.location;

      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: place.displayName || "Unknown",
      });

      const content = `
        <div>
          <strong>${place.displayName}</strong><br />
          ${place.formattedAddress || ""}
          ${place.photos?.[0] ? `<br /><img src="${place.photos[0].getURL()}" width="100" />` : ""}
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: content,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
    });
  } catch (error) {
    console.error("Error during nearby search:", error);
  }
}
