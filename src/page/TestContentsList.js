import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ContentsComponent from "../ContentsComponent";
import Loader from "../Loader.js";
import TopButton from "../TopButton";
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from "react-redux"
import { useInView } from 'react-intersection-observer';
import QueryString from 'qs';


function TestContentsList() {
  let a = useSelector((state) => state.bg )
  let cred = localStorage.getItem('googleAccount')
  const [ref, inView] = useInView();
  const location = useLocation()
  const queryData = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  let searchKeyword = queryData.query
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
  }
  let searchPlatform = queryData.platform
  if (searchPlatform == "" || searchPlatform == undefined){
    searchPlatform = "전체 플랫폼"
  }
  let { categoryName, itemName } = useParams();
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
  let newItemName = itemName.replace(' ', '_').replace(' ', '_')
  let [loading, setLoading] = useState(true)
  let [empty, setEmpty] = useState(false)
  let [avgPrice, setAvgPrice] = useState(0)
  let [perPrice, setPerPrice] = useState([0, 0, 0])
  let [perPriceTrade, setPerPriceTrade] = useState([0, 0, 0])
  let priceState = ['저렴', '적당', '비쌈']

  useEffect(() => {
    setLoading(true)
    setEmpty(false)
    let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id=first&platform="+searchPlatform
    axios.get(url)
      .then((result) => {
        let productData = result.data.data
        let productScrollId = result.data.scroll_id
        // let productAvgPrice = result.data.agg_res.avg_aggs.value
        let productPerPrice = result.data.agg_res.percent_aggs.values
        let productPerPriceTrade = result.data.agg_res_trade.percent_aggs.values
        setTotalData(productData)
        setScrollId(productScrollId)
        // setAvgPrice(productAvgPrice)
        setPerPrice(productPerPrice)
        setPerPriceTrade(productPerPriceTrade)
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
    }, [categoryName, itemName, searchKeyword, searchPlatform]
  )

  useEffect(()=>{
    if(totalData.length !==0 && inView) {
      let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id="+scrollId+"&platform="+searchPlatform
      axios.get(url)
        .then((result) => {
          let productData = result.data.data
          let productScrollId = result.data.scroll_id
          let copyData = [...totalData]
          let dataCopy = [...copyData, ...productData]
          setTotalData(dataCopy)
          setScrollId(productScrollId)
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
  },[inView]);

  useEffect(() => {
    setLoading(false)
  }, [totalData])

  
  function getNewPrice(price) {
    let nPrice = Math.round(price / 1000) * 1000
    nPrice = nPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return nPrice
  }

  let new_price = getNewPrice(avgPrice);


  if (loading){
    return (
      <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row> 
    )
  }
  else if (empty){
    return (
      <div style={{height: "100vh"}}>
        <h2>
          검색 결과가 없습니다.
        </h2>
      </div>
    )
  }
  else {
    return(
      <div>
        {
          totalData.length == 0 ?
          <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
          </Row> 
          :
        
        <Row xs={1} md={1} className="g-1">
          <Table striped bordered className="mb-3"
            variant={a}
          >
            <thead>
              <tr>
                <th key={'key'}>{"구분"}</th>
                {
                  Object.keys(perPrice).map((key, i)=>{
                    return <th key={i}>{priceState[i]}</th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td key={"all"}>전체매물</td>
                {
                  Object.values(perPrice).map((value, i)=>{
                    return <td key={i}>{getNewPrice(value)}원</td>
                  })
                }            
              </tr>
              <tr>
                <td key={"trade"}>판매완료</td>
                {
                  Object.values(perPriceTrade).map((value, i)=>{
                    return <td key={i}>{cred != undefined ? getNewPrice(value)+"원" : "로그인 시 확인 가능"}</td>
                  })
                }            
              </tr>
            </tbody>

          </Table>
          
          {
            totalData.map((cData, idx)=>{
              if (idx % 5 == 3){
                return(
                  <>
                    <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} reco={false} ads={true}/> 
                    <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} cate={true}/>
                  </>
                )
              }
              else{
                return(
                  <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} cate={true}/>
                )
              }
            })
          }
        </Row>
        }

        {
          moreFlag ? <Button ref={ref} style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id="+scrollId+"&platform="+searchPlatform
            axios.get(url)
              .then((result) => {
                let productData = result.data.data
                let productScrollId = result.data.scroll_id
                let copyData = [...totalData]
                let dataCopy = [...copyData, ...productData]
                setTotalData(dataCopy)
                setScrollId(productScrollId)
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
          resize <= 1260 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

export default TestContentsList;