import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ContentsComponent from "../ContentsComponent";
import Loader from "../Loader.js";
import TopButton from "../TopButton";
import Table from 'react-bootstrap/Table';
import MetaTag from "../SEOMetaTag";

function CommentedProductList() {
  const location = useLocation()
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
  
  let [totalData, setTotalData] = useState([]);
  let [scrollId, setScrollId] = useState('first');
  let [moreFlag, setMoreFlag] = useState(true)
  let [loading, setLoading] = useState(true)
  let [empty, setEmpty] = useState(false)
  let [viewItems, setViewItems] = useState([])
  useEffect(() => {
    setLoading(true)
    setEmpty(false)
    let url = "https://api.fleaman.shop/product/hotdeal"
    axios.get(url)
      .then((result) => {
        let productData = result.data
        setTotalData(productData)
        setViewItems(productData.slice(0, 10))
        if (productData.length == 0){
          setMoreFlag(false)
          setEmpty(true)
        }
        else {
          setMoreFlag(true)
        }
      })
      .catch(() => {
        console.log('데이터 로드 실패')
      })
    }, []
  )

  useEffect(() => {
    setLoading(false)
  }, [totalData])

  
  function getNewPrice(price) {
    let nPrice = Math.round(price / 1000) * 1000
    nPrice = nPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return nPrice
  }


  if (loading){
    return (
      <Row xs={1} md={1} className="g-1">      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row>
    )
  }
  else if (empty){
    return (
      <div>
        <h2>
          검색 결과가 없습니다.
        </h2>
      </div>
    )
  }
  else {
    return(
      <div>
        <MetaTag title="commeted" desc={"플리맨 댓글 달린 물건들"} url={"https://fleaman.shop/commented"} keywords={", 댓글, 중고물품"} />

        
        <h4>핫딜 정보</h4>
        <h6>유용한 핫딜 정보를 확인해보세요</h6>
        <img
          alt=""
          src="/logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '} FleaMan
        <Row xs={1} md={1} className="g-1">
          {
            viewItems.map((cData, idx)=>{
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} reco={true}/> 

              )
            })
          }
        </Row>

        {
          moreFlag ? <Button style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let itemsLen = viewItems.length
            setViewItems(totalData.slice(0, itemsLen + 10))
            if (itemsLen + 10 >= totalData.length){
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

export default CommentedProductList;