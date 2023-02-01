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
import AdSense from 'react-adsense';

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
          console.log('데이터 로드 실패')
        })
  }, [])
  let [communityData, setCommunityData] = useState([])
  useEffect(() => {
    let url = "https://api.fleaman.shop/table/tables?type=table&page=1"
      axios.get(url)
        .then((result) => {
          let coData = result.data
          setCommunityData(coData[0].slice(0, 5))
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
  let [empty, setEmpty] = useState(false)
  useEffect(() => {
    setMoreFlag(true)
    setEmpty(false)
    if (searchKeyword.length == 0 || searchKeyword == '_'){
      setIsScrap(true)
      setSearchItems(JSON.parse(localStorage.getItem('watched')))
    }
    else{
      setIsScrap(false)
      setLoading(true)
      let url = "https://api.fleaman.shop/product/main-search?keyword="+searchKeyword
      if (searchPlatform != undefined){
        url = "https://api.fleaman.shop/product/main-search?keyword="+searchKeyword+"&platform="+searchPlatform
      }
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

  const deleteScrap = () => {
    localStorage.setItem('watched', JSON.stringify([]))
  }

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
          잠시 후 다시 시도해주세요.
        </h2>
      </div>
    )
  }
  else if (empty){
    return (
      <div style={{height: "100vh"}}>
        <h2>
          검색결과가 없습니다.
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
              
              <Row>
                스크랩
                <Col 
                  className="right_button"
                  style={{paddingRight: "0px"}}
                >
                  <Button 
                    variant={a == "light"? "outline-secondary":"secondary"} 
                    style={{padding: "2px", marginRight: "5px"}}
                    onClick={() => {
                      if (window.confirm("정말 삭제합니까?")) {
                        deleteScrap()
                        window.location.reload()
                      } else {
                        alert("삭제가 취소됩니다");
                      }
                    }}> 
                  전부 삭제 
                  </Button>
                  <Button 
                    variant={a == "light"? "outline-secondary":"secondary"} 
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
                      스크랩
                    </Button>
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
            {/* </Card.Body> */}
        </Row>
        <Row xs={1} md={1} className="g-1 mt-5">      
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

              <Card.Text>
                최근 게시물
                <a href="/community/1">
                <Button 
                  className="more"
                  variant={a == "light"? "outline-secondary":"secondary"} 
                  style={{padding: "2px"}}
                  onClick={() => {
                    // window.location.href("/commented")
                    // navigate("/commented")
                  }}> 
                  더 보기..
                </Button>
                </a>
              </Card.Text>
            </Card.Header>
          </Card>

          {
            communityData.map((cData, idx)=>{
              return(
                  <CommunityComponent key={idx} cData={cData} a={a}/> 
                )
            })
          }
        </Row>
        {viewItems.length == 0 ? 
          <Row xs={1} md={1} className="g-1" style={{height: "1024px"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
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
                {/* <Badge bg="warning" style={{margin: "2px"}}> New</Badge> */}
                최근 댓글 달린 물건
                <a href="/commented">
                <Button 
                  className="more"
                  variant={a == "light"? "outline-secondary":"secondary"} 
                  style={{padding: "2px"}}
                  onClick={() => {
                    // window.location.href("/commented")
                    // navigate("/commented")
                  }}> 
                  더 보기..
                </Button>
                </a>
              </Card.Text>  
            </Card.Header>

            </Card>

            {/* <Card.Body> */}

              {
                viewItems.map((item, idx) => {
                  if (idx % 5 == 3){
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
                  더 보기..
                </Button>
                </a>
          {/* </Card.Body> */}
        </Row>
        }
        {
          resize < 1080 ? 
          <TopButton></TopButton> : null
        }
        <div className='mt-5'>
          {/* <AdSense.Google
            style={{ display: 'block' }}
            client='ca-pub-3213525149688431'
            slot='5111538528'
            format='auto'
            responsive="true"
          /> */}
          {/* <AdSense.Google
            style={{ display: 'block' }}
            client='ca-pub-3213525149688431'
            slot='1373843183'
            format='autorelaxed'
            // responsive="true"
          /> */}
        </div>
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
              if (idx % 5 == 3){
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


function CommunityComponent({ cData, a }) {
  return (
    <Card 
      className='mt-1'
      body={false} 
      style={{padding: "5px", textAlign: "left"}}
      bg={a == "light" ? null : "dark"}
      text={a == "light" ? "dark" : "light" }
    >
      <a 
        href={'/content/'+cData._id}
        onClick={() => {
          console.log("test")
        }}
        style={{color: a == "light" ? "black" : "white"}}
      >
        <Row>
          <Col md={12}>
            <Badge style={{marginRight: "10px"}} bg="light" text='dark'>
              {cData.category}
            </Badge>
            {cData.title} 
            <span style={{color: "gray"}}>
              [{cData.comment_cnt}]
            </span>
          </Col>
        </Row>
      </a>
    </Card>
  )
}

export default MainContentsList;
