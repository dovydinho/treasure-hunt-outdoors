import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MainLayout } from '@components/ui/layouts';
import { Button } from '@components/ui/common';
import {
  EmojiHappyIcon,
  ViewGridAddIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';
import { Map } from '@components/ui/common';
import { useWeb3 } from '@components/web3';

export default function Hide() {
  const { contract, hooks } = useWeb3();
  const account = hooks.useAccount();
  const DEFAULT_CENTER = [54.898521, 23.903597];
  const [newLocation, setNewLocation] = useState([0, 0]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [map, setMap] = useState();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [hint, setHint] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleHintChange = (e) => {
    setHint(e.target.value);
  };

  const createTreasure = async () => {
    setButtonLoading(true);
    try {
      await contract.methods
        .createTreasure(
          title,
          hint,
          newLocation[0].toString(),
          newLocation[1].toString()
        )
        .send({ from: account.data });
      setButtonLoading(false);
      setTimeout(() => router.push('/'), 0);
    } catch (e) {
      setButtonLoading(false);
      console.log('Operation failed.');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createTreasure();
  };

  const MapEffect = ({ useMap }) => {
    let data = useMap();
    setTimeout(() => setMap(data), 0);
    return null;
  };

  useEffect(() => {
    {
      map &&
        map.on('click', onMapClick) &
          map.locate().on('locationfound', function (e) {
            map.flyTo(e.latlng, map.getZoom());
          });
    }
  }, [map]);

  const onMapClick = (e) => {
    setNewLocation([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <>
      <div className="container max-w-[60rem] px-4 md:px-24 py-8 md:py-12 lg:py-24 text-gray-100">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="inline-flex gap-3">
            <ViewGridAddIcon className="w-8 h-8" />
            <p className="font-bold text-xl md:text-2xl text-violet-600">
              Hide a Cache
            </p>
          </div>

          <div className="mt-4 sm:mt-6 lg:mt-12 grid grid-cols-3 gap-4">
            <div className="text-violet-600 font-medium">Title</div>
            <div className="col-span-3 md:col-span-2">
              <input
                required
                className="w-full rounded-xl bg-transparent border border-dashed border-indigo-600 mb-5 px-8 py-2 focus:outline-none placeholder:text-sm placeholder:text-indigo-600 text-gray-100"
                placeholder="Give cache a name..."
                name="title"
                onChange={handleTitleChange}
              />
            </div>
            <div className="text-violet-600 font-medium">Hint</div>
            <div className="col-span-3 md:col-span-2">
              <textarea
                required
                className="w-full rounded-xl bg-transparent border border-dashed border-indigo-600 mb-5 px-8 py-2 focus:outline-none placeholder:text-sm placeholder:text-indigo-600 text-gray-100"
                placeholder="Hidden in a van down by the river..."
                name="hint"
                onChange={handleHintChange}
              />
            </div>

            <div className="col-span-3">
              <div className="mt-4 sm:mt-6 lg:mt-12 mb-12 w-full h-[20rem]">
                <div className="inline-flex">
                  <LocationMarkerIcon className="w-7 h-7 mt-4 text-violet-600" />
                  <p className="ml-2 my-4 text-violet-600 text-xl font-medium">
                    Mark it on the Map
                  </p>
                </div>
                <Map
                  className="w-full min-h-full rounded-lg"
                  center={DEFAULT_CENTER}
                  zoom={13}
                >
                  {({ TileLayer, Marker, useMap }) => (
                    <>
                      <MapEffect useMap={useMap} />

                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />

                      <Marker position={newLocation} />
                    </>
                  )}
                </Map>
              </div>
            </div>
            <div className="my-4 text-violet-600 font-medium">Lat and Long</div>
            <div className="my-4 col-span-2 text-gray-500">
              {newLocation[0]}, {newLocation[1]}
            </div>

            <div className="sm:my-6">
              <Button type="submit">
                {buttonLoading == false ? (
                  <>
                    Create <EmojiHappyIcon className="w-6 h-6" />
                  </>
                ) : (
                  <>
                    <div className="animate-spin w-6 h-6 border-b-2 border-gray-100 rounded-full mr-2" />{' '}
                    Creating...
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

Hide.Layout = MainLayout;
