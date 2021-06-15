const got = require('got');
const fs = require('fs').promises;

(async () => {
  try {
    console.log('Fetching OSM data. Please wait.');

    const response = await got('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      responseType: 'json',
      timeout: 1000 * 60 * 10,
      form: {
        data: '[out:json][timeout:1000];area(3600049715)->.searchArea;(node["emergency"="fire_hydrant"](area.searchArea););out;>;out skel qt;',
      },
    });

    const data = {
      type: 'FeatureCollection',
      features: response.body.elements.map((el) => ({
        type: 'Feature',
        properties: {
          ...el.tags,
        },
        geometry: {
          type: 'Point',
          coordinates: [el.lon, el.lat],
        },
      })),
    };

    await fs.writeFile('data/hydrants.json', JSON.stringify(data, null, 4));
  } catch (error) {
    console.error(error);
  }
})();
