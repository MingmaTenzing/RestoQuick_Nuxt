export default defineEventHandler(async (event) => {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const body = {
    textQuery: "Urgent Care Clinic",
    locationBias: {
      circle: {
        center: { latitude: -31.90024, longitude: 115.9048 },
        radius: 10000.0, // 10km search area
      },
    },
    maxResultCount: 10,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": "AIzaSyD_2f_S7x_5d21uLwuq1fpNHgIxDWi3ScI",
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.location,places.regularOpeningHours,places.nationalPhoneNumber",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data.places;
});
