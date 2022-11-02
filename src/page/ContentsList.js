import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ContentsComponent from "../ContentsComponent";

function ContentsList(props) {
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
  let newItemName = itemName.replace(' ', '_')
  

  useEffect(() => {
    let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&scroll_id=first"
    console.log(url)
    axios.get(url)
      .then((result) => {
        let productData = result.data.data
        let productScrollId = result.data.scroll_id
        setTotalData(productData)
        setScrollId(productScrollId)
        if (productData.length == 0){
          setMoreFlag(false)
        }
        else {
          setMoreFlag(true)
        }
      })
      .catch(() => {
        console.log('데이터 로드 실패')
      })
    }, [categoryName, itemName]
  )
  

  return(
    <div>
      <h4>{categoryName}</h4>
      <h6>{itemName}</h6>
      <Row xs={1} md={1} className="g-4">
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
          let url = "https://api.fleaman.shop/product/search?category_large="+categoryName+"&category_medium="+newItemName+"&scroll_id="+scrollId
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

export default ContentsList;