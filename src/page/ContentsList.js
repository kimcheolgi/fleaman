import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchInput from "../SearchInput";
import Kibana from "../kibana";

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

  if (categoryName == 'Mac' && itemName == 'Macbook Air'){
    return(
      <div>
        <h4>{categoryName}</h4>
        <h6>{itemName}</h6>
        {/* { resize >= 1470 ? <Kibana></Kibana> : null} */}
        <SearchInput main={false}></SearchInput>
      </div>
    )
  }
  else{
    return(
      <div>
        <h4>{categoryName}</h4>
        <h6>{itemName}</h6>  
        <SearchInput main={false}></SearchInput>
      </div>
    )
  }

}

export default ContentsList;