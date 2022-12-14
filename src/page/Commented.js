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

let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function Commented() {
  let a = useSelector((state) => state.bg )
  const [ref, inView] = useInView();
  let navigate = useNavigate();

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
          setOffset(offset + count)
          setViewItems(recommendData)
        })
        .catch(() => {
          console.log('데이터 로드 실패')
        })
  }, [])

  useEffect(()=>{
    if(viewItems.length !==0 && inView) {
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
    }   
  }, [inView]);

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
        <MetaTag title="hotdeal" desc={"플리맨 핫딜 정보"} url={"https://fleaman.shop/hotdeal"} keywords={", 핫딜, 핫딜 정보, 뽐뿌, 루리웹, 클리앙, 쿨엔조이"} />


        <H4 c={a == "light" ? "dark":"white"}>댓글 달린 물건</H4>
        <H6 c={a == "light" ? "dark":"white"}>어떤 물건에 댓글이 달렸는지 확인해보세요</H6> 

        {viewItems.length == 0 ? 
          <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
          </Row> 
          :        
        
        <Row xs={1} md={1} className="g-1">
          {
            viewItems.map((item, idx) => {
              return (
                  <ContentsComponent key={idx} cData={item} resize={resize} scrap={isScrap} setSearchItems={setSearchItems} cate={true}/>
              )
            })
          }
        </Row>
        }
      {
          moreFlag ? <Button ref={ref} style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
                        
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
          resize <= 1080 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

export default Commented;