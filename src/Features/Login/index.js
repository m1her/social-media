"use client";
import Image from "next/image";
import LoginCard from "./loginCard";
import LoginImage from "src/media/img-01.png";
import { Tilt } from "react-tilt";
import "../../../public/css/vendor/animate.css";
import Input from "@/Components/Input";
import SubmitButton from "@/Components/SubmitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  const changeHandler = () => {
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const login = async () => {
      setIsLoading(true);
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        );
        console.log(user.user.uid);
        await getDocs(collection(db, "users")).then((querySnapshot) => {
          const newData = querySnapshot.docs
            .filter((doc) => doc.data().uid == user.user.uid)
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
       
          localStorage.setItem("TrainingUser", JSON.stringify(newData));
        });
        router.push("/home");
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
      }
    };
    login();
  };

  return (
    <LoginCard>
      <Tilt className="login100-pic js-tilt">
        <Image width={1000} height={1000} src={LoginImage} alt="IMG" />
      </Tilt>

      <form className="login100-form" onSubmit={handleSubmit}>
        <span className="login100-form-title animated">Login</span>
        <Input
          type="text"
          value="ex@abc.xyz"
          placeholder="Email"
          ref={emailRef}
          onChange={changeHandler}
        />
        <Input
          type="password"
          value="password"
          placeholder="Password"
          ref={passwordRef}
          onChange={changeHandler}
        />
        <div className="relative h-5 -mb-3 -mt-1 pl-8">
          <div className="text-red-500 text-sm font-medium absolute">
            {errorMessage ? errorMessage + "!" : ""}
          </div>
        </div>
        <SubmitButton isLoading={isLoading} />
        <div className="text-center pt-[12px]">
          <span className="txt1">Forgot</span>
          <Link className="txt2 underline ml-1" href="#">
            Username / Password?
          </Link>
        </div>
        <div className="text-center pt-[130px]">
          <Link className="txt2 underline hover:no-underline" href="/register">
            Create your Account
            <FontAwesomeIcon
              icon={faArrowRight}
              width={15}
              height={15}
              className="ml-[5px]"
            />
          </Link>
        </div>
      </form>
    </LoginCard>
  );
};
export default Login;
