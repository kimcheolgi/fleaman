import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Loader from "../Loader.js";
import ContentsComponent from "../ContentsComponent";
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';

function MainContentsList({searchKeyword}) {
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
  }, [])
  const [resize, setResize] = useState(window.innerWidth);
  let [searchItems, setSearchItems] = useState([]);
  let [isScrap, setIsScrap] = useState(true);
  const handleResize = () => {
    setResize(window.innerWidth);
  };
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchKeyword.length == 0){
      setIsScrap(true)
      setSearchItems(JSON.parse(localStorage.getItem('watched')))
    }
    else{
      setIsScrap(false)
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


  if (loading){
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
        <Row xs={1} md={1} className="g-1">         
          {
            searchItems.map((cData, idx)=>{
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
              )
            })
          }
        </Row>
      </div>
    )
  }
}

export default MainContentsList;