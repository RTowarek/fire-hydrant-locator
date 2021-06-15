export function fetchClusterExpansionZoom(clusterId, center) {
  return fetch('/api/clusterExpansionZoom', {
    method: 'POST',
    body: JSON.stringify({
      clusterId,
      center,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

export function fetchClusters(bbox, zoom) {
  return fetch('/api/clusters', {
    method: 'POST',
    body: JSON.stringify({
      bbox,
      zoom,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
