"use client";

import { clearSearchTerm } from "@/redux/Features/search/searchSlice";
import { useDispatch } from "react-redux";

const SearchNav = ({ searchCatagory, setSearchCatagory }) => {
  const dispatch = useDispatch();
  const peopleToggleHandler = () => {
    setSearchCatagory(true);
    dispatch(clearSearchTerm());
  };
  const postsToggleHandler = () => {
    setSearchCatagory(false);
    dispatch(clearSearchTerm());
  };
  return (
    <div className="w-full flex justify-center">
      <div className="flex bg-[#fefefe] rounded-b-lg w-7/12 text-center shadow-sm shadow-gray-200  ">
        <div
          className={`${
            !searchCatagory ? "text-gray-500 " : "text-gray-700"
          }  w-1/2 border-r border-gray-300 py-2 cursor-pointer hover:text-gray-700`}
          onClick={peopleToggleHandler}
        >
          People
        </div>
        <div
          className={`${
            searchCatagory ? "text-gray-500 " : "text-gray-700"
          }  w-1/2 border-r border-gray-300 py-2 cursor-pointer hover:text-gray-700`}
          onClick={postsToggleHandler}
        >
          Posts
        </div>
      </div>
    </div>
  );
};
export default SearchNav;
