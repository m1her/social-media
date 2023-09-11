"use client";
import {
  faChevronRight,
  faChevronLeft,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

const DisplayImages = ({ images, closeImageDisplay }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const increaseIndex = () => {
    if (imageIndex != images.length - 1) {
      setImageIndex((prev) => prev + 1);
      console.log("test");
    }
  };
  const decreaseIndex = () => {
    if (imageIndex != 0) {
      setImageIndex((prev) => prev - 1);
      
    }
  };
  return (
    <div className="z-50">
      <div className="popup z-50 ">
        <div className="popup-content z-50 rounded-2xl relative w-fit bg-gray-500 bg-transparent flex justify-center items-center">
          <div
            className="bg-white p-2 rounded-full absolute top-0 right-0 w-10 h-10 cursor-pointer"
            onClick={closeImageDisplay}
          >
            <FontAwesomeIcon
              icon={faX}
              width={10}
              height={10}
              className="w-4 aspect-square"
            />
          </div>
          {/* <div className="">
            <SimpleImageSlider
              width={500}
              height={500}
              images={images}
              showBullets={false}
              showNavs={true}
              className="your-app"
            />
          </div> */}
          <div className="w-1/2 aspect-square flex justify-center items-center relative">
            <div className="text-gray-200">
              <FontAwesomeIcon
                icon={faChevronRight}
                width={10}
                height={10}
                className="w-5 h-5 aspect-square absolute right-0 top-1/2 cursor-pointer"
                onClick={increaseIndex}
              />
            </div>
            <div className="text-gray-200">
              <FontAwesomeIcon
                icon={faChevronLeft}
                width={20}
                height={20}
                className="w-5 h-5 aspect-square absolute left-0 top-1/2  cursor-pointer"
                onClick={decreaseIndex}
             />
            </div>
            <div className="h-full bg-transparent justify-center flex items-center px-4 ">
              <Image src={images[imageIndex]} width={1000} height={1000} alt=" " />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-content {
          border-radius: 5px;
          text-align: center;
        }
        .your-app {
          .rsis-image {
            background-size: contain !important;
            background-repeat: no-repeat !important;
            object-fit: cover !important;
          }
        }
      `}</style>
    </div>
  );
};
export default DisplayImages;
