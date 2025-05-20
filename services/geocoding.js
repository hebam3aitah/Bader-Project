import axios from 'axios';

export async function geocodeLocation(location) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    
    if (response.data && response.data.length > 0) {
      return {
        type: 'Point',
        coordinates: [
          parseFloat(response.data[0].lon),
          parseFloat(response.data[0].lat)
        ]
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}