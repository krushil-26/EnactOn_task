import React, { useEffect, useState } from "react";
import { getCategories } from "../apis/getCategories";

const Categories = ({ className, category, setCategory }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    const getCategoriesData = async () => {
      const categories = await getCategories()
      setData(categories.data.data)
    }
    getCategoriesData()
  }, [])
  return (
    <div className={`${className} overflow-y-auto h-[100vh] my-[50px] p-3`}>
      <span className="mx-3 font-bold">Store Categories</span>
      <div className="mt-3 rounded-3xl bg-[antiquewhite] p-4 flex flex-col gap-3">
        {
          data.map((obj) => {
            return (
              <div onClick={() => setCategory(obj?.id)} className={`${obj?.id === category && "underline" } cursor-pointer`}>{obj?.name}</div>
            )
          })
        }
      </div>
    </div>
  );
};

export default Categories;
