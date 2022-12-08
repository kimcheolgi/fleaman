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
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'


let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function CommentedProductList() {
  let a = useSelector((state) => state.bg )

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
        <MetaTag title="hotdeal" desc={"플리맨 핫딜 정보"} url={"https://fleaman.shop/hotdeal"} keywords={", 핫딜, 핫딜 정보, 뽐뿌, 루리웹, 클리앙, 쿨엔조이"} />


        <H4 c={a == "light" ? "dark":"white"}>핫딜 정보</H4>
        <H6 c={a == "light" ? "dark":"white"}>유용한 핫딜 정보를 확인해보세요</H6>  
        
        {
          viewItems.length == 0 ?
          <Row xs={1} md={1} className="g-1" style={{height: "1024px"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
          </Row> 
          :
          <Row xs={1} md={1} className="g-1">
            {
              viewItems.map((cData, idx)=>{
                return(
                  <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} reco={false}/> 

                )
              })
            }
          </Row>
        }   

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