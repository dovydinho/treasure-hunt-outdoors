import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@components/ui/common';
import {
  PlusCircleIcon,
  ArrowCircleDownIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';
import { useWeb3 } from '@components/web3';

export default function Navbar() {
  const { connect, isLoading, requireInstall, hooks } = useWeb3();
  const account = hooks.useAccount();
  const network = hooks.useNetwork();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="pt-2 lg:pt-6 lg:pb-2 font-medium text-white">
        <div className="flex flex-wrap justify-between items-center mx-auto px-8">
          <Link href="/">
            <a className="flex items-center gap-2">
              <Image
                src="/img/avatar.jpg"
                width="50px"
                height="50px"
                className="rounded-full w-10 h-10"
                alt=""
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap hidden md:block">
                Treasure Hunt Outdoors
              </span>
            </a>
          </Link>
          <div className="flex lg:order-2">
            {isLoading ? (
              <Button
                disabled
                onClick={connect}
                className="bg-gray-800 inline-flex"
              >
                <div className="animate-spin w-6 h-6 border-b-2 border-gray-100 rounded-full mr-2" />
                Loading...
              </Button>
            ) : account.data ? (
              <Link href={`/community/${account.data}`}>
                <a>
                  <Button className="hover:text-gray-900 hover:bg-gray-100 font-bold inline-flex gap-2">
                    <Image
                      src="/img/avatarZoom.jpg"
                      width="25px"
                      height="25px"
                      className="rounded-full"
                      alt=""
                    />
                    {account.data.slice(2, 6) +
                      `-` +
                      account.data.slice(38, 42)}
                  </Button>
                </a>
              </Link>
            ) : requireInstall ? (
              <Button
                onClick={() =>
                  window.open('https://metamask.io/download.html', '_blank')
                }
                className="hover:text-gray-900 hover:bg-gray-100 bg-red-500 text-gray-100 inline-flex text-sm sm:text-base pb-1 sm:py-2"
              >
                <div className="animate-bounce mr-2">
                  <ArrowCircleDownIcon className="w-6 h-6 mx-auto" />
                </div>
                Install Metamask
              </Button>
            ) : (
              <Button
                onClick={connect}
                className="hover:text-gray-900 hover:bg-gray-100"
              >
                Connect
              </Button>
            )}
            <div className="flex ml-2 p-2 lg:hidden">
              {open ? (
                <XIcon
                  className="w-6 h-6 hover:cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              ) : (
                <MenuIcon
                  className="w-6 h-6 hover:cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              )}
            </div>
          </div>
          <div
            className={`${
              open === false && 'hidden'
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
          >
            <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-8 lg:mt-0 lg:text-base lg:font-medium">
              <li>
                <Link href="/">
                  <a className="block py-4 pr-4 pl-3 text-gray-300 border-b border-gray-600 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-500 lg:p-0 lg:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                    Treasures
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <a className="block py-4 pr-4 pl-3 text-gray-300 border-b border-gray-600 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-500 lg:p-0 lg:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                    Community
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/hide">
                  <a className="block py-4 pr-4 pl-3 text-gray-300 border-b border-gray-600 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-500 lg:p-0 lg:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 flex">
                    <PlusCircleIcon className="w-6 h-6 mr-1" />
                    Hide a Cache
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {requireInstall && (
        <div className="animate-pulse w-80 sm:w-96 rounded-lg mx-auto p-4 mt-2 bg-purple-500 text-gray-100 text-center text-sm">
          Cannot connect to network. Please install Metamask.
        </div>
      )}

      {network.hasInitialResponse && !network.isSupported && account.data && (
        <div className="animate-pulse w-96 rounded-lg mx-auto p-4 bg-red-600 text-gray-100 text-center text-sm">
          <div>Connected to wrong network</div>
          <div>
            Please connect to: {` `}
            <span className="font-bold text-xl">{network.target}</span>
          </div>
        </div>
      )}
    </>
  );
}
