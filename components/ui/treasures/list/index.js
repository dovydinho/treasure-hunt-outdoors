import { TreasureListBlank } from '@components/ui/treasures';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FlagIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search } from '@components/ui/common';

export default function TreasureList({ treasures, search }) {
  const [displayPosts, setDisplayPosts] = useState([]);
  const [slice, setSlice] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setSlice(10);

    setDisplayPosts(
      treasures.slice(0, slice).map(function (treasure, i) {
        return (
          <Link href={`/treasures/${treasure[0]}`} key={i}>
            <a>
              <div
                className={`
                                flex text-indigo-600 items-center p-4 border-b border-b-indigo-500 hover:bg-gray-800 transition-all
                                ${
                                  treasure[0] ==
                                  treasures[treasures.length - 1][0]
                                    ? 'border-b-0'
                                    : null
                                }
                                `}
              >
                <div className="flex-grow text-left text-gray-300">
                  <h2 className="text-sm font-bold">{treasure[2]}</h2>
                  <span className="inline-flex text-xs font-medium">
                    <FlagIcon className="h-4 w-4 mr-1 mt-1" />
                    <p
                      className={`mt-1 mb-2 ${
                        treasure[7] == 0 ? 'text-gray-400' : null
                      }`}
                    >
                      {treasure[7] == 0
                        ? 'Yet to be located'
                        : treasure[7] == 1
                        ? `Located 1 time`
                        : `Located ${treasure[7]} times`}
                    </p>
                  </span>
                  <h2 className="text-xs text-indigo-600">{treasure[0]}</h2>
                </div>
              </div>
            </a>
          </Link>
        );
      })
    );

    setHasMore(true);
  }, [treasures, slice]);

  const addSlice = () => {
    setDisplayPosts([...displayPosts, ...nextSlice()]);

    setSlice(slice + 3);
    if (slice >= treasures.length) setHasMore(false);
  };

  const nextSlice = () => {
    return treasures.slice(slice, slice + 3).map(function (treasure, i) {
      return (
        <Link href={`/treasures/${treasure[0]}`} key={i}>
          <a>
            <div className="flex text-indigo-600 items-center p-4 border-b border-b-indigo-500 hover:bg-gray-800">
              <div className="flex-grow text-left text-gray-300">
                <h2 className="text-sm text-gray-500">
                  {treasure[0].slice(2, 6) + `-` + treasure[0].slice(38, 42)}
                </h2>
                <h2 className="text-sm font-medium">{treasure[2]}</h2>
                <span className="inline-flex text-indigo-500 text-xs font-medium">
                  <FlagIcon className="h-4 w-4 mr-1" />
                  <p>{treasure[7]}</p>
                </span>
              </div>
            </div>
          </a>
        </Link>
      );
    });
  };

  return (
    <>
      <Search search={search} />
      <div
        id="scrollableDiv"
        className="overflow-auto border rounded-lg border-indigo-600"
      >
        <InfiniteScroll
          dataLength={displayPosts.length}
          next={addSlice}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
        >
          {displayPosts}
        </InfiniteScroll>
        {displayPosts.length == 0 && <TreasureListBlank />}
      </div>
    </>
  );
}
