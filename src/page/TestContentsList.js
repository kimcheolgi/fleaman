import { useParams } from "react-router-dom";
import data from './../data.js'
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';


function TestContentsList(props) {
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


  let { categoryName, itemName } = useParams();
  let [totalData, setTotalData] = useState(data[0].contents);

  return(
    <div>
      <h4>{categoryName}</h4>
      <h6>{itemName}</h6>
      <Row xs={2} md={3} className="g-4">
      {
        totalData.map((cData, idx)=>{
          return(
            <Contents key={idx} cData={cData} resize={resize} />
          )
        })
      }
      </Row>

      <Button style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
        let copyData = [...totalData]
        let sliceData = copyData.slice(0,12)
        let dataCopy = [...copyData, ...sliceData]
        setTotalData(dataCopy)
      }}> More...</Button> 
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
  let text_len = resize  >= 1080 ? 15 : 13
  let data_name = cData.name.length >= text_len ? cData.name.substr(0, text_len) + "..." : cData.name
  let price = cData.price;
  let new_price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let dateDiff = getDateDiff(cData.date);
  let hourDiff = getHourDiff(cData.date);
  let diffDate = dateDiff >= 1 ? dateDiff + "일 전" : hourDiff = "시간 전"

  return(
    <Col>
      <a style={{color: "black"}} target="_blank" href="https://codingapple.com/">
        <Card>
        <Card.Img variant="top" src={cData.image} />
        <Card.ImgOverlay>
          <Card.Title>
            <Badge bg='light' text="dark">{cData.source}</Badge>
            <ColoredBadge state={cData.state} />
          </Card.Title>

        </Card.ImgOverlay>
        <Card.Body>
          <Card.Text>
            {data_name}
          </Card.Text>
          <Card.Title>{new_price}원 </Card.Title>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{diffDate}</small>
        </Card.Footer>
      </Card>
    </a>
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

export default TestContentsList;