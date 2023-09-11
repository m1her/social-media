"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { updateSearchTerm } from "@/redux/Features/search/searchSlice";

const Header = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("TrainingUser"))
  );
  
  const [toggleList, setToggleList] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const handleToggleList = () => {
    setToggleList((toggle) => !toggle);
  };
  const searchRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatchTermHandler();
      if (pathname == "/search") {
        searchRef.current.value = "";
      } else {
        router.push(`/search`);
        searchRef.current.value = "";
      }
    } else {
    }
  };

  const dispatchTermHandler = () => {
    dispatch(updateSearchTerm(searchRef.current.value));
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("TrainingUser"));
    //getDoc(doc(db, "users", user[0].id)).then((doc) => setUser(doc.data()));
  }, []);

  return (
    <div className="container-fluid ">
      <div className="row">
        <nav
          className="bg-white px-4 flex items-center relative"
          onBlur={() => setToggleList(false)}
        >
          <Link className="text-xl ProjectColor no-underline" href="home">
            WebProject
          </Link>
          <div className="grid lg:grid-cols-2 grid-cols-1 w-full ">
            <div
              className={`
              ${
                toggleList ? "max-h-44" : ""
              } transition-all duration-500 ease-in-out max-h-0 overflow-hidden
            w-full pl-4 absolute bg-white flex flex-col left-0 top-14 space-y-2 items-start lg:max-h-max
            lg:pl-0 lg:h-auto lg:items-center lg:ml-6 lg:static lg:space-y-0 lg:flex lg:flex-row
             `}
            >
              <Link
                className={`text-[15px] mr-4  text-gray-600 hover:text-black no-underline ${
                  pathname == "/home" ? "font-medium text-black" : ""
                }`}
                href="home"
              >
                Home
              </Link>

              <Link
                className={`text-[15px] mr-6 text-gray-600 hover:text-black no-underline ${
                  pathname == "/profile" ? "font-medium text-black" : ""
                }`}
                href={`profile?id=${user[0].id}`}
              >
                Profile
              </Link>

              <input
                ref={searchRef}
                onKeyDown={handleKeyDown}
                type="search"
                className="py-0.5 text-[14px] font-thin pl-4 w-40 input-border placeholder:text-sm outline-none"
                placeholder="Search .. !"
              />

              <div className="block lg:hidden">
                <Link className="text-[18px]" href="login">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    width={15}
                    height={15}
                    className="text-black"
                  />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block my-2  place-self-end pr-2.5">
              <button
                className="text-[18px]"
                onClick={logout}
                data-toggle="tooltip"
                data-placement="top"
                title=""
                data-original-title="Log out !"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  width={15}
                  height={15}
                  className="ml-5 text-black"
                />
              </button>
            </div>
            <div
              className="lg:hidden my-2 place-self-end p-2 border rounded cursor-pointer"
              onClick={handleToggleList}
            >
              <button className="text-[18px]">
                <FontAwesomeIcon
                  icon={faBars}
                  width={28}
                  height={20}
                  className="text-black"
                />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default Header;
