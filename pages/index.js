import MainLayout from '@components/ui/layout/main';
import { useState, useEffect } from 'react';
import { Map } from '@components/ui/common';
import { useTreasures } from '@components/providers/web3/hooks/useTreasures';
import { TreasureList } from '@components/ui/treasures';

export default function Home() {
  const [treasureInitContracts, setTreasureInitContracts] = useState([]);
  const [treasureContracts, setTreasureContracts] = useState([]);
  const [filters, setFilters] = useState({
    s: ''
  });
  const [position, setPosition] = useState([54.898521, 23.903597]);

  const data = useTreasures();

  useEffect(() => {
    setTreasureInitContracts(data);
    setTreasureContracts(data);
  }, [data]);

  useEffect(() => {
    let list = treasureInitContracts.filter(
      (t) =>
        t[2].toLowerCase().indexOf(filters.s.toLowerCase()) >= 0 ||
        t[0].toLowerCase().indexOf(filters.s.toLowerCase()) >= 0 ||
        t[1].toLowerCase().indexOf(filters.s.toLowerCase()) >= 0
    );
    setTreasureContracts(list);
  }, [filters, treasureInitContracts]);

  const search = (s) => {
    setFilters({ s });
  };

  const MapEffect = ({ useMap }) => {
    let map = useMap();
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom());
    });
    return null;
  };

  return (
    <>
      <section className="container flex flex-col-reverse md:flex-row gap-6 p-2 lg:pt-12 text-white">
        <div className="w-full md:w-1/3">
          <div
            className={`flex flex-col ${
              treasureInitContracts.length > 0
                ? `h-[80vh] lg:h-[75vh]`
                : `h-[60vh] lg:h-[70vh]`
            }`}
          >
            <TreasureList
              treasures={treasureContracts}
              filters={filters}
              search={search}
            />
          </div>
        </div>
        <div
          className={`w-full md:w-2/3 min-h-0 ${
            treasureInitContracts.length > 0
              ? `h-[60vh] md:h-[80vh] lg:h-[75vh]`
              : `h-[60vh] lg:h-[70vh]`
          }`}
        >
          <Map
            className="min-h-full rounded-lg z-0"
            center={position}
            zoom={14}
          >
            {({ TileLayer, Marker, Popup, useMap }, L, MarkerClusterGroup) => (
              <>
                <MapEffect useMap={useMap} />

                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <MarkerClusterGroup>
                  {treasureContracts.map(function (treasure, i) {
                    return (
                      <Marker position={[treasure[5], treasure[6]]} key={i}>
                        <Popup className="custom-popup-style">
                          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-500 text-white rounded-full">
                            {treasure[0] &&
                              treasure[0].slice(2, 6) +
                                `-` +
                                treasure[0].slice(38, 42)}
                          </span>
                          <p className="text-sm font-bold">{treasure[2]}</p>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </>
            )}
          </Map>
        </div>
      </section>
    </>
  );
}

Home.Layout = MainLayout;
