import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  GlobeIcon,
  ViewListIcon,
  UserCircleIcon,
  FlagIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';

import { MainLayout } from '@components/ui/layouts';
import { Map } from '@components/ui/common';
import { useWeb3 } from '@components/web3';

export default function Profile() {
  const router = useRouter();
  const { web3, contract } = useWeb3();
  const [user, setUser] = useState({
    address: undefined,
    loggedAmount: 0,
    hiddenAmount: 0,
    loggedTreasureAddresses: []
  });
  const [defaultCenter, setDefaultCenter] = useState([54.898521, 23.903597]);

  useEffect(() => {
    contract &&
      (async function () {
        const userAddress = await router.query.slug;
        let usersActivity = await contract.methods.getUsersActivity().call();
        let loggedAmount = 0;
        let hiddenAmount = 0;
        let logs = [];

        for (let i = 0; i < usersActivity.length; i++) {
          let side = usersActivity[i][2];
          if (usersActivity[i][0] == userAddress) {
            usersActivity[i][2] == 0 && hiddenAmount++;
            usersActivity[i][2] == 1 && loggedAmount++;
            let date = moment.unix(usersActivity[i][3]);

            let res = await fetch('/contracts/Treasure.json');
            let Artifact = await res.json();
            let treasureContract = await new web3.eth.Contract(
              Artifact.abi,
              usersActivity[i][1]
            );
            let treasureSummary = await treasureContract.methods
              .getTreasureSummary()
              .call();

            let loggedTreasureData = [
              treasureSummary[2],
              treasureSummary[0],
              date,
              treasureSummary[5],
              treasureSummary[6],
              side
            ];
            logs.push(loggedTreasureData);
          }
        }

        logs.sort(function (a, b) {
          return b[2]._i - a[2]._i;
        });

        if (logs.length > 0) {
          setDefaultCenter([logs[0][3], logs[0][4]]);
        }

        setUser({
          address: userAddress,
          loggedAmount: loggedAmount,
          hiddenAmount: hiddenAmount,
          loggedTreasureAddresses: logs
        });
      })();
  }, [router, contract, web3]);

  const MapEffect = ({ useMap }) => {
    const markers = L.markerClusterGroup();
    const map = useMap();
    map.flyTo(defaultCenter);
    return null;
  };

  return (
    <>
      <div className="container max-w-[60rem] px-4 md:px-24 py-8 md:pt-12 lg:pt-24 text-gray-100">
        <div className="inline-flex">
          <UserCircleIcon className="w-14 h-14" />
          <div className="ml-3">
            <p className="font-bold sm:text-2xl text-xl text-violet-600">
              User Profile
            </p>
            <div className="inline-flex gap-2">
              <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-500 text-white rounded-full">
                {user.address &&
                  user.address.slice(2, 6) + `-` + user.address.slice(38, 42)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-4">
          <div className="text-violet-600 font-medium">Address</div>
          <div className="col-span-2">
            {user.address ? (
              <>
                <div className="visible md:hidden">
                  0x
                  {user.address &&
                    user.address.slice(2, 6) + `-` + user.address.slice(38, 42)}
                </div>
                <div className="hidden md:block">{user.address}</div>
              </>
            ) : (
              'undefined'
            )}
          </div>
          <div className="text-violet-600 font-medium">Logged in #</div>
          <div className="col-span-2">
            <div className="inline-flex gap-2">
              <FlagIcon className="w-5 h-5" />{' '}
              {user.loggedAmount ? user.loggedAmount : '0'}
            </div>
          </div>
          <div className="text-violet-600 font-medium">Hidden caches #</div>
          <div className="col-span-2">
            <div className="inline-flex gap-2">
              <LocationMarkerIcon className="w-5 h-5" />{' '}
              {user.hiddenAmount ? user.hiddenAmount : '0'}
            </div>
          </div>
        </div>

        {user.loggedTreasureAddresses.length > 0 ? (
          <div className="mt-12 lg:mt-16">
            <div className="inline-flex gap-2">
              <ViewListIcon className="w-7 h-7 mt-4 text-violet-600" />
              <p className="my-4 text-violet-600 text-xl font-medium">
                User Activity
              </p>
            </div>
            <div className="overflow-auto border rounded-lg border-indigo-600 max-h-[30rem]">
              {user.loggedTreasureAddresses.map(function (treasureAddress, i) {
                return (
                  <Link href={`/treasures/${treasureAddress[1]}`} key={i}>
                    <a>
                      <div
                        className={`
                            group border-b border-b-indigo-500 hover:border-indigo-500 p-5 hover:bg-gray-800
                            ${
                              treasureAddress[0] ===
                              user.loggedTreasureAddresses[
                                user.loggedTreasureAddresses.length - 1
                              ][0]
                                ? 'border-b-0'
                                : null
                            }
                        `}
                      >
                        <div className="grid grid-cols-2">
                          <p className="text-base font-bold mb-2">
                            {treasureAddress[0]}
                          </p>
                          <p className="text-right text-xs text-gray-100 invisible group-hover:visible">
                            {moment(treasureAddress[2], 'YYYYMMDD').fromNow()}
                          </p>
                        </div>
                        <p className="text-xs font-medium mb-2">
                          <span className="visible md:hidden">
                            0x
                            {treasureAddress[1] &&
                              treasureAddress[1].slice(2, 6) +
                                `-` +
                                treasureAddress[1].slice(38, 42)}
                          </span>
                          <span className="hidden md:block">
                            {treasureAddress[1]}
                          </span>
                        </p>
                        {treasureAddress[5] == '1' ? (
                          <p className="text-xs font-medium text-green-400">
                            Found
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-indigo-400">
                            Hidden
                          </p>
                        )}
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-6 lg:mt-24 mb-12 w-full h-[20rem]">
          <div className="inline-flex gap-2">
            <GlobeIcon className="w-7 h-7 mt-4 text-violet-600" />
            <p className="my-4 text-violet-600 text-xl font-medium">
              Activity Map
            </p>
          </div>

          <Map
            className="w-full min-h-full rounded-lg z-0"
            center={defaultCenter}
            zoom={14}
          >
            {({ TileLayer, Marker, Popup, useMap }, L, MarkerClusterGroup) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEffect useMap={useMap} />
                <MarkerClusterGroup>
                  {user.loggedTreasureAddresses.map(function (treasure, i) {
                    return (
                      <Marker position={[treasure[3], treasure[4]]} key={i}>
                        <Popup className="custom-popup-style">
                          <p className="text-sm font-bold">{treasure[0]}</p>
                          {treasure[5] == '1' ? (
                            <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-500 text-white rounded-full">
                              Located
                            </span>
                          ) : (
                            <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-yellow-500 text-white rounded-full">
                              Hidden
                            </span>
                          )}
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </>
            )}
          </Map>
        </div>
      </div>
    </>
  );
}

Profile.Layout = MainLayout;
