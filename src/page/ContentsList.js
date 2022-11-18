import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchInput from "../SearchInput";
import MetaTag from "../SEOMetaTag";

function ContentsList({searchKeyword}) {
  let { categoryName, itemName } = useParams();
  let cate = categoryName + '/' +itemName
  const [resize, setResize] = useState(window.innerWidth);

  const handleResize = () => {
    setResize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return(
    <div>
      <MetaTag title={cate} desc={"플리맨 카테고리 검색 " + categoryName + " " + itemName} url={"https://fleaman.shop/" + categoryName + "/" + itemName} keywords={", " + categoryName + ", " + itemName} />

      {/* <MetaTag title={cate}/> */}
      <h4>{categoryName}</h4>
      <h6>{itemName}</h6>  
      <SearchInput main={false}></SearchInput>
    </div>
  )

}

export default ContentsList;