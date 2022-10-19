import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/common';
import classNames from 'classnames';
import { PlusCircleIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { useWeb3 } from '@components/web3';

export default function Navbar() {
  const { connect, isLoading, hooks } = useWeb3();
  const account = hooks.useAccount();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.code === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

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
          <div className="flex lg:order-2 relative">
            {isLoading ? (
              <Button disabled>
                <div className="animate-spin w-6 h-6 border-b-2 border-gray-100 rounded-full mr-2" />
                Loading...
              </Button>
            ) : account.data ? (
              <Link href={`/community/${account.data}`}>
                <a>
                  <Button>
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
            ) : (
              <Button
                onClick={connect}
                className="hover:text-gray-900 hover:bg-gray-100"
              >
                Connect
              </Button>
            )}
            <div className="flex ml-2 p-2 lg:hidden">
              <MenuIcon
                className="w-6 h-6 hover:cursor-pointer hover:opacity-80 transition-all"
                onClick={() => {
                  setOpen(true);
                }}
              />
            </div>
          </div>
          {open && (
            <div className="flex fixed z-10 uppercase left-0 top-0 bottom-0 w-full bg-gray-900/95 justify-center items-center">
              <XIcon
                className="absolute top-4 right-9 w-8 h-8 hover:cursor-pointer hover:opacity-80 transition-all"
                onClick={() => {
                  setOpen(false);
                }}
              />
              <div className="text-xl">
                <NavItem
                  href="/"
                  text="Treasures"
                  onClick={() => {
                    setOpen(false);
                  }}
                />
                <NavItem
                  href="/community"
                  text="Community"
                  onClick={() => {
                    setOpen(false);
                  }}
                />
                <NavItem
                  href="/hide"
                  text={
                    <>
                      <PlusCircleIcon className="w-6 h-6 mr-1" />
                      New Cache
                    </>
                  }
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          )}
          <div
            className={`${
              !open && 'hidden'
            } justify-between items-center w-full lg:flex lg:w-auto`}
          >
            <div
              className="flex flex-col mt-4 lg:flex-row lg:space-x-8 lg:mt-0 uppercase"
              onClick={() => setOpen(false)}
            >
              <NavItem href="/" text="Treasures" />
              <NavItem href="/community" text="Community" />
              <NavItem
                href="/hide"
                text={
                  <>
                    <PlusCircleIcon className="w-6 h-6 mr-1" />
                    New Cache
                  </>
                }
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

const NavItem = ({ href, text, ...rest }) => {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <Link href={href}>
      <a
        {...rest}
        className={classNames(
          isActive ? 'font-bold text-gray-100' : 'text-gray-300',
          'p-2 my-auto hover:bg-gray-100/5 rounded-lg flex m-1'
        )}
      >
        {text}
      </a>
    </Link>
  );
};
