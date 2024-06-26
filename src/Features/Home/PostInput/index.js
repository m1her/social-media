"use client";

import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/firebase-config";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { toggleFlag } from "@/redux/Features/cart/postsSlice";

const PostInput = ({ user }) => {
  const [postImage, setPostImage] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lengthFlag, setLengthFlag] = useState(0);
  const dispatch = useDispatch();

  const postRef = useRef();

  const postHandler = async () => {
    setLoading(true);
    if (postImage.length > 0) {
      handleImagesUploade();
    } else {
      const updatedPosts = {
        user: user[0].name,
        userImg: user[0].profileImg,
        text: postRef.current.value,
        time: serverTimestamp(),
        likes: [],
        postImages: [],
      };

      addDoc(collection(db, `/posts/`), {
        ...updatedPosts,
        userUid: user[0].uid,
      }).then((docs) => {
        const newData = {
          ...updatedPosts,
          userUid: user[0].uid,
          id: docs.id,
        };
        updateDoc(doc(db, "/posts/", docs.id), newData);
      });

      postRef.current.value = "";
      setLoading(false);
      togglePost();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => URL.createObjectURL(file));
    setPostImage((prev) => [...prev, ...images]);
    setPostFiles((prev) => [...prev, ...files]);
    setLengthFlag((prev) => prev + files.length);
  };

  useEffect(() => {
    if (
      lengthFlag == downloadedImages.length &&
      lengthFlag.length != 0 &&
      lengthFlag > 0
    ) {
      setLoading(false);
      setPostImage([]);
      setPostFiles([]);
      setLengthFlag(0);
      const updatedPosts = {
        user: user[0].name,
        userImg: user[0].profileImg,
        text: postRef.current.value,
        time: serverTimestamp(),
        likes: [],
        postImages: [...downloadedImages],
      };
      addDoc(collection(db, `/posts/`), {
        ...updatedPosts,
        userUid: user[0].uid,
      }).then((docs) => {
        const newData = {
          ...updatedPosts,
          userUid: user[0].uid,
          id: docs.id,
        };
        updateDoc(doc(db, "/posts/", docs.id), newData);
      });

      setDownloadedImages([]);
      postRef.current.value = "";
      togglePost();
    }
  }, [downloadedImages]);

  const handleImagesUploade = async () => {
    postFiles.map((file) => {
      const storageRef = ref(storage, `/PostsImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            {
              setDownloadedImages((prev) => [...prev, url]);
            }
          });
        }
      );
    });
  };

  const removeImage = (imageIndex) => {
    console.log(postImage.splice(imageIndex, 1));
    setPostImage((prev) => prev.filter((item) => item != imageIndex));
    const updatedFiles = [...postFiles];
    updatedFiles.splice(imageIndex, 1);
    setPostFiles(updatedFiles);
    setLengthFlag((prev) => prev - 1);
  };

  const togglePost = () => {
    dispatch(toggleFlag());
  };

  return (
    <div className="main-block create-section">
      <div className="create">
        <div className="text-area pt-3">
          <textarea
            ref={postRef}
            name=""
            className="outline-none w-full p-3 h-[75px] placeholder:text-base placeholder:font-extralight resize-none text-[#666666] border-[5px]"
            placeholder="What About Today ?!"
          ></textarea>
        </div>
        <div className="flex w-full flex-row-reverse items-center">
          <div className="action py-2 pr-3">
            <button
              className="float-right py-1 px-2 text-lg post disabled:bg-gray-600"
              onClick={postHandler}
              disabled={loading}
            >
              {loading ? "..." : "Post"}
            </button>
            <div className="clearfix"></div>
          </div>
          <div className="mr-2 text-gray-400 cursor-pointer">
            <label
              htmlFor="postImageInput"
              className="cursor-pointer"
              onChange={handleImageChange}
            >
              <input
                id="postImageInput"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
              />
              <FontAwesomeIcon height={15} width={15} icon={faImage} />
            </label>
          </div>
        </div>
        <div className="flex overflow-scroll max-w-full max-h-28 pt-2">
          {postImage &&
            postImage.map((item, index) => (
              <div className="ml-2 mb-2 h-fit w-fit relative" key={index}>
                <div className="absolute bg-[#dadada83] w-full h-full z-30 "></div>
                <div
                  className="cursor-pointer w-4 h-4 absolute -top-2 -right-2 p-1 bg-white z-40 rounded-full flex justify-center items-center"
                  onClick={() => removeImage(index)}
                >
                  <FontAwesomeIcon
                    height={7}
                    width={7}
                    icon={faX}
                    className="w-2 h-2"
                  />
                </div>
                <Image
                  src={item}
                  alt="Img"
                  width={100}
                  height={100}
                  className="w- h-auto"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default PostInput;
