import { fetchClusterExpansionZoom, fetchClusters } from './network.js';

function main() {
  const attributionHtml = `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`;
  const geocoder = L.Control.Geocoder.photon({
    bbox: [14.0745211117, 49.0273953314, 24.0299857927, 54.8515359564],
  });
  let map;

  async function updateMarkers() {
    const bounds = map.getBounds();

    const clusters = await fetchClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      map.getZoom(),
    );

    markers.clearLayers();
    markers.addData(clusters);
  }

  function onMarkerClick(e) {
    const clusterId =
      e.layer.feature.properties && e.layer.feature.properties.cluster_id;

    if (clusterId) {
      fetchClusterExpansionZoom(clusterId, e.latlng).then(({ zoomLevel }) => {
        map.flyTo(e.latlng, zoomLevel);
      });
    }
  }

  function onGeocode(e) {
    const bbox = e.geocode.bbox;
    const poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest(),
    ]);
    map.fitBounds(poly.getBounds());
  }

  map = L.map('map', {
    preferCanvas: true,
    minZoom: 7,
    maxBounds: L.latLngBounds([56.25, 10.5], [46.5, 27.25]),
    maxBoundsViscosity: 0.25,
  });
  map.on('load', updateMarkers);
  map.on('moveend', updateMarkers);
  map.setView([51.9194, 19.1451], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: attributionHtml,
  }).addTo(map);

  L.Control.geocoder({
    geocoder,
    placeholder: 'Search address here...',
    defaultMarkGeocode: false,
  })
    .on('markgeocode', onGeocode)
    .addTo(map);

  const markers = L.geoJson(null, { pointToLayer: createClusterIcon }).addTo(
    map,
  );
  markers.on('click', onMarkerClick);
  map.addLayer(markers);
}

function createClusterIcon(feature, latlng) {
  if (!feature.properties || !feature.properties.cluster)
    return L.marker(latlng).bindPopup(
      `<b>Type:&nbsp;</b>${feature.properties.type || '-'}<br>
       <b>Diameter:&nbsp;</b>${feature.properties.diameter || '-'}<br>
       <b>Position:&nbsp;</b>${feature.properties.position || '-'}<br>`,
    );

  const count = feature.properties.point_count;
  const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
  const icon = L.divIcon({
    html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(40, 40),
  });

  return L.marker(latlng, { icon });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
