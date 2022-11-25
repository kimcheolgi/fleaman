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




function MainContentsList() {
  const location = useLocation()
  let searchKeyword = location.search.split("query=")[1]
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
  }
  let [recommendItems, setRecommendItems] = useState({"mac": [], "ipad": [], "iphone": [], 'gpu': []})
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
    let url = "https://api.fleaman.shop/product/recommend"
      axios.get(url)
        .then((result) => {
          let recommendData = result.data
          setRecommendItems(recommendData)
        })
        .catch(() => {
          console.log('데이터 로드 실패')
        })
  }, [])
  const [resize, setResize] = useState(window.innerWidth);
  let [searchItems, setSearchItems] = useState([]);
  let [viewItems, setViewItems] = useState([]);
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
          setViewItems(searchData.slice(0, 20))
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
      // const requestOptions = {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ data_list: scrapData })
      // };
      // fetch('https://api.fleaman.shop/share/scrap', requestOptions)
      //     .then(response => response.json())
      //     .then(data => 
      //       console.log(data)
      //       // linkHash = data.data
      //       );
  
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
    try {
      await navigator.clipboard.writeText("https://fleaman.shop/scrap/share/" + hash);
      alert('링크가 복사되었습니다.');
    } catch (error) {
      alert('링크 복사에 실패하였습니다.');
    }
  };




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
                  <Col md={8}>
                    <img
                    alt=""
                    src="/logo.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                  />{' '}
                    스크랩
                  </Col>
                  <Col md={4} style={{textAlign: "right"}}>
                    <Button 
                      variant="secondary" 
                      style={{padding: "2px"}}
                      onClick={() => {
                        handleScrapShare()
                        handleCopyClipBoard(linkHash)
                      }}> 
                    공유 링크 
                    </Button>
                  </Col>
                </Row>
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
                플리추천
              </Card.Text>  
            </Card.Header>
            <Card.Body>
          <Tabs
            defaultActiveKey="mac"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
              <Tab eventKey="mac" title="Mac">
              {
                recommendItems.mac.map((item, idx) => {
                  return (
                    <ContentsComponent key={idx} cData={item} resize={resize} scrap={false} setSearchItems={setSearchItems} reco={true}/> 
                  )
                })
              }
              </Tab>

            <Tab eventKey="ipad" title="iPad">
              {
                recommendItems.ipad.map((item, idx) => {
                  return (
                    <ContentsComponent key={idx} cData={item} resize={resize} scrap={false} setSearchItems={setSearchItems} reco={true}/> 
                  )
                })
              }
            </Tab>
            <Tab eventKey="iphone" title="iPhone">
              {
                recommendItems.iphone.map((item, idx) => {
                  return (
                    <ContentsComponent key={idx} cData={item} resize={resize} scrap={false} setSearchItems={setSearchItems} reco={true}/> 
                  )
                })
              }
            </Tab>
            <Tab eventKey="gpu" title="GPU">
              {
                recommendItems.gpu.map((item, idx) => {
                  return (
                    <ContentsComponent key={idx} cData={item} resize={resize} scrap={false} setSearchItems={setSearchItems} reco={true}/> 
                  )
                })
              }
            </Tab>
          </Tabs>
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
            setViewItems(searchItems.slice(0, itemsLen + 20))
            if (itemsLen + 20 >= searchItems.length){
              setMoreFlag(false)
            }            

          }}> More...</Button> : null
        }
        {
          resize < 1080 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

export default MainContentsList;