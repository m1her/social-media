"use client";
import Header from "@/Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Post from "@/Components/Post";
import { useEffect, useState } from "react";
import ProfileDetails from "@/Features/Home/ProfileDetails";
import PostInput from "@/Features/Home/PostInput";
import SuggestedPeople from "@/Features/Home/SuggestedPeople";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase-config";
import { useSelector } from "react-redux";

const home = () => {
  const postsFlag = useSelector((state) => state.posts.flag);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("TrainingUser"))
  );

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    console.log(window.localStorage.getItem("TrainingUser"));
  }, []);

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
          console.log(newData);
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [postsFlag]);

  return (
    <div className="wrap-main">
      <Header />

      <div className="container mt-5 w-9/12 ">
        <div className="row">
          <ProfileDetails user={user} />

          <div className="col-md-6 col-sm-12  mobile-shown">
            <PostInput user={user} />

            {posts?.length != 0
              ? posts.map((post, index) => (
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
              : ""}
          </div>
          <SuggestedPeople
            currentUserName={user[0].name}
            currentUserId={user[0].id}
            following={user[0].following}
            currentUserImg={user[0].profileImg}
          />
        </div>
      </div>
    </div>
  );
};
export default home;
