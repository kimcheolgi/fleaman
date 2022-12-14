import { useLocation, useNavigate } from "react-router-dom";
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
import { useInView } from 'react-intersection-observer';
import QueryString from 'qs';

function MainContentsList() {
  let a = useSelector((state) => state.bg )
  const [ref, inView] = useInView();
  let navigate = useNavigate();

  const location = useLocation()
  const queryData = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  let searchKeyword = queryData.query
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
  }
  let searchPlatform = queryData.platform
  let [recommendItems, setRecommendItems] = useState([])
  let [viewItems, setViewItems] = useState([]);
  let [offset, setOffset] = useState(0)
  let count = 5
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
          console.log('????????? ?????? ??????')
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
  let [empty, setEmpty] = useState(false)
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
      if (searchPlatform != undefined){
        url = "https://api.fleaman.shop/product/main-search?keyword="+searchKeyword+"&platform="+searchPlatform
      }
      console.log(url)
      axios.get(url)
        .then((result) => {
          let searchData = result.data
          setSearchItems(searchData)
          setViewItems(searchData.slice(0, 10))
          setIsError(false)
          if (searchData.length == 0){
            setEmpty(true)
          }
        })
        .catch(() => {
          console.log('????????? ?????? ??????')
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

  const deleteScrap = () => {
    localStorage.setItem('watched', JSON.stringify([]))
  }

  const handleScrapShare = async () => {
    let scrapData = JSON.parse(localStorage.getItem('watched'))
    if (scrapData.length == 0) {
      alert("???????????? ????????? ????????????.")
    }
    else {
      axios.post("https://api.fleaman.shop/share/scrap", {
        data_list: scrapData
      }).then(function (response) {
        linkHash = response.data;
        setLinkHash(linkHash)
        console.log(linkHash)
      }).catch(function (error) {
        alert('?????? ????????? ?????????????????????.');
      });
    }
  };
  
  const handleCopyClipBoard = async (hash) => {
    if (hash != ""){
      try {
        await navigator.clipboard.writeText("https://fleaman.shop/share/scrap/" + hash);
        alert('????????? ?????????????????????.');
      } catch (error) {
        alert('?????? ????????? ?????????????????????.');
      }
    }
  };

  useEffect(() => {
    handleCopyClipBoard(linkHash)
  }, [linkHash])

  useEffect(()=>{
    if(viewItems.length !==0 && inView) {
      let itemsLen = viewItems.length
      setViewItems(searchItems.slice(0, itemsLen + 10))
      if (itemsLen + 10 >= searchItems.length){
        setMoreFlag(false)
      }
    }   
  }, [inView]);

  if (isError){
    return (
      <div style={{height: "100vh"}}>
        <h2>
          ?????? ??? ?????? ??????????????????.
        </h2>
      </div>
    )
  }
  else if (empty){
    return (
      <div style={{height: "100vh"}}>
        <h2>
          ??????????????? ????????????.
        </h2>
      </div>
    )
  }
  else if (loading){
    return (
      <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
        <Loader type="spokes" color="#E5FFCC" message="??????????????????" />
      </Row> 
    )
  }
  else if (isScrap) {
    return(
      <div>
        <Row xs={1} md={1} className="g-1">      
          <Card
            // border={a == "light" ? null : "secondary"}
            className="mb-2"
            style={{
              textAlign: "left",
              border: "1px solid #00000000"
            }}
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
                ?????????
              </Card.Text> */}
              <Row>
                ?????????
                <Col 
                  className="right_button"
                  style={{paddingRight: "0px"}}
                >
                  <Button 
                    variant={a == "light"? "outline-secondary":"secondary"} 
                    style={{padding: "2px", marginRight: "5px"}}
                    onClick={() => {
                      if (window.confirm("?????? ????????????????")) {
                        deleteScrap()
                        window.location.reload()
                      } else {
                        alert("????????? ???????????????");
                      }
                    }}> 
                  ?????? ?????? 
                  </Button>
                  <Button 
                    variant={a == "light"? "outline-secondary":"secondary"} 
                    style={{padding: "2px"}}
                    onClick={() => {
                      handleScrapShare()
                      // handleCopyClipBoard(linkHash)
                    }}> 
                  ?????? ?????? 
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            </Card>

            {/* <Card.Body> */}
            {
              searchItems.length == 0 ? 
                <Card 
                  className="mb-2"
                  style={{textAlign: "center"}}
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
                    <Button variant={a == "light"? "outline-secondary":"secondary"} 
                    style={{
                      margin: "2px", padding: "2px", border: "1px solid black"
                    }}>
                      ?????????
                    </Button>
                    ????????? ????????? ???????????? ???????????????."
                  </Col>
                </Card>
              : null
            }
            {
              searchItems.map((cData, idx)=>{
                if (idx % 10 == 3){
                  return(
                    <>
                      <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} reco={false} ads={true}/> 
                      <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} real={true}/> 
                    </>
                  )
                }
                else{
                  return(
                    <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} real={true}/> 
                    )
                }
              })
            }
            {/* </Card.Body> */}
        </Row>
        {viewItems.length == 0 ? 
          <Row xs={1} md={1} className="g-1" style={{height: "1024px"}}>      
            <Loader type="spokes" color="#E5FFCC" message="??????????????????" />
          </Row> 
          :        
        
        <Row xs={1} md={1} className="g-1 mt-5">      
          <Card
            // border={a == "light" ? null : "secondary"}
            className="mb-2"
            style={{
              textAlign: "left",
              border: "1px solid #00000000"
              // borderBottomColor: "white"
            }}
            bg={a == "light" ? null : "dark"}
            text={a == "light" ? "dark" : "light" }
          >
            <Card.Header>
              <Card.Text>
                <Badge bg="warning" style={{margin: "2px"}}> New</Badge>
                ?????? ?????? ?????? ??????
                <a href="/commented">
                <Button 
                  className="more"
                  variant={a == "light"? "outline-secondary":"secondary"} 
                  style={{padding: "2px"}}
                  onClick={() => {
                    // window.location.href("/commented")
                    // navigate("/commented")
                  }}> 
                  ??? ??????..
                </Button>
                </a>
              </Card.Text>  
            </Card.Header>

            </Card>

            {/* <Card.Body> */}

              {
                viewItems.map((item, idx) => {
                  if (idx % 10 == 3){
                    return(
                      <>
                        <ContentsComponent key={idx} cData={item} resize={resize} scrap={false} reco={false} ads={true}/> 
                        <ContentsComponent key={idx} cData={item} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} cate={true}/>
                      </>
                    )
                  }
                  else{
                    return(
                      <ContentsComponent key={idx} cData={item} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} cate={true}/>
                      )
                  }
                })
              }
            <a href="/commented">
                <Button 
                  className="mt-3 mb-5"
                  variant={a == "light"? "outline-secondary":"secondary"} 
                  style={{padding: "10px"}}
                  onClick={() => {
                    // window.location.href("/commented")
                    // navigate("/commented")
                  }}> 
                  ??? ??????..
                </Button>
                </a>
          {/* </Card.Body> */}
        </Row>
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
        <MetaTag title={searchKeyword} desc="????????? ?????? ??????" url={"https://fleaman.shop/?query=" + searchKeyword}/>
        {/* <MetaTag title={searchKeyword}/> */}
        <Row xs={1} md={1} className="g-1">         
          {
            viewItems.map((cData, idx)=>{
              if (idx % 10 == 3){
                return(
                  <>
                    <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} reco={false} ads={true}/> 
                    <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
                  </>
                )
              }
              else{
                return(
                  <ContentsComponent key={idx} cData={cData} resize={resize} scrap={isScrap} setSearchItems={setSearchItems}/> 
                  )
              }
            })
          }
        </Row>
        {
          moreFlag ? <Button ref={ref} style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let itemsLen = viewItems.length
            setViewItems(searchItems.slice(0, itemsLen + 10))
            if (itemsLen + 10 >= searchItems.length){
              setMoreFlag(false)
            }            

          }}> More...</Button> : null
        }
        {
          resize <= 1260 ? 
          <TopButton></TopButton> : null
        }
        
      </div>
    )
  }
}

export default MainContentsList;