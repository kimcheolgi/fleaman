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


function TestContentsList() {
  let a = useSelector((state) => state.bg )
  const [ref, inView] = useInView();

  const location = useLocation()
  let searchKeyword = location.search.split("query=")[1]
  console.log(searchKeyword)
  if (searchKeyword == "" || searchKeyword == undefined){
    searchKeyword = '_'
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
  let priceState = ['저렴', '적당', '비쌈']

  useEffect(() => {
    setLoading(true)
    setEmpty(false)
    let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id=first"
    console.log(url)
    axios.get(url)
      .then((result) => {
        let productData = result.data.data
        let productScrollId = result.data.scroll_id
        let productAvgPrice = result.data.agg_res.avg_aggs.value
        let productPerPrice = result.data.agg_res.percent_aggs.values
        setTotalData(productData)
        setScrollId(productScrollId)
        setAvgPrice(productAvgPrice)
        setPerPrice(productPerPrice)
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
    }, [categoryName, itemName, searchKeyword]
  )

  useEffect(()=>{
    if(totalData.length !==0 && inView) {
      let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id="+scrollId
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
                {
                  Object.keys(perPrice).map((key, i)=>{
                    return <th key={i}>{priceState[i]}</th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                {
                  Object.values(perPrice).map((value, i)=>{
                    return <td key={i}>{getNewPrice(value)}원</td>
                  })
                }            
              </tr>
            </tbody>

          </Table>
          
          {
            totalData.map((cData, idx)=>{
              return(
                <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} cate={true}/>
              )
            })
          }
        </Row>
        }

        {
          moreFlag ? <Button ref={ref} style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id="+scrollId
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
          resize <= 1080 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

export default TestContentsList;