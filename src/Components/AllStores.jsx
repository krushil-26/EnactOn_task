import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getStores } from "../apis/getStores";
import { useNavigate, useLocation } from "react-router-dom";

const AllStores = ({ className = "", setCategory, category }) => {
  const [data, setData] = useState([]);
  const [likedStores, setLikedStores] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Track the current page
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [status, setStatus] = useState("");
  const [alphabetOrder, setAlphabetOrder] = useState("");
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [isSharable, setIsSharable] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  console.log({category})

  const alphabet = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if(category){
      queryParams.set("cats", category);
    }
    navigate({ search: queryParams.toString() });
  }, [category])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    setCategory(queryParams.get("cats") || "");
    setStatus(queryParams.get("status") || "");
    setAlphabetOrder(queryParams.get("name_like") || "");
    setIsCashbackEnabled(queryParams.get("cashback_enabled") === "1");
    setIsPromoted(queryParams.get("is_promoted") === "1");
    setIsSharable(queryParams.get("is_sharable") === "1");
    setSortBy(queryParams.get("_sort"));
    console.log(queryParams.toString())
    // fetchProducts(queryParams); // Fetch products with the updated query params
  }, [location.search]);


  // Fetch stores data
  const fetchStoresData = async (currentPage = 1, query = "") => {
    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams.toString(), "dwuydw")
    const queryParamsObj = {};
        queryParams.forEach((value, key) => {
            if(key == "name_like"){
              queryParamsObj[key] = '^'+ value;
            }
            else{
              queryParamsObj[key] = value;
            }
        });
    try {
      const response = await getStores(currentPage, query, queryParamsObj); // Include query in API call
      const newStores = response?.data || [];

      console.log(newStores.length, "dwdywd")

      if(currentPage === 1 && newStores.length === 0){
        setData([])
      }

      if (newStores.length === 0) {
        setHasMore(false); // Stop fetching if no new data is returned
      } else {
        setData((prevData) => (currentPage === 1 ? newStores : [...prevData, ...newStores])); // Reset data on new search
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    setPage(1)
    fetchStoresData(1, searchQuery); // Fetch initial data or search results
  }, [searchQuery, location.search]); // Re-fetch data when the search query changes

  const handleCheckboxChange = (event, set, queryKey) => {
    const isChecked = event.target.checked;
    set(isChecked); // Update the state value
  
    const queryParams = new URLSearchParams(location.search); // Use current query params
    if (isChecked) {
      queryParams.set(queryKey, 1); // Set the query parameter to 1 if checked
    } else {
      queryParams.delete(queryKey); // Set the query parameter to 0 if unchecked
    }
  
    // Update the URL with new query parameters
    navigate({ search: queryParams.toString() });
  };
  

  // Handle sorting changes
  const handleSortChange = (event) => {
    const queryParams = new URLSearchParams(location.search);
    const newSortBy = event.target.value;
    setSortBy(newSortBy);

    if (newSortBy) {
      queryParams.set("_sort", newSortBy);
    } else {
      queryParams.delete("_sort"); // Remove the query parameter if empty
    }

    // After handling sorting change, fetch products with the updated query params
    navigate({ search: queryParams.toString() }); // Update the URL
  };

  // Handle alphabetical filter changes
  const handleAlphabetOrderChange = (letter) => {
    setAlphabetOrder(letter); // Update the alphabetical filter state

    const queryParams = new URLSearchParams(location.search);
    if (letter !== alphabetOrder) {
      queryParams.set("name_like", letter); // Set the letter filter
    } else {
      setAlphabetOrder(''); // Clear alphabet order if the same letter is clicked again
      queryParams.delete("name_like"); // Remove the filter if no letter selected
    }

    // After handling the alphabetical change, fetch products with the updated query params
    navigate({ search: queryParams.toString() }); // Update the URL
  };

  // Fetch more data when the user scrolls
  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStoresData(nextPage, searchQuery);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page when search query changes
    setHasMore(true); // Reset infinite scroll state
    setData([]); // Clear current data
  };

  const toggleLike = (e, storeId) => {
    e.stopPropagation()
    const updatedLikedStores = likedStores.includes(storeId)
      ? likedStores.filter((id) => id !== storeId)
      : [...likedStores, storeId];

    setLikedStores(updatedLikedStores);
    localStorage.setItem("likedStores", JSON.stringify(updatedLikedStores));
  };

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedStores")) || [];
    setLikedStores(storedLikes);
  }, []);

  console.log("efeff", data.length)

  return (
    <div className={`${className} bg-[antiquewhite] my-[50px] p-4`}>
      {/* Search Input */}
      <div className="flex justify-between gap-5">
        <div className="flex gap-5">
          <select
            className="h-8 rounded-lg"
            onChange={(e) => {
              const statusValue = e.target.value;
              const queryParams = new URLSearchParams(location.search);
              if (statusValue === "") {
                queryParams.delete("status"); // Remove status if empty
              } else {
                queryParams.set("status", statusValue); // Set the new status value
              }
              navigate({ search: queryParams.toString() }); // Update the URL
            }}
            value={status}
          >
            <option value="">All Status</option>
            <option value="publish">Active</option>
            <option value="draft">Coming Soon</option>
            <option value="trash">Discontinued</option>
          </select>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search stores by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full max-w-md px-4 py-2 h-8 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>
        <select onChange={handleSortChange} className="h-8 rounded-lg" value={sortBy}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="featured">Featured</option>
          <option value="clicks">Popularity</option>
          <option value="cashback">Cashback</option>
        </select>
      </div>

      {/* Alphabetical Filter */}
      <div style={{ display: "flex", gap: "5px" }} className="my-4">
        {alphabet.map((letter) => (
          <div className={`${alphabetOrder === letter ? "bg-green-500" : ''} bg-cyan-500 px-2 cursor-pointer rounded`} key={letter} onClick={() => handleAlphabetOrderChange(letter)}>
            {letter}
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 my-5">
      <input
        type="checkbox"
        checked={isCashbackEnabled}
        onChange={(e) => handleCheckboxChange(e, setIsCashbackEnabled, "cashback_enabled")}
        name="cashback_enabled"
      />Cashback Enabled

      <input
        type="checkbox"
        checked={isPromoted}
        onChange={(e) => handleCheckboxChange(e, setIsPromoted, "is_promoted")}
        name="is_promoted"
      />Promoted

      <input
        type="checkbox"
        checked={isSharable}
        onChange={(e) => handleCheckboxChange(e, setIsSharable, "is_sharable")}
        name="is_sharable"
      />Share & Earn

      </div>

      {data.length > 0 ? <InfiniteScroll
        dataLength={data.length} // Track data length
        next={fetchMoreData} // Function to load more data
        hasMore={hasMore} // Determines whether there are more items to load
        loader={
          <div className="text-center text-lg font-semibold">
            Loading more stores...
          </div>
        }
        endMessage={
          <div className="text-center text-gray-500 font-semibold mt-4">
            You have seen all the stores.
          </div>
        }
      >
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((obj, index) => (
            <div
              key={index}
              onClick={() => window.location.href = obj.homepage}
              className="w-48 h-56 rounded-3xl cursor-pointer bg-white p-4 shadow-lg flex flex-col justify-between"
            >
              <div className="flex justify-end">
              <button
                onClick={(e) => toggleLike(e, obj.id)}
                className={`top-2 w-fit right-2 p-1 rounded-full ${
                  likedStores.includes(obj.id) ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                ❤️
              </button>
              </div>
              <img
                src={obj.logo}
                alt={obj.name}
                className="w-full h-24 object-contain rounded-lg"
              />
              <div className="text-lg font-semibold mt-2 text-center truncate">
                {obj.name}
              </div>
              <div className="text-sm text-green-600 font-semibold mt-1 text-center truncate">
                {!obj?.cashback_enabled ? (
                  "No cashback available"
                ) : (
                  <>
                    {obj?.rate_type}{" "}
                    {obj?.amount_type === "fixed"
                      ? `$${parseFloat(obj?.cashback_amount || 0).toFixed(2)} Cashback`
                      : obj?.amount_type === "percent"
                        ? `${parseFloat(obj?.cashback_amount || 0).toFixed(2)}% Cashback`
                        : "Invalid cashback data"}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>: <div>No Records Found</div>}
    </div>
  );
};

export default AllStores;
