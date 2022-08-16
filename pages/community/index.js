import { LocationMarkerIcon, FlagIcon } from '@heroicons/react/outline';
import { CommunityBlank } from '@components/ui/community';
import { useWeb3 } from '@components/providers';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@components/ui/layout/main';

export default function Community() {
  const users = [];
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [usersActivity, setUsersActivity] = useState([]);
  const [collection, setCollection] = useState([]);
  const { contract } = useWeb3();

  useEffect(() => {
    contract &&
      (async function () {
        let getUsersActivity = await contract.methods.getUsersActivity().call();
        setUsersActivity(getUsersActivity);
        for (let i = 0; i < getUsersActivity.length; i++) {
          let userAddress = getUsersActivity[i][0];
          users.push(userAddress);
        }
        setUniqueUsers([...new Set(users)]);
      })();
  }, [contract]);

  useEffect(() => {
    let dataArray = [];

    for (let j = 0; j < uniqueUsers.length; j++) {
      let loggedAmount = 0;
      let hiddenAmount = 0;

      let uniqueAddress = uniqueUsers[j];
      for (let k = 0; k < usersActivity.length; k++) {
        if (uniqueAddress == usersActivity[k][0]) {
          usersActivity[k][2] == 0 && hiddenAmount++;
          usersActivity[k][2] == 1 && loggedAmount++;
        }
      }
      dataArray.push([uniqueAddress, loggedAmount, hiddenAmount]);
    }
    setCollection(dataArray);
  }, [uniqueUsers]);

  return (
    <>
      <div className="container px-6 py-24 text-gray-100">
        <p className="font-bold text-xl md:text-2xl text-violet-600">
          Community Profiles
        </p>
        <div className="my-12 grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-8">
          {uniqueUsers.length == 0 && <CommunityBlank />}

          {collection.map(function (user, i) {
            return (
              <Link href={`/community/${user[0]}`} key={i}>
                <a className="group">
                  <div className="p-5 content-center text-center rounded-lg group-hover:bg-gray-800">
                    <Image
                      src="/img/avatarZoom.jpg"
                      width="75px"
                      height="75px"
                      className="rounded-full"
                    />
                    <p className="mt-3 font-bold">
                      {user[0].slice(2, 6)} - {user[0].slice(38, 42)}
                    </p>
                    <p className="inline-flex gap-1 pt-1">
                      <FlagIcon className="w-6 h-6 text-green-600" />
                      {user[1]}
                      <LocationMarkerIcon className="w-6 h-6 text-indigo-600 ml-1" />
                      {user[2]}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

Community.Layout = MainLayout;
