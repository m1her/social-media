"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";

const Reply = ({
  text,
  time,
  handleToggleReply,
  name,
  image,
  likes,
  currentUserName,
  currentUserId,
  postId,
  commentId,
  replyIndex,
}) => {
  const [like, setLike] = useState(likes.length ? likes.length : 0);
  const [likeFlag, setLikeFlag] = useState(
    likes.some(
      (item) => item.name === currentUserName && item.id === currentUserId
    )
  );

  const commentLikeHandler = () => {
    const replyRef = doc(db, "/posts/", postId, "comments", commentId);
    getDoc(replyRef).then((doc) => {
      if (!likeFlag) {
        const updatedReplies = [...doc.data().replies];
        updatedReplies[replyIndex] = {
          ...updatedReplies[replyIndex],
          likes: [
            ...updatedReplies[replyIndex].likes,
            { name: currentUserName, id: currentUserId },
          ],
        };

        updateDoc(replyRef, { replies: updatedReplies });
        setLike((prev) => prev + 1);
        setLikeFlag(true);
      } else {
        const updatedReplies = doc.data().replies.map((reply, index) => {
          if (index === replyIndex) {
            const updatedLikes = reply.likes.filter(
              (like) =>
                like.name !== currentUserName || like.id !== currentUserId
            );

            return {
              ...reply,
              likes: updatedLikes,
            };
          }

          return reply;
        });

        updateDoc(replyRef, { replies: updatedReplies });
        setLike((prev) => prev - 1);
        setLikeFlag(false);
      }
    });
  };

  return (
    <div className="comment col-12 ">
      <div className="row">
        <div className="col-2 flex justify-end">
          <div className="pt-2 pl-2 inline-block ">
            <Image
              alt="IMG"
              width={100}
              height={100}
              className="Profile-Picture-Comment object-cover object-top "
              src={image}
            ></Image>
          </div>
        </div>
        <div className={`comment-box col-10 `}>
          <div className="row pr-2 py-2 pl-0">
            <div className="col pl-0">
              <div className="bg-gray-100 py-2 px-3 rounded-2xl w-fit -ml-4 max-w-lg break-words">
                <div className="font-semibold text-gray-700 ">{name}</div>
                <p className="text-sm mb-0">{text}</p>
              </div>
              <div className="pl-2 text-xs mt-0">
                <button
                  href=""
                  className={`text-[11px] font-thin hover:text-gray-800 hover:underline
                  ${likeFlag ? "text-red-500" : "text-gray-500"} `}
                  onClick={commentLikeHandler}
                >
                  {like == 0 ? "" : like + " "}Like
                </button>{" "}
                .
                <button
                  onClick={() => handleToggleReply(name)}
                  className="cursor-pointer text-[11px] text-gray-500 font-thin no-underline hover:text-gray-800"
                >
                  {" "}
                  Reply{" "}
                </button>{" "}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reply;
