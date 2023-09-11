import { faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const User = ({ name, userImg, id, following, follow, currentUserId }) => {
  return (
    <div className="flex items-center justify-between px-2 py-2.5 border-b w-full">
      <div className="flex items-center">
        <div className="mr-6 ">
          <Image
            alt="IMG"
            width={100}
            height={100}
            className="rounded-full w-16 h-16 border-[1px] border-[#8B54C7] object-cover object-top"
            src={userImg}
          ></Image>
        </div>
        <Link href={`profile?id=${id}`} className="font-bold no-underline text-gray-500">
          {name}
        </Link>
      </div>
      {currentUserId == id ? (
        ""
      ) : (
        <button
          className="flex items-center text-white bg-gradient-to-br from-[#c850c0] to-[#4158d0] hover:bg-gradient-to-br hover:from-[#973290] hover:to-[#243794] px-2 py-1 rounded-full"
          onClick={() => follow(name, userImg, id)}
        >
          {following.some((follows) => follows.userId == id) ? (
            <div className="flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheck}
                width={15}
                height={15}
                className="text-white mr-1 w-4 h-4"
              />
              Following
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUserPlus}
                width={15}
                height={15}
                className="text-white mr-1 w-4 h-4"
              />
              Follow
            </div>
          )}
        </button>
      )}
    </div>
  );
};
export default User;
