"use client";
import Header from "@/Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import Post from "@/Components/Post";
import { useSearchParams } from "next/navigation";
import PostInput from "@/Features/Home/PostInput";
import ProfileDetails from "@/Features/Home/ProfileDetails";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase-config";
import { useSelector } from "react-redux";
import ProfileLoading from "@/Components/ProfileLoading";

const profile = () => {
  const postsFlag = useSelector((state) => state.posts.flag);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [currId, setCurrId] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("TrainingUser"))[0].id
      : ""
  );

  const pathname = useSearchParams();

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

  useEffect(() => {
    const userRef = doc(db, "users", pathname.get("id"));
    getDoc(userRef).then((doc) => setUser([{ ...doc.data(), id: doc.id }]));
  }, []);

  return (
    <div className="wrap-main flex flex-col items-center">
      <Header />
      <div className="w-9/12">
        <div className="container mt-5">
          <div className="row">
            <div className="col">
              {user.length > 0 ? (
                <ProfileDetails user={user} />
              ) : (
                <ProfileLoading />
              )}
              <div className="row">
                <div className="col col-sm-12 mobile-shown">
                  {currId == user[0]?.id && user.length > 0 && (
                    <PostInput user={user} />
                  )}

                  {posts?.length != 0
                    ? posts
                        .filter((post) => post.user == user[0].name)
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
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default profile;
