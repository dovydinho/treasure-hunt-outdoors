import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, ...rest }) => {
  useEffect(() => {
    (async function init() {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/img/marker-blue.png',
        iconUrl: '/img/marker-blue.png',
        shadowUrl: null
        // shadowUrl: "/img/leaf-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer {...rest}>
      {children(ReactLeaflet, L, MarkerClusterGroup)}
    </MapContainer>
  );
};

export default Map;
