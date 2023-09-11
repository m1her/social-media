"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { db } from "@/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import User from "./User";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

const SearchPeople = () => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [following, setfollowing] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("TrainingUser"))
  );
  const searchTerm = useSelector((state) => state.search.term);

  useEffect(() => {
    getDoc(doc(db, "users", user[0]?.id)).then((doc) =>
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
          setLoading(false);
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
      getDoc(doc(db, "users", user[0]?.id)).then((docs) => {
        const updatedFollowing = docs
          .data()
          .following.filter((user) => user.userId !== id);

        updateDoc(doc(db, "users", user[0]?.id), {
          following: updatedFollowing,
        });
      });

      getDoc(doc(db, "users", id)).then((docs) => {
        const updatedFollowers = docs
          .data()
          .followers.filter((follower) => follower.userId !== user[0]?.id);

        updateDoc(doc(db, "users", id), {
          followers: updatedFollowers,
        });
      });
      const updatedFollowing = following.filter(
        (follows) => follows.userId !== id
      );
      setfollowing(updatedFollowing);
    } else {
      getDoc(doc(db, "users", user[0].id)).then((docs) => {
        console.log(docs.data().following);
        updateDoc(doc(db, "users", user[0]?.id), {
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
        console.log(docs.data().following);
        updateDoc(doc(db, "users", id), {
          followers: [
            ...docs.data().followers,
            {
              userName: user[0]?.name,
              userImage: user[0]?.profileImg,
              userId: user[0]?.id,
            },
          ],
        });
      });
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="w-full flex justify-center my-4">
          <Spinner color="fill-blue-700" size="w-8 h-8" />
        </div>
      ) : (
        suggestions.length > 0 &&
        suggestions
          .filter((user) =>
            user.userName
              .toLowerCase()
              .includes(searchTerm ? searchTerm.toLowerCase() : "")
          )
          .map((userr, index) => (
            <User
            follow={follow}
              key={userr.userId}
              following={following}
              id={userr.userId}
              name={userr.userName}
              userImg={userr.userImage}
              currentUserId={user[0]?.id}
            />
          ))
      )}
    </div>
  );
};
export default SearchPeople;
