import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchInput from "../SearchInput";
import MetaTag from "../SEOMetaTag";
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'


let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function ContentsList({searchKeyword}) {
  let a = useSelector((state) => state.bg )

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
      <H4 c={a == "light" ? "dark":"white"}>{categoryName}</H4>
      <H6 c={a == "light" ? "dark":"white"}>{itemName}</H6>  
      <SearchInput main={false}></SearchInput>
    </div>
  )

}

export default ContentsList;