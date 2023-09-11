"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAsia,
  faChevronDown,
  faShareFromSquare,
  faHeart,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useRef, useState } from "react";
import Comment from "./Comment";
import ConfirmationPopup from "../ConfirmationPopup";
import DisplayImages from "../DisplayImages";
import { db } from "@/firebase-config";
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Spinner from "../Spinner";

const Post = ({
  text,
  nameClassName,
  iconClassName,
  commentClassName,
  profileImage,
  deletePostHandler,
  index,
  name,
  likes,
  time,
  currentUserImg,
  currentUserName,
  currentUserId,
  postImages,
  comments,
  id,
}) => {
  const [currentUser, setUser] = useState(
    JSON.parse(localStorage.getItem("TrainingUser"))[0].name
  );
  const [imageDisplay, setImageDisplay] = useState(false);
  const [postDrop, setPostDrop] = useState(false);
  const [like, setLike] = useState(likes.length ? likes.length : 0);
  const [likers, setLikers] = useState("");
  const [likeFlag, setLikeFlag] = useState(
    likes.some(
      (item) => item.name === currentUserName && item.id === currentUserId
    )
  );
  const [Comments, setComments] = useState(comments);
  const [Delete, setDelete] = useState(false);
  const [commentLoading, setcommentLoading] = useState(false);
  const commentRef = useRef();

  const handlePostToggle = () => {
    setPostDrop((prev) => !prev);
  };

  const blurHandler = () => {
    setPostDrop(false);
  };

  const openImageDisplay = () => {
    setImageDisplay(true);
  };
  const closeImageDisplay = () => {
    setImageDisplay(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setcommentLoading(true);

      addDoc(collection(db, "posts/", id, "comments"), {
        text: commentRef.current.value,
        time: new Date().toString(),
        name: currentUserName,
        image: currentUserImg,
        replies: [],
      })
        .then((docs) => {
          const newData = {
            text: commentRef.current.value,
            time: new Date().toString(),
            name: currentUserName,
            image: currentUserImg,
            replies: [],
            likes: [],
            id: docs.id,
          };
          setComments((prev) => [newData, ...prev]);
          updateDoc(doc(db, "/posts/", id, "comments", docs.id), newData);
        })
        .finally(() => {
          commentRef.current.value = "";
          setcommentLoading(false);
        });

      // Clear the input field after submission
      //
    }
  };

  const handleCommentButton = () => {
    commentRef.current.focus();
  };

  const handleDelete = (deletestate) => {
    setDelete(deletestate);
  };

  const deletePost = (YesOrNo) => {
    if (YesOrNo) {
      deletePostHandler(index);
      deleteDoc(doc(db, "/posts/", id));
    } else {
    }
  };

  const handleLike = () => {
    const postRef = doc(db, "posts", id);
    if (!likeFlag) {
      updateDoc(postRef, {
        likes: [...likes, { name: currentUserName, id: currentUserId }],
      });
      setLike((prev) => prev + 1);
      setLikeFlag(true);
    } else {
      updateDoc(postRef, {
        likes: arrayRemove({ name: currentUserName, id: currentUserId }),
      });
      setLike((prev) => prev - 1);
      setLikeFlag(false);
    }
  };

  const likeHoverHandler = () => {
    likes.map((like) => setLikers((prev) => [...prev, like]));
  };
  const likeHoverOutHandler = () => {
    setLikers([]);
  };

  return (
    <div className="main-block post-without-photo">
      <div className="Post-Box relative">
        <div className="header row">
          <div className="col-10 flex items-center ">
            <div className=" pt-2 pl-2 inline-block">
              <Image
                alt="IMG"
                className="Profile-Picture object-cover object-top"
                height={100}
                width={100}
                src={profileImage}
              ></Image>
            </div>
            <div className={` ${nameClassName} `}>
              <div className="inline-block mt-3">
                <Link href="" className="font-bold no-underline text-gray-500 ">
                  {name}
                </Link>
                <div className="flex items-center text-gray-500">
                  <Link href="" className="text-xs text-gray-500 no-underline">
                    {Math.floor(
                      (new Date() - new Date(Date.parse(time?.toDate()))) /
                        (1000 * 60)
                    ) < 59
                      ? parseInt(
                          Math.floor(
                            (new Date() -
                              new Date(Date.parse(time?.toDate()))) /
                              (1000 * 60)
                          )
                        ) + " m ago"
                      : Math.floor(
                          (new Date() - new Date(Date.parse(time?.toDate()))) /
                            (1000 * 60)
                        ) /
                          60 <
                        24
                      ? parseInt(
                          Math.floor(
                            (new Date() -
                              new Date(Date.parse(time?.toDate()))) /
                              (1000 * 60)
                          ) / 60
                        ) + " h ago"
                      : Math.floor(
                          (new Date() - new Date(Date.parse(time?.toDate()))) /
                            1000
                        ) /
                          (60 * 60 * 24) <
                        7
                      ? parseInt(
                          Math.floor(
                            (new Date() -
                              new Date(Date.parse(time?.toDate()))) /
                              1000
                          ) /
                            (60 * 60 * 24)
                        ) + " d ago"
                      : Math.floor(
                          (new Date() - new Date(Date.parse(time?.toDate()))) /
                            1000
                        ) /
                          (60 * 60 * 24 * 7) <
                        4
                      ? parseInt(
                          Math.floor(
                            (new Date() -
                              new Date(Date.parse(time?.toDate()))) /
                              1000
                          ) /
                            (60 * 60 * 24 * 7)
                        ) + " weeks"
                      : Math.floor(
                          (new Date() - new Date(Date.parse(time?.toDate()))) /
                            1000
                        ) /
                          (60 * 60 * 24 * 30) <
                        12
                      ? parseInt(
                          Math.floor(
                            (new Date() -
                              new Date(Date.parse(time?.toDate()))) /
                              1000
                          ) /
                            (60 * 60 * 24 * 30)
                        ) + " monthes"
                      : parseInt(
                          (new Date() - new Date(Date.parse(time?.toDate()))) /
                            1000 /
                            (60 * 60 * 24 * 30 * 12)
                        ) + " year"}
                  </Link>
                  <FontAwesomeIcon
                    className="ml-1"
                    height={9}
                    width={9}
                    icon={faGlobeAsia}
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Public"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`col-2 ${iconClassName}`} onBlur={blurHandler}>
            <div className="ActionBTN text-right pr-4 pt-4">
              <button
                className="text-gray-800 font-bold"
                onClick={handlePostToggle}
              >
                <FontAwesomeIcon
                  height={14}
                  width={14}
                  icon={faChevronDown}
                  className={`${
                    postDrop ? "-rotate-90" : "rotate-0"
                  } transition-all delay-0 duration-300 ease-in-out`}
                />
              </button>
              <div
                className={`
              ${
                postDrop ? "max-h-20" : "max-h-0"
              } overflow-hidden transition-all delay-0 duration-300 ease-in-out
              -right-10 bg-white flex flex-col items-start w-60 font-medium text-gray-500 absolute rounded-lg px-2 shadow z-50 `}
              >
                <ul className="pl-0 py-2 mb-0">
                  {name == currentUser && (
                    <li
                      className="flex items-center cursor-pointer"
                      onClick={() => handleDelete(true)}
                    >
                      <FontAwesomeIcon
                        height={20}
                        width={20}
                        icon={faTrashCan}
                        className="mr-2"
                      />
                      Delete post
                    </li>
                  )}
                  {Delete && (
                    <ConfirmationPopup
                      deletePost={deletePost}
                      handleDelete={handleDelete}
                    />
                  )}
                  <li>
                    <FontAwesomeIcon
                      height={20}
                      width={20}
                      icon={faExclamationTriangle}
                      className="mr-2"
                    />
                    Report post
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="m-2" />
        <div className="body row">
          <div className="details col ">
            <p className="px-3 mb-2 whitespace-pre-wrap">{text}</p>
          </div>
        </div>
        {imageDisplay && (
          <DisplayImages
            closeImageDisplay={closeImageDisplay}
            images={postImages}
          />
        )}
        {postImages != undefined && postImages.length > 0 ? (
          postImages.length == 1 ? (
            <div className="w-full relative border-2 border-white ">
              <Image
                src={postImages[0]}
                width={1000}
                height={1000}
                alt=" "
                className="cursor-pointer object-cover object-center"
                onClick={openImageDisplay}
              />
            </div>
          ) : postImages.length == 2 ? (
            <div className="grid grid-cols-2 gap-x-0">
              <div className="w-full aspect-square relative border-2 border-white">
                <Image
                  src={postImages[0]}
                  fill
                  alt=" "
                  className="object-cover object-center cursor-pointer"
                  onClick={openImageDisplay}
                />
              </div>
              <div className="w-full relative border-2 border-white">
                <Image
                  src={postImages[1]}
                  fill
                  alt=" "
                  className="object-cover object-center cursor-pointer"
                  onClick={openImageDisplay}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 gap-x-0">
              <div className="w-full aspect-square relative border-2 border-white">
                <Image
                  src={postImages[0]}
                  fill
                  alt=" "
                  className="object-cover object-center cursor-pointer"
                  onClick={openImageDisplay}
                />
              </div>
              <div className="w-full relative border-2 border-white">
                <Image
                  src={postImages[1]}
                  fill
                  alt=" "
                  className="object-cover object-center cursor-pointer"
                  onClick={openImageDisplay}
                />
              </div>
              <div className="w-full relative border-2 border-white">
                <Image
                  src={postImages[2]}
                  fill
                  alt=" "
                  className="object-cover object-center cursor-pointer"
                  onClick={openImageDisplay}
                />
              </div>
              {postImages.length == 3 && (
                <div className="w-full bg-gray-100 border-2 border-white">
                  {" "}
                </div>
              )}
              {postImages.length > 3 && (
                <div className="w-full relative border-2 border-white">
                  <Image
                    src={postImages[3]}
                    fill
                    alt=" "
                    className="object-cover object-center cursor-pointer"
                    onClick={openImageDisplay}
                  />
                  {postImages.length > 4 && (
                    <div className="cursor-pointer bg-[#5f5f5f96] w-full h-full flex justify-center items-center text-3xl font-bold text-white absolute top-4">
                      +{postImages.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          ""
        )}
        {like ? (
          <div className="ml-2 py-1 flex items-center relative">
            <div
              className="shadow-sm shadow-[#efeeee] w-4 h-4 p-1 rounded-full bg-red-500 flex items-center justify-center"
              onMouseEnter={likeHoverHandler}
              onMouseLeave={likeHoverOutHandler}
            >
              {likers.length > 0 && (
                <div
                  key={index}
                  className="bg-[#04040493] absolute text-white px-2 py-1 bottom-6"
                >
                  <ul className="pl-0 mb-0">
                    {likers.map((liker, index) => (
                      <li key={index}>{liker.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <FontAwesomeIcon
                height={10}
                width={10}
                icon={faHeart}
                className="text-white"
              />
            </div>
            <div className="ml-1">{like}</div>
          </div>
        ) : (
          ""
        )}
        <hr className="mb-0 mt-0" />
        <div className="footer ">
          <div className="row action-btn ">
            <div className="col " onClick={handleLike}>
              <div className=" py-2 footer-btn text-center flex justify-center items-center">
                <button className="text-gray-500 no-underline flex items-center">
                  {likeFlag ? (
                    <FontAwesomeIcon
                      height={14}
                      width={14}
                      icon={faHeart}
                      className={`text-red-500 ${
                        likeFlag ? "" : "w-0 h-0 "
                      } transition-all duration-300 ease-in-out`}
                    />
                  ) : (
                    <FontAwesomeIcon
                      height={14}
                      width={14}
                      icon={regularHeart}
                    />
                  )}

                  <span className="px-1"> Like</span>
                </button>
              </div>
            </div>
            <div className="col border-l">
              <div
                className=" py-2 footer-btn text-center flex justify-center items-center"
                onClick={handleCommentButton}
              >
                <button className="text-gray-500 font-thin no-underline flex items-center">
                  <FontAwesomeIcon height={14} width={14} icon={faComment} />
                  <span className="px-1"> Comment</span>
                </button>
              </div>
            </div>
            <div className="col border-l">
              <div className=" py-2 footer-btn text-center flex justify-center items-center">
                <Link
                  href=""
                  className="text-gray-500 font-thin no-underline flex items-center"
                >
                  <FontAwesomeIcon
                    height={14}
                    width={14}
                    icon={faShareFromSquare}
                  />
                  <span className="px-1"> Share</span>
                </Link>
              </div>
            </div>
          </div>
          <hr className="mt-0 mb-2" />
          <div className="row comment-list">
            <div className="add-comment flex w-full pb-2">
              <div className=" pt-2 pl-2 mr-2 flex-shrink-0">
                <Image
                  alt="IMG"
                  width={100}
                  height={100}
                  className="Profile-Picture-Comment object-cover object-top"
                  src={currentUserImg}
                ></Image>
              </div>

              <div className={`comment-box w-full`}>
                <div className="row pr-2 py-2 ">
                  <div className="col pl-0 flex items-center justify-between !mr-0 !pr-0">
                    <input
                      ref={commentRef}
                      type="text"
                      className={`mr-2 outline-none py-1.5 text-sm px-3 placeholder:text-sm placeholder:text-gray-300
                        ${commentLoading ? "bg-gray-200" : ""}
                        `}
                      placeholder="Add new comment"
                      onKeyDown={handleKeyDown}
                      disabled={commentLoading}
                    />
                    {commentLoading ? (
                      <Spinner color="fill-gray-700" size="w-5 h-5" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>

            {Comments.length != 0
              ? Comments.map((comment, index) => (
                  <Comment
                    commentClassName={commentClassName}
                    key={Math.random()}
                    text={comment.text}
                    time={comment.time}
                    name={comment.name}
                    image={comment.image}
                    likes={comment.likes}
                    replies={comment.replies}
                    postId={id}
                    commentId={comment.id}
                    currentUserName={currentUserName}
                    currentUserImg={currentUserImg}
                    currentUserId={currentUserId}
                  />
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
