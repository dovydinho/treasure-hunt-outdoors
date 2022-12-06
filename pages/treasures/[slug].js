import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  EmojiHappyIcon,
  FlagIcon,
  GlobeIcon,
  MapIcon,
  ViewListIcon
} from '@heroicons/react/outline';

import { MainLayout } from '@components/ui/layouts';
import { LoadingButton, Map } from '@components/ui/common';
import { Button } from '@components/ui/common';
import { useWeb3 } from '@components/web3';

export default function Treasure() {
  const router = useRouter();
  const { web3, hooks } = useWeb3();
  const account = hooks.useAccount();
  const [treasureContract, setTreasureContract] = useState();
  const [treasureData, setTreasureData] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [location, setLocation] = useState([54, 24]);

  const DEFAULT_CENTER = [54.898521, 23.903597];

  useEffect(() => {
    web3 &&
      (async function () {
        let res = await fetch('/contracts/Treasure.json');
        let Artifact = await res.json();
        let treasureContractInstance = await new web3.eth.Contract(
          Artifact.abi,
          router.query.slug
        );
        let callGetSummary = await treasureContractInstance.methods
          .getTreasureSummary()
          .call();
        setTreasureContract(treasureContractInstance);
        setTreasureData(callGetSummary);
        setLocation([callGetSummary[5], callGetSummary[6]]);
      })();
  }, [web3, router.query.slug]);

  const locateTreasure = async () => {
    setButtonLoading(true);
    try {
      await treasureContract.methods
        .locateTreasure()
        .send({ from: account.data });
      setButtonLoading(false);
      router.reload(window.location.pathname);
    } catch (e) {
      setButtonLoading(false);
      console.log('Operation failed.');
    }
  };

  const MapEffect = ({ useMap }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(location);
    }, [map]);
    return null;
  };

  return (
    <>
      <div className="container max-w-[60rem] px-4 md:px-24 py-8 md:pt-12 lg:pt-24 text-gray-100">
        <div className="inline-flex">
          <MapIcon className="w-14 h-14" />
          <div className="ml-3">
            <p className="font-bold sm:text-2xl text-xl text-violet-600">
              {treasureData[2]}
            </p>
            <div className="inline-flex gap-2">
              <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-500 text-white rounded-full">
                {treasureData[0] &&
                  treasureData[0].slice(2, 6) +
                    `-` +
                    treasureData[0].slice(38, 42)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-4">
          <div className="text-violet-600 font-medium">Address</div>
          <div className="col-span-2">
            <div className="visible md:hidden">
              0x
              {treasureData[0] &&
                treasureData[0].slice(2, 6) +
                  `-` +
                  treasureData[0].slice(38, 42)}
            </div>
            <div className="hidden md:block">{treasureData[0]}</div>
          </div>
          <div className="text-violet-600 font-medium">Owner</div>
          <div className="col-span-2">
            <Link href={`/community/${treasureData[1]}`}>
              <a className="hover:underline decoration-dashed">
                <div className="visible md:hidden">
                  0x
                  {treasureData[1] &&
                    treasureData[1].slice(2, 6) +
                      `-` +
                      treasureData[1].slice(38, 42)}
                </div>
                <div className="hidden md:block">{treasureData[1]}</div>
              </a>
            </Link>
          </div>
          <div className="text-violet-600 font-medium">Logged in #</div>
          <div className="col-span-2">
            <div className="inline-flex gap-2">
              <FlagIcon className="w-5 h-5" /> {treasureData[7]}
            </div>
          </div>
          <div className="text-violet-600 font-medium">Hint</div>
          <div className="col-span-2">{treasureData[3]}</div>
          <div className="text-violet-600 font-medium">Lat and Long</div>
          <div className="col-span-2 text-gray-500">
            {treasureData[5] + `, ` + treasureData[6]}
          </div>
        </div>

        <div className="mt-6 lg:mt-24 mb-12 w-full h-[20rem]">
          <div className="inline-flex gap-2">
            <GlobeIcon className="w-7 h-7 text-violet-600" />
            <p className="mb-4 text-violet-600 text-xl font-medium">
              Location on Map
            </p>
          </div>

          <Map
            className="w-full min-h-full rounded-lg"
            center={DEFAULT_CENTER}
            zoom={17}
          >
            {({ TileLayer, Marker, Popup, useMap }) => (
              <>
                <MapEffect useMap={useMap} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker position={location}>
                  <Popup className="custom-popup-style">
                    {treasureData[2]}
                  </Popup>
                </Marker>
              </>
            )}
          </Map>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-4 mb-12 lg:mb-24">
          <div className="col-span-3">
            <div className="inline-flex gap-2">
              <FlagIcon className="w-7 h-7 text-violet-600" />
              <p className="mb-4 text-violet-600 text-xl font-medium">
                Found the Cache?
              </p>
            </div>
            <br />
            {!account.data ? (
              <p className="text-gray-100">
                You need to be connected to log it!
              </p>
            ) : buttonLoading == false ? (
              <Button onClick={locateTreasure} className="group uppercase">
                Log it <EmojiHappyIcon className="ml-1 w-6 h-6" />
              </Button>
            ) : (
              <LoadingButton className="uppercase">Loading...</LoadingButton>
            )}
          </div>
        </div>

        {treasureData[8] && treasureData[8].length > 0 && (
          <>
            <div className="inline-flex gap-2">
              <ViewListIcon className="w-7 h-7 text-violet-600" />
              <p className="text-violet-600 text-xl font-medium">
                Latest Community Logs
              </p>
            </div>
            <div className="overflow-auto border rounded-lg border-indigo-600 mt-4 max-h-[22rem]">
              {treasureData[8]
                .slice(0)
                .reverse()
                .map(function (finder, i) {
                  return (
                    <Link href={`/community/${finder[0]}`} key={i}>
                      <a>
                        <div
                          className={`
                                            group border-b border-b-indigo-500 hover:border-indigo-500 p-5 hover:bg-gray-800
                                            ${
                                              finder[0] ===
                                              treasureData[8]
                                                .slice(0)
                                                .reverse()[
                                                treasureData[8].length - 1
                                              ][0]
                                                ? 'border-b-0'
                                                : null
                                            }
                                            `}
                        >
                          <p className="text-right text-xs text-gray-100">
                            Located{' '}
                            {moment(
                              moment.unix(finder[1]),
                              'YYYYMMDD'
                            ).fromNow()}
                          </p>
                          <p className="text-base font-medium mb-2">
                            <span className="visible md:hidden">
                              0x
                              {finder[0] &&
                                finder[0].slice(2, 6) +
                                  `-` +
                                  finder[0].slice(38, 42)}
                            </span>
                            <span className="hidden md:block">{finder[0]}</span>
                          </p>
                          <div className="grid grid-cols-2">
                            <p className="text-xs font-medium text-green-600">
                              Found
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

Treasure.Layout = MainLayout;
