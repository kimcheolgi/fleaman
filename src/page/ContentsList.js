import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchInput from "../SearchInput";

function ContentsList({searchKeyword}) {
  let { categoryName, itemName } = useParams();
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
      <h4>{categoryName}</h4>
      <h6>{itemName}</h6>
      <SearchInput main={false}></SearchInput>
    </div>
  )
}

export default ContentsList;