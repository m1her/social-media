"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useState } from "react";
import Reply from "./Reply";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";

const Comment = ({
  text,
  time,
  commentClassName,
  name,
  image,
  replies,
  postId,
  commentId,
  currentUserName,
  currentUserImg,
  currentUserId,
  likes,
}) => {
  const replyRef = useRef();
  const [toggleReply, setToggleReply] = useState(false);
  const [repliesState, setRepliesState] = useState(replies);
  const [expandRepliesFlag, setExpandRepliesFlag] = useState(false);
  const [like, setLike] = useState(likes.length ? likes.length : 0);
  const [likeFlag, setLikeFlag] = useState(
    likes.some(
      (item) => item.name === currentUserName && item.id === currentUserId
    )
  );

  const handleToggleReply = (name) => {
    setToggleReply(true);

    setTimeout(() => {
      replyRef.current.focus();
      name ? (replyRef.current.value = "@" + name + " ") : "";
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateDoc(doc(db, "/posts/", postId, "comments", commentId), {
        replies: [
          {
            text: replyRef.current.value,
            time: new Date().toString(),
            name: currentUserName,
            image: currentUserImg,
            likes: [],
          },
          ...replies,
        ],
      });
      setRepliesState((prev) => [
        {
          text: replyRef.current.value,
          time: new Date().toString(),
          name: currentUserName,
          image: currentUserImg,
          likes: [],
        },
        ...prev,
      ]);
      setToggleReply((prev) => !prev);
    } else {
    }
  };

  const repliesExpandingHandler = () => {
    setExpandRepliesFlag((prev) => !prev);
  };

  const commentLikeHandler = () => {
    const commentRef = doc(db, "/posts/", postId, "comments", commentId);
    if (!likeFlag) {
      updateDoc(commentRef, {
        likes: [...likes, { name: currentUserName, id: currentUserId }],
      });
      setLike((prev) => prev + 1);
      setLikeFlag(true);
    } else {
      updateDoc(commentRef, {
        likes: arrayRemove({ name: currentUserName, id: currentUserId }),
      });
      setLike((prev) => prev - 1);
      setLikeFlag(false);
    }
  };

  return (
    <div className="comment  ">
      <div className="flex w-full" >
        <div className="">
          <div className="pt-2 pl-2 mr-4 w-fit inline-block">
            <Image
              alt="IMG"
              width={100}
              height={100}
              className="Profile-Picture-Comment object-cover object-top"
              src={image}
            ></Image>
          </div>
        </div>
        <div className={`comment-box w-fit`}>
          <div className="row pr-2 py-2 pl-0">
            <div className=" pl-0">
              <div className="bg-gray-100 py-2 px-3 rounded-2xl w-fit -ml-1 max-w-lg break-words">
                <div className="font-semibold text-gray-700 ">{name}</div>
                <p className="text-sm mb-0">{text}</p>
              </div>
              <div className="pl-2 text-xs mt-0 flex items-center">
                <button
                  href=""
                  className={`text-[11px] font-thin hover:text-gray-800 hover:underline
                  ${likeFlag ? "text-red-500" : "text-gray-500"} `}
                  onClick={commentLikeHandler}
                >
                  {like == 0 ? "" : like + " "}Like
                </button>
                .
                <button
                  className="text-[11px] text-gray-500 font-thin hover:text-gray-800 hover:underline"
                  onClick={() => handleToggleReply(name)}
                >
                  {" "}
                  Reply{" "}
                </button>
                .{" "}
                <span className="text-[11px] text-gray-500 font-thin no-underline">
                  {Math.floor(
                    (new Date() - new Date(Date.parse(time))) / (1000 * 60)
                  ) < 60
                    ? parseInt(
                        Math.floor(
                          (new Date() - new Date(Date.parse(time))) /
                            (1000 * 60)
                        )
                      ) + " m ago"
                    : Math.floor(
                        (new Date() - new Date(Date.parse(time))) / (1000 * 60)
                      ) /
                        60 <
                      24
                    ? parseInt(
                        Math.floor(
                          (new Date() - new Date(Date.parse(time))) /
                            (1000 * 60)
                        ) / 60
                      ) + " h ago"
                    : Math.floor(
                        (new Date() - new Date(Date.parse(time))) / 1000
                      ) /
                        (60 * 60 * 24) <
                      7
                    ? parseInt(
                        Math.floor(
                          (new Date() - new Date(Date.parse(time))) / 1000
                        ) /
                          (60 * 60 * 24)
                      ) + " d ago"
                    : Math.floor(
                        (new Date() - new Date(Date.parse(time))) / 1000
                      ) /
                        (60 * 60 * 24 * 7) <
                      4
                    ? parseInt(
                        Math.floor(
                          (new Date() - new Date(Date.parse(time))) / 1000
                        ) /
                          (60 * 60 * 24 * 7)
                      ) + " weeks"
                    : Math.floor(
                        (new Date() - new Date(Date.parse(time))) / 1000
                      ) /
                        (60 * 60 * 24 * 30) <
                      12
                    ? parseInt(
                        Math.floor(
                          (new Date() - new Date(Date.parse(time))) / 1000
                        ) /
                          (60 * 60 * 24 * 30)
                      ) + " monthes"
                    : parseInt(
                        (new Date() - new Date(Date.parse(time))) /
                          1000 /
                          (60 * 60 * 24 * 30 * 12)
                      ) + " year"}
                </span>
                {repliesState.length != 0 ? (
                  <div
                    className="text-sm text-gray-600 underline hover:text-gray-800 cursor-pointer ml-4"
                    onClick={repliesExpandingHandler}
                  >
                    {expandRepliesFlag
                      ? "Hide"
                      : "Show (" + repliesState.length + ")"}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {repliesState.length != 0 && expandRepliesFlag
        ? repliesState.map((reply, index) => (
            <Reply
              // replyClassName={replyClassName}
              key={Math.random()}
              name={reply.name}
              text={reply.text}
              time={reply.time}
              image={reply.image}
              likes={reply.likes}
              handleToggleReply={handleToggleReply}
              currentUserName={currentUserName}
              currentUserId={currentUserId}
              postId={postId}
              commentId={commentId}
              replyIndex={index}
            />
          ))
        : ""}

      <div className="row comment-list">
        {toggleReply ? (
          <div className="add-comment col-12 pb-2">
            <div className="row">
              <div className="col-2 flex justify-end">
                <div className=" pt-2 pl-2">
                  <Image
                    alt="IMG"
                    width={100}
                    height={100}
                    className="Profile-Picture-Comment object-cover object-top"
                    src={image}
                  ></Image>
                </div>
              </div>
              <div className="col-1 "></div>

              <div className={`comment-box col-9 ${commentClassName}`}>
                <div className="row pr-2 py-2 flex justify-end">
                  <div className="col ">
                    <input
                      ref={replyRef}
                      type="text"
                      className="outline-none py-1.5 text-sm px-3 placeholder:text-sm placeholder:text-gray-300"
                      placeholder="Add new comment"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Comment;
