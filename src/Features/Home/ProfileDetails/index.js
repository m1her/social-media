"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/firebase-config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const ProfileDetails = ({ user }) => {
  const [profileImg, setProfileImg] = useState();
  const [pfpLoading, setPfpLoading] = useState(false);
  const [coveImg, setCoverImg] = useState();
  const [coverLoading, setCoverLoading] = useState(false);
  const [postsLength, setPostsLength] = useState(0);

  useEffect(() => {
    getDocs(collection(db, "posts")).then((querySnapshot) => {
      const newData = querySnapshot.docs.filter((doc) =>
       doc.data().userUid == user[0].uid
      ).map((doc) => ({ 
        ...doc.data(),
        id: doc.id,
      }));
      setPostsLength(newData.length);
    });
  }, []);

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    const storageRef = ref(
      storage,
      `${type == "pfp" ? "/ProfileImages/" : "/CoverImages/"}${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        {
          type == "pfp" ? setPfpLoading(true) : setCoverLoading(true);
        }

        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          {
            type == "pfp"
              ? updateDoc(doc(db, "users", user[0].id), {
                  profileImg: url,
                })
                  .then(setProfileImg(url))
                  .then(setPfpLoading(false))
              : updateDoc(doc(db, "users", user[0].id), {
                  bannerImg: url,
                })
                  .then(setCoverImg(url))
                  .then(setCoverLoading(false));
          }
        });

        getDocs(collection(db, "users")).then((querySnapshot) => {
          const newData = querySnapshot.docs
            .filter((doc) => doc.data().uid == user[0].uid)
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
          localStorage.setItem("TrainingUser", JSON.stringify(newData));
          window.dispatchEvent(new Event("storage"));
        });
      }
    );
  };

  return (
    <div className="col">
      <div className="main-block">
        <div className="w-full flex justify-center">
          <label
            htmlFor="coverInput"
            className="cursor-pointer relative flex justify-center items-start"
            onChange={() => handleImageChange(event, "cover")}
          >
            <input
              id="coverInput"
              type="file"
              className="hidden"
              accept="image/*"
            />
            {coverLoading && (
              <div className="flex justify-center items-center text-white !absolute bg-[#13131344] w-full h-full ">
                <div role="status" className="">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-700 fill-gray-600 dark:fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <Image
              alt="IMG"
              className="coverPicture object-cover object-top"
              height={1000}
              width={1000}
              src={coveImg ? coveImg : user[0].bannerImg}
            ></Image>
          </label>
        </div>
        <div className="w-full flex justify-center">
          <label
            htmlFor="imageInput"
            className="cursor-pointer relative flex justify-center items-start"
            onChange={() => handleImageChange(event, "pfp")}
          >
            <input
              id="imageInput"
              type="file"
              className="hidden"
              accept="image/*"
            />
            {pfpLoading && (
              <div className="profilePicture flex justify-center items-center text-white !z-50 !absolute ml-2 bg-[#13131344] w-full h-full -mt-4">
                <div role="status" className="ml-3">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-700 fill-gray-600 dark:fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <Image
              alt="IMG"
              className="profilePicture object-cover object-top z-50"
              height={1000}
              width={1000}
              src={profileImg ? profileImg : user[0].profileImg}
            ></Image>
          </label>
        </div>
        <div className="FullName text-center text-xl font-bold ProjectColor">
          {user[0].name}
        </div>
        <div className="row statistic text-center fs-16 p-3">
          <div className="col ">
            <p>Ferinds</p> <p>{user[0].followers.length}</p>
          </div>
          <div className="col border-l">
            <p>Posts</p> <p>{postsLength}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileDetails;
