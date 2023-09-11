"use client";
import Header from "@/Components/Header";
import SearchNav from "@/Components/SearchNav";
import SearchPeople from "@/Components/SearchPeople";
import SearchPosts from "@/Components/SearchPosts";
import { useState } from "react";

const search = () => {
  const [searchCatagory, setSearchCatagory] = useState(true);

  return (
    <div className="wrap-main ">
      <Header />
      <SearchNav setSearchCatagory={setSearchCatagory} searchCatagory={searchCatagory} />
      <div className="container mt-5 flex flex-col items-center ">
        <div className="w-9/12">
          <div className="row">
            <div className="col">
              {searchCatagory ? (
                <div className="main-block">
                  <div className="border-b text-lg pl-2 py-2">People</div>
                  <SearchPeople />
                </div>
              ) : (
                <div className="">
                  <SearchPosts />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default search;
