const ProfileLoading = () => {
    return <div className="col w-full mb-24 rounded-lg">
    <div className="main-block flex justify-center items-center !border-0">
      <div className="col">
        <div className="main-block !border-0">
          <div className=" bg-gray-500 animate-pulse rounded-t w-full h-[150px]"></div>
          <div className="w-full flex justify-center -mt-[65px]">
            <div className="flex justify-center w-[125px] h-[125px] rounded-full animate-pulse bg-gray-600"></div>
          </div>
          <div className="w-full flex justify-center h-2 mt-8">
            <div className="bg-gray-400 animate-pulse w-24 h-4 rounded-xl"></div>
          </div>
          <div className="w-full flex justify-center h-2 mt-12 mb-24">
            <div className="bg-gray-400 animate-pulse w-[50%] h-4 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
export default ProfileLoading;