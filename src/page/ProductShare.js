import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import MetaTag from "../SEOMetaTag";
import ContentsComponent from "../ContentsComponent";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from "react-redux"

function ProductShare() {
  let a = useSelector((state) => state.bg )

  const navigate = useNavigate();
  let { hash } = useParams();
  const [resize, setResize] = useState(window.innerWidth);
  let [inputValue, setInputValue] = useState('');

  const handleResize = () => {
    setResize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let [shareItems, setShareItems] = useState([]);

  useEffect(() => {
    let url = "https://api.fleaman.shop/share/get-product?link=" + hash
    axios.get(url)
      .then((result) => {
        let shareData = result.data
        setShareItems(shareData)
      })
      .catch(() => {
        console.log('데이터 로드 실패')
        alert('잘못된 링크입니다.')
        navigate('/');
      })
  }, [])

  const sumPrice = (data) => {
    let sumP = 0
    data.map((d, i) => {
      sumP += d.price
    })
    return sumP
  }

  return(
    <div style={{height: "1024px"}}>
      <MetaTag title={"물건 공유"} desc={"플리맨 물건 공유"} url={"https://fleaman.shop/share/product" + hash} keywords={"중고물품, 공유"} />
      <Card
        // border="warning" 
        className="mb-2 mt-5"
        style={{textAlign: "left"}}
        border={a == "light" ? null : "secondary"}
        bg={a == "light" ? null : "dark"}
        text={a == "light" ? "dark" : "light" }
      >
        <Card.Header>
          <Row>
              <Col md={8}>
                공유된 물건
              </Col>
            </Row>
        </Card.Header>
        </Card>
        {
          shareItems.map((cData, idx)=>{
            return(
              <ContentsComponent key={idx} cData={cData} resize={resize} scrap={false} setSearchItems={setShareItems} reco={false}/> 
            )
          })
        }
      
    </div>
  )

}

export default ProductShare;