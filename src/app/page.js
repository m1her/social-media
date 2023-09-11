"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("TrainingUser"))
  );
  const router = useRouter();

  useEffect(() => {
    if (user) {
       router.push("/home");
    } else {
       router.push(".login");
    }
  }, []);
  return (
    <main className="wrap-main">
      <div className="container mt-5 w-9/12 ">
        <div className="row h-screen animate-pulse"></div>
      </div>
    </main>
  );
}
