import MainLayout from '@components/ui/layout/main';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Map } from '@components/ui/common';
import { Button } from '@components/ui/common';
import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/hooks/web3';
import {
  EmojiHappyIcon,
  ViewGridAddIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';

export default function Hide() {
  const { contract } = useWeb3();
  const { account } = useAccount();
  const DEFAULT_CENTER = [54.898521, 23.903597];
  const [newLocation, setNewLocation] = useState([0, 0]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [map, setMap] = useState();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [hint, setHint] = useState('');

  const handleTitleChange = () => {
    setTitle(event.target.value);
  };
  const handleHintChange = () => {
    setHint(event.target.value);
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
      <div className="container max-w-[60rem] px-4 md:px-24 py-24 text-gray-100">
        <div className="inline-flex gap-3">
          <ViewGridAddIcon className="w-8 h-8" />
          <p className="font-bold text-xl md:text-2xl text-violet-600">
            Hide a Cache
          </p>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-4">
          <div className="text-violet-600 font-medium">Title</div>
          <div className="col-span-3 md:col-span-2">
            <input
              className="w-full rounded-xl bg-transparent border border-dashed border-indigo-600 mb-5 px-8 py-2 focus:outline-none placeholder:text-sm placeholder:text-indigo-600 text-gray-100"
              placeholder="Give cache a name..."
              name="title"
              onChange={handleTitleChange}
            />
          </div>
          <div className="text-violet-600 font-medium">Hint</div>
          <div className="col-span-3 md:col-span-2">
            <textarea
              className="w-full rounded-xl bg-transparent border border-dashed border-indigo-600 mb-5 px-8 py-2 focus:outline-none placeholder:text-sm placeholder:text-indigo-600 text-gray-100"
              placeholder="Hidden in a van down by the river..."
              name="hint"
              onChange={handleHintChange}
            />
          </div>

          <div className="col-span-3">
            <div className="w-full h-[20rem] mb-12">
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

          <div className=" my-6">
            <Button
              onClick={createTreasure}
              className="
                            rounded-full border border-indigo-600
                            text-indigo-500 hover:text-gray-100
                            px-8 py-2 inline-flex
                            hover:bg-indigo-500"
            >
              {buttonLoading == false ? (
                <>
                  Create <EmojiHappyIcon className="ml-1 w-6 h-6" />
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
      </div>
    </>
  );
}

Hide.Layout = MainLayout;
