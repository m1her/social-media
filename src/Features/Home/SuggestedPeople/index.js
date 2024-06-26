"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { db } from "@/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const SuggestedPeople = ({
  currentUserName,
  currentUserId,
  currentUserImg,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [following, setfollowing] = useState([]);
  useEffect(() => {
    getDoc(doc(db, "users", currentUserId)).then((doc) =>
      setfollowing((prev) => [...prev, ...doc.data().following])
    );
  }, []);

  const fetchRandomUsers = async () => {
    try {
      const usersRef = getDocs(collection(db, "users")).then(
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          newData.map((user) => {
            if (suggestions.length <= 4) {
              setSuggestions((prev) => [
                ...prev,
                {
                  userName: user.name,
                  userImage: user.profileImg,
                  userId: user.id,
                  // isfollowng: user.id == currentUserId
                },
              ]);
            } else {
            }
          });
        }
      );
    } catch (error) {
      console.error("Error fetching random users:", error);
    }
  };
  useEffect(() => {
    fetchRandomUsers();
  }, []);

  const follow = (name, image, id) => {
    if (following.some((follows) => follows.userId == id)) {
      getDoc(doc(db, "users", currentUserId)).then((docs) => {
        const updatedFollowing = docs
          .data()
          .following.filter((user) => user.userId !== id);

        updateDoc(doc(db, "users", currentUserId), {
          following: updatedFollowing,
        });
      });

      getDoc(doc(db, "users", id)).then((docs) => {
        const updatedFollowers = docs
          .data()
          .followers.filter((follower) => follower.userId !== currentUserId);

        updateDoc(doc(db, "users", id), {
          followers: updatedFollowers,
        });
      });
      const updatedFollowing = following.filter(
        (follows) => follows.userId !== id
      );
      setfollowing(updatedFollowing);
    } else {
      getDoc(doc(db, "users", currentUserId)).then((docs) => {
        updateDoc(doc(db, "users", currentUserId), {
          following: [
            ...docs.data().following,
            {
              userName: name,
              userImage: image,
              userId: id,
            },
          ],
        });
        setfollowing((prev) => [
          ...prev,
          { userName: name, userImage: image, userId: id },
        ]);
      });

      getDoc(doc(db, "users", id)).then((docs) => {
        updateDoc(doc(db, "users", id), {
          followers: [
            ...docs.data().followers,
            {
              userName: currentUserName,
              userImage: currentUserImg,
              userId: currentUserId,
            },
          ],
        });
      });
    }
  };

  return (
    <div className="col-3 mobile-hidden">
      <div className="main-block">
        <div className="row">
          <div className="col pl-4">
            <div className="text-sm font-sans font-bold text-gray-600 px-2 mb-2">
              People you may know
            </div>
          </div>
        </div>
        {suggestions.length > 0 &&
          suggestions
            .filter((user) => user.userName !== currentUserName)
            .map((user, index) => (
              <div
                className="flex items-center justify-between px-2 py-2.5 border-t"
                key={index}
              >
                <div className="flex items-center">
                  <div className="mr-6">
                    <div className="">
                      <Image
                        alt="IMG"
                        width={100}
                        height={100}
                        className="rounded-full h-10 w-10 border-[1px] border-[#8B54C7] object-cover object-top"
                        src={user.userImage}
                      ></Image>
                    </div>
                  </div>
                  <Link
                    href={`profile?id=${user.userId}`}
                    className="font-bold no-underline text-gray-500 mr-2"
                  >
                    {user.userName}
                  </Link>
                </div>
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full p-1 cursor-pointer text-white bg-gradient-to-br from-[#c850c0] to-[#4158d0]"
                  onClick={() =>
                    follow(user.userName, user.userImage, user.userId)
                  }
                >
                  {following.some(
                    (follows) => follows.userId == user.userId
                  ) ? (
                    <FontAwesomeIcon icon={faCheck} width={14} height={14} />
                  ) : (
                    <FontAwesomeIcon icon={faUserPlus} width={14} height={14} />
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
export default SuggestedPeople;
