"use client";
import Image from "next/image";
import LoginImage from "src/media/img-01.png";
import { Tilt } from "react-tilt";
import "../../../public/css/vendor/animate.css";
import Input from "@/Components/Input";
import SubmitButton from "@/Components/SubmitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import RegisterCard from "./registerCard";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState();
  const [emailMessage, setEmailMessage] = useState();
  const [passwordMessage, setPasswordMessage] = useState();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameRef.current.value == "") {
      setNameMessage("Name is required");
    }
    if (emailRef.current.value == "") {
      setEmailMessage("Email is required");
    } else if (!emailRef.current.value.includes("@")) {
      const temp = emailRef.current.value;
      emailRef.current.value = "";
      setTimeout(() => {
        emailRef.current.value = temp;
      }, 1000);

      setEmailMessage("Wrong email form");
    }
    if (passwordRef.current.value == "") {
      setPasswordMessage("Password is required");
    }

    if (nameMessage == "" && emailMessage == "" && passwordMessage == "") {
      const signUp = async () => {
        setIsLoading(true);
        try {
          const defaultProfileImgRef = ref(storage, "Default-Profile-Pic.jpg");
          const pfpImgUrl = await getDownloadURL(defaultProfileImgRef);
          const defaultBannerImgRef = ref(storage, "Default-Banner-Pic.jpg");
          const bnrImgUrl = await getDownloadURL(defaultBannerImgRef);

          const newUser = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            profileImg: pfpImgUrl,
            bannerImg: bnrImgUrl,
            followers: [],
            following: [],
            posts: 0,
          };

          await createUserWithEmailAndPassword(
            auth,
            emailRef.current.value,
            passwordRef.current.value
          ).then((UserCredential) => {
              addDoc(collection(db, `/users/`), {...newUser, uid: UserCredential.user.uid});
          });

          router.push("/login");
        } catch (error) {
          setIsLoading(false);
          console.log(error.message);
        }
      };

      signUp();
    }
  };

  const nameChangeHandler = () => {
    setNameMessage("");
  };
  const emailChangeHandler = () => {
    setEmailMessage("");
  };
  const passwordChangeHandler = () => {
    setPasswordMessage("");
  };

  return (
    <RegisterCard>
      <Tilt className="login100-pic js-tilt">
        <Image width={1000} height={1000} src={LoginImage} alt="IMG" />
      </Tilt>
      <form className="login100-form" onSubmit={handleSubmit}>
        <span className="login100-form-title animated">Register</span>
        <Input
          type="text"
          value="Example Name"
          placeholder={nameMessage ? nameMessage : "Name"}
          error={nameMessage ? "!bg-red-200 placeholder:text-red-500" : ""}
          ref={nameRef}
          onChange={nameChangeHandler}
        />
        <Input
          type="text"
          value="ex@abc.xyz"
          placeholder={emailMessage ? emailMessage : "Email"}
          error={emailMessage ? "!bg-red-200 placeholder:text-red-500" : ""}
          ref={emailRef}
          onChange={emailChangeHandler}
        />
        <Input
          type="password"
          value="password"
          placeholder={passwordMessage ? passwordMessage : "Password"}
          error={passwordMessage ? "!bg-red-200 placeholder:text-red-500" : ""}
          ref={passwordRef}
          onChange={passwordChangeHandler}
        />
        <SubmitButton buttonText="REGISTER" isLoading={isLoading} />
        <div className="text-center pt-[130px]">
          <Link className="txt2 underline hover:no-underline" href="/login">
            Log in
            <FontAwesomeIcon
              icon={faArrowRight}
              width={15}
              height={15}
              className="ml-[5px]"
            />
          </Link>
        </div>
      </form>
    </RegisterCard>
  );
};
export default Register;
