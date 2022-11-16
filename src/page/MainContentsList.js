import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Loader from "../Loader.js";
import ContentsComponent from "../ContentsComponent";
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import TopButton from "../TopButton.js";
import MetaTag from "../SEOMetaTag.js";


function MainContentsList() {
  const location = useLocation()
  let searchKeyword = location.search.split("query=")[1]
  console.log(searchKeyword)
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
  }
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
  }, [])
  const [resize, setResize] = useState(window.innerWidth);
  let [searchItems, setSearchItems] = useState([]);
  let [isScrap, setIsScrap] = useState(true);
  let [isError, setIsError] = useState(false);
  const handleResize = () => {
    setResize(window.innerWidth);
  };
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchKeyword.length == 0 || searchKeyword == '_'){
      setIsScrap(true)
      setSearchItems(JSON.parse(localStorage.getItem('watched')))
    }
    else{
      setIsScrap(false)
      setLoading(true)
      console.log(loading)
      let url = "https://api.fleaman.shop/product/main-search?keyword="+searchKeyword
      axios.get(url)
        .then((result) => {
          let searchData = result.data
          console.log(searchData)
          setSearchItems(searchData)
          setIsError(false)
        })
        .catch(() => {
          console.log('데이터 로드 실패')
          setIsError(true)
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

  if (isError){
    return (
      <div>
        <h2>
          잠시 후 다시 시도해주세요.
        </h2>
      </div>
    )
  }
  else if (loading){
    return (
      <Row xs={1} md={1} className="g-1">      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row>
    )
  }
  else if (isScrap) {
    return(
      <div>
        <Row xs={1} md={1} className="g-1">      
          <Card
            // border="warning" 
            className="mb-2"
            style={{textAlign: "left"}}
          >
            <Card.Header>
              <Card.Text>
                <img
                  alt=""
                  src="/logo.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{' '}
                스크랩
              </Card.Text>  
            </Card.Header>
            <Card.Body>
            {
              searchItems.map((cData, idx)=>{

                return(
                  <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
                )
              })
            }
            </Card.Body>
          </Card>
        </Row>
      </div>
    )
  }
  else if (!isScrap) {
    return(
      <div>
        <MetaTag title={searchKeyword} desc="플리맨 통합 검색" url={"https://fleaman.shop/?query=" + searchKeyword}/>
        {/* <MetaTag title={searchKeyword}/> */}
        <Row xs={1} md={1} className="g-1">         
          {
            searchItems.map((cData, idx)=>{
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
              )
            })
          }
        </Row>
        {
          resize < 1080 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

export default MainContentsList;