import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Loader from "../Loader.js";
import ContentsComponent from "../ContentsComponent";
import Nav from 'react-bootstrap/Nav';

function MainContentsList({searchKeyword}) {
  const [resize, setResize] = useState(window.innerWidth);
  let [searchItems, setSearchItems] = useState([]);
  let [isScrap, setIsScrap] = useState(true);
  const handleResize = () => {
    setResize(window.innerWidth);
  };
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    
    if (searchKeyword.length == 0){
      setIsScrap(false)
      setSearchItems(JSON.parse(localStorage.getItem('watched')))
    }
    else{
      setIsScrap(true)
      setLoading(true)

      let url = "https://api.fleaman.shop/product/main-search?keyword="+searchKeyword
      axios.get(url)
        .then((result) => {
          let searchData = result.data
          console.log(searchData)
          setSearchItems(searchData)
        })
        .catch(() => {
          console.log('데이터 로드 실패')
        })  

    }

  }, [searchKeyword])

  useEffect(() => {
    setLoading(false)
  }, [searchItems])

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let { categoryName, itemName } = useParams();

  if (loading){
    return <Loader type="balls" color="#E5FFCC" message="로딩중입니다" />
  }
  else {
    return(
      <div>

        <Row xs={1} md={1} className="g-1">
          {
            isScrap ? null : <h3> 즐겨찾기 </h3>
          }
        {
          searchItems.map((cData, idx)=>{
            if (isScrap) {
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={true}/> 
              )
            }
            else {
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false}/> 
              )
            }
          })
        }
        </Row>
      </div>
    )
  }
}

export default MainContentsList;