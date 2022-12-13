import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Loader from "../Loader.js";
import ContentsComponent from "../ContentsComponent";
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import TopButton from "../TopButton.js";
import MetaTag from "../SEOMetaTag.js";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import { Badge } from "react-bootstrap";




function MainContentsList() {
  let a = useSelector((state) => state.bg )
  const location = useLocation()
  let searchKeyword = location.search.split("query=")[1]
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
  }
  let [recommendItems, setRecommendItems] = useState([])
  let [viewItems, setViewItems] = useState([]);
  let [offset, setOffset] = useState(0)
  let count = 10
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
    let watchedItems = JSON.parse(localStorage.getItem('watched'))
    let itemLink = []
    if (watchedItems != undefined){
      itemLink = watchedItems.map((data, idx)=>{
        return data.link
      })
    }
    
    let url = "https://api.fleaman.shop/product/get-product?offset="+offset+"&count="+count

      axios.get(url)
        .then((result) => {
          let recommendData = result.data
          recommendData.map((reData, idx) => {
            if (itemLink.includes(String(reData.link)) != []) {
              reData.check = true
            }
            else{
              reData.check = false
            }
          })
          setOffset(offset + count)
          setViewItems(recommendData)
        })
        .catch(() => {
          console.log('데이터 로드 실패')
        })
  }, [])
  const [resize, setResize] = useState(window.innerWidth);
  let [searchItems, setSearchItems] = useState([]);
  let [isScrap, setIsScrap] = useState(true);
  let [isError, setIsError] = useState(false);
  const handleResize = () => {
    setResize(window.innerWidth);
  };
  let [loading, setLoading] = useState(false)
  let [moreFlag, setMoreFlag] = useState(true)

  useEffect(() => {
    setMoreFlag(true)
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
          setSearchItems(searchData)
          setViewItems(searchData.slice(0, 10))
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

  let [linkHash, setLinkHash] = useState("")
  const handleScrapShare = async () => {
    let scrapData = JSON.parse(localStorage.getItem('watched'))
    if (scrapData.length == 0) {
      alert("스크랩된 물품이 없습니다.")
    }
    else {
      axios.post("https://api.fleaman.shop/share/scrap", {
        data_list: scrapData
      }).then(function (response) {
        linkHash = response.data;
        setLinkHash(linkHash)
        console.log(linkHash)
      }).catch(function (error) {
        alert('링크 복사에 실패하였습니다.');
      });
    }
  };
  
  const handleCopyClipBoard = async (hash) => {
    if (hash != ""){
      try {
        await navigator.clipboard.writeText("https://fleaman.shop/share/scrap/" + hash);
        alert('링크가 복사되었습니다.');
      } catch (error) {
        alert('링크 복사에 실패하였습니다.');
      }
    }
  };

  useEffect(() => {
    handleCopyClipBoard(linkHash)
  }, [linkHash])


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
      <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row> 
    )
  }
  else if (isScrap) {
    return(
      <div>
        <Row xs={1} md={1} className="g-1">      
          <Card
            border={a == "light" ? null : "secondary"}
            className="mb-2"
            style={{textAlign: "left"}}
            bg={a == "light" ? null : "dark"}
            text={a == "light" ? "dark" : "light" }
          >
            <Card.Header>
              {/* <Card.Text>
                <img
                  alt=""
                  src="/logo.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{' '}
                스크랩
              </Card.Text> */}
              <Row>
                  <Col >
                    스크랩
                    <Button 
                      className="share"
                      variant="outline-secondary" 
                      style={{padding: "2px"}}
                      onClick={() => {
                        handleScrapShare()
                        // handleCopyClipBoard(linkHash)
                      }}> 
                    공유 링크 
                    </Button>
                  </Col>
                </Row>
            </Card.Header>
            <Card.Body>
            {
              searchItems.length == 0 ? 
                <Card 
                  style={{textAlign: "center", margin: "2%"}}
                  bg={a == "light" ? null : "secondary"}
                  text={a == 'light' ? "dark" : "light"}
                  >
                  <Col >
                    <img
                      alt=""
                      src="/spin4.gif"
                      width="30"
                      height="30"
                      className="d-inline-block align-top"
                    />
                    "
                    <Button variant="outline-warning" style={{margin: "2px", padding: "2px"}}>☆</Button>
                      버튼을 누르면 스크랩이 가능합니다."
                  </Col>
                </Card>
              : null
            }
            {
              searchItems.map((cData, idx)=>{

                return(
                  <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} real={true}/> 

                )
              })
            }
            </Card.Body>
          </Card>
        </Row>
        {viewItems.length == 0 ? 
          <Row xs={1} md={1} className="g-1" style={{height: "1024px"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
          </Row> 
          :        
        
        <Row xs={1} md={1} className="g-1">      
          <Card
            border={a == "light" ? null : "secondary"}
            className="mb-2"
            style={{textAlign: "left"}}
            bg={a == "light" ? null : "dark"}
            text={a == "light" ? "dark" : "light" }
          >
            <Card.Header>
              <Card.Text>
                <Badge bg="warning" style={{margin: "2px"}}> New</Badge>
                최근 댓글 달린 물건
              </Card.Text>  
            </Card.Header>
            <Card.Body>

              {
                viewItems.map((item, idx) => {
                  return (
                    <Row className="mt-2">
                      <ContentsComponent key={idx} cData={item} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} cate={true}/>
                    </Row>
                  )
                })
              }
          </Card.Body>
          </Card>
        </Row>
        }
      {
          moreFlag ? <Button style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
                        
            let url = "https://api.fleaman.shop/product/get-product?offset="+offset+"&count="+count
            axios.get(url)
              .then((result) => {
                let productData = result.data
                let copyData = [...viewItems]
                let dataCopy = [...copyData, ...productData]
                setViewItems([...new Set(dataCopy)])
                setOffset(offset + count)
                if (productData.length == 0){
                  setMoreFlag(false)
                }
              })
              .catch((error) => {
                if (error.response.status == 500){
                  window.location.reload();
                }
              })
          }}> More...</Button> : null
        }
        {
          resize < 1080 ? 
          <TopButton></TopButton> : null
        }
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
            viewItems.map((cData, idx)=>{
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
              )
            })
          }
        </Row>
        {
          moreFlag ? <Button style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let itemsLen = viewItems.length
            setViewItems(searchItems.slice(0, itemsLen + 10))
            if (itemsLen + 10 >= searchItems.length){
              setMoreFlag(false)
            }            

          }}> More...</Button> : null
        }
        {
          resize <= 1080 ? 
          <TopButton></TopButton> : null
        }
        
      </div>
    )
  }
}

export default MainContentsList;