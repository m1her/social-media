"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Post from "@/Components/Post";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase-config";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

const SearchPosts = () => {
  const [loading, setLoading] = useState(true);
  const postsFlag = useSelector((state) => state.posts.flag);
  const searchTerm = useSelector((state) => state.search.term);
  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("TrainingUser"))
      : ""
  );
  const [posts, setPosts] = useState([]);

  window.addEventListener("storage", () => {
    setUser(JSON.parse(localStorage.getItem("TrainingUser")) || []);
    console.log("updated");
  });

  const deletePostHandler = (postIndex) => {
    console.log(posts.splice(postIndex, 1));
    setPosts((prev) => prev.filter((item, index) => item !== postIndex));
  };

  useEffect(() => {
    const postsCollection = collection(db, "posts");
    const unsubscribe = onSnapshot(
      query(postsCollection, orderBy("time", "desc")),
      (querySnapshot) => {
        const promises = querySnapshot.docs.map((doc) => {
          const commentsSnapshot = getDocs(
            query(
              collection(db, "posts", doc.id, "comments"),
              orderBy("time", "desc")
            )
          ).then((querySnapshot) => {
            const commentsData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            return commentsData;
          });
          return Promise.all([commentsSnapshot]).then(([comments]) => ({
            id: doc.id,
            ...doc.data(),
            comments: comments,
          }));
        });

        Promise.all(promises).then((newData) => {
          setPosts(newData);
          setLoading(false);
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [postsFlag]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="w-full flex justify-center my-4">
          <Spinner color="fill-blue-700" size="w-8 h-8" />
        </div>
      ) : posts?.length != 0 ? (
        posts
          .filter((post) =>
            post.text
              .toLowerCase()
              .includes(searchTerm ? searchTerm.toLowerCase() : "")
          )
          .map((post, index) => (
            <Post
              key={Math.random()}
              id={post.id}
              name={post.user}
              text={post.text}
              profileImage={post.userImg}
              currentUserImg={user[0].profileImg}
              currentUserName={user[0].name}
              currentUserId={user[0].id}
              postImages={post.postImages}
              index={index}
              likes={post.likes}
              comments={post.comments}
              time={post.time}
              deletePostHandler={() => deletePostHandler(index)}
              nameClassName="lg:ml-2"
              iconClassName=""
              commentClassName="-ml-7"
            />
          ))
      ) : (
        ""
      )}
    </div>
  );
};
export default SearchPosts;
