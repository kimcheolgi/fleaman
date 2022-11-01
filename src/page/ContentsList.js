import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';

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
            <Contents key={idx} cData={cData} resize={resize} />
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

const getDateDiff = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();
  
  return Math.floor(diffDate / (1000 * 60 * 60 * 24));
}


const getHourDiff = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();

  return Math.floor(diffDate / (1000 * 60 * 60));
}

function Contents({cData, resize}){
  let text_len = resize  >= 1080 ? 25 : 13
  let data_name = cData.title.length >= text_len ? cData.title.substr(0, text_len) + "..." : cData.title
  let price = cData.price;
  let new_price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let dateDiff = getDateDiff(cData.reg_date);
  let hourDiff = getHourDiff(cData.reg_date);
  let diffDate = dateDiff >= 1 ? dateDiff + "일 전" : hourDiff != 0 ? hourDiff + "시간 전" : "방금 전"

  return(
    <Col>
        <Card style={{padding: "10px", textAlign: "left"}}>

          <Row>
            <Col xs={3} md={3}>
              <Card.Img variant="top" src={cData.img_url} />
            </Col>
            <Col xs={9} md={9}>
              <Row>
                <Col xs={8} md={8}>
                  <Badge bg='light' text="dark">{cData.source}</Badge>
                  <ColoredBadge state={cData.state} />
                </Col>
                <Col xs={4} md={4} style={{textAlign: "right"}}>
                  <small className="text-muted">{diffDate}</small>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <a style={{color: "black"}} target="_blank" href={cData.link}>
                    <Card.Title>
                      {data_name}
                    </Card.Title>
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text>{new_price}원 </Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <small className="text-muted">
                    <Card.Text>
                      원문 좋아요 {cData.like_cnt} 원문 댓글 {cData.comment_cnt}
                    </Card.Text>
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* <Row>
            <InputGroup className="mb-1 mt-3">
              <Form.Control
                placeholder="의견 작성하기, 이용규칙을 지켜주세요."
                aria-label="comment"
                aria-describedby="basic-addon"
              />
              <Button variant="outline-secondary" id="button-addon">
                작성
              </Button>
            </InputGroup>
          </Row> */}
      </Card>
  </Col>
  )
}

function ColoredBadge({state}) {
  if (state == '판매완료'){
    return <Badge bg="danger">{state}</Badge>
  }
  else if (state == '판매중') {
    return <Badge bg="success">{state}</Badge>
  }
  else {
    return <Badge bg="warning">{state}</Badge>
  }
}

export default ContentsList;