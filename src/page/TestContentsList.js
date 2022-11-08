import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ContentsComponent from "../ContentsComponent";
import Loader from "../Loader.js";


function TestContentsList() {
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


  useEffect(() => {
    setLoading(true)
    setEmpty(false)
    let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&keyword="+searchKeyword+"&scroll_id=first"
    console.log(url)
    axios.get(url)
      .then((result) => {
        let productData = result.data.data
        let productScrollId = result.data.scroll_id
        setTotalData(productData)
        setScrollId(productScrollId)
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

  useEffect(() => {
    setLoading(false)
  }, [totalData])

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
        <Row xs={1} md={1} className="g-1">
        {
          totalData.map((cData, idx)=>{
            return(
              <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} />
            )
          })
        }
        </Row>

        {
          moreFlag ? <Button style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
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
      </div>
    )
  }
}

export default TestContentsList;