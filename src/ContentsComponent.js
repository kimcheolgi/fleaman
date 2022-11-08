import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import { parseJwt} from './utils.js'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState, lazy, Suspense, useEffect } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

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


function ContentsComponent({cData, resize, scrap, setSearchItems}){
  let [accountFlag, setAccountFlag] = useState(false);
  let [accountInfo, setAccountInfo] = useState([]);
  let [checked, setChecked] = useState(false);
  let [initCheck, setInitCheck] = useState(false);

  useEffect(() => {
    // let cred = localStorage.getItem('googleAccount')
    // if (cred != undefined){
    //   setAccountFlag(true)
    //   let userInfo = parseJwt(cred)
    //   setAccountInfo(userInfo)
    // }
    let watchedItems = JSON.parse(localStorage.getItem('watched'))
    let itemLink = []
    if (watchedItems != undefined){
      itemLink = watchedItems.map((data, idx)=>{
        return data.link
      })
    }
    if (itemLink.includes(String(cData.link)) != []) {
      setChecked(true)
    }
  }, [])
  
  useEffect(() => {

    let watchedItems = JSON.parse(localStorage.getItem('watched'))
    let itemLink = []
    if (watchedItems != undefined){
      itemLink = watchedItems.map((data, idx)=>{
        return data.link
      })
    }
    if (checked){
      if (watchedItems == undefined){
        localStorage.setItem('watched', JSON.stringify([cData]))
      }
      else if (itemLink.includes(String(cData.link)) == []) {
        let newItems = [...watchedItems, cData]
        localStorage.setItem('watched', JSON.stringify(newItems))
      }
    }
    else {
      if (itemLink.includes(String(cData.link)) != [] && initCheck) {
        let newItems = watchedItems.filter((it) => it.link !== cData.link);
        localStorage.setItem('watched', JSON.stringify(newItems))
      }
      if (!initCheck){
        setInitCheck(!initCheck)
      }
    }

    if (scrap){
      setSearchItems(JSON.parse(localStorage.getItem('watched')))
    }

    if (watchedItems != undefined){
      itemLink = watchedItems.map((data, idx)=>{
        return data.link
      })
    }
    if (itemLink.includes(String(cData.link)) != [] && scrap) {
      console.log('aa')
      setChecked(true)
    }
  }, [checked])
  

  let text_len = resize  >= 1080 ? 25 : 13
  let data_name = cData.title.length >= text_len ? cData.title.substr(0, text_len) + "..." : cData.title
  let price = cData.price;
  let new_price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let dateDiff = getDateDiff(cData.reg_date);
  let hourDiff = getHourDiff(cData.reg_date);
  let diffDate = dateDiff >= 1 ? dateDiff + "일 전" : hourDiff != 0 ? hourDiff + "시간 전" : "방금 전"

  if (scrap){
    return (
      <Col className='mt-2'>
        <Card style={{padding: "5px", textAlign: "left"}}>
          <Row>
            <Col>
              <Row>
                <Col xs={8} md={8}>
                  <Badge bg='light' text="dark">{cData.source}</Badge>
                  <ColoredBadge state={cData.state} />
                </Col>
                <Col xs={4} md={4} style={{textAlign: "right"}}>
                  <small className="text-muted">{diffDate}</small>
                </Col>
              </Row>
              <Row>
                <Col xs={8} md={8}>
                  <a style={{color: "black"}} target="_blank" href={cData.link}>
                    <Card.Title>
                      {data_name}
                    </Card.Title>
                  </a>
                </Col>
                <Col xs={4} md={4} style={{textAlign: "right"}}>
                  <Row>
                    <Card.Text>{new_price}원 </Card.Text>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        size='sm'
                        type="checkbox"
                        variant="outline-warning"
                        checked={checked}
                        value="1"
                        onClick={(e) => {
                          setChecked(!e.currentTarget.checked)
                        }}
                      >
                        {checked ? "★" : "☆"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              
            </Col>
          </Row>
        </Card>
    </Col>
  )
}
else{
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
                <Col xs={9} md={9} >
                  <small className="text-muted">
                    <Card.Text>
                      원문 좋아요 {cData.like_cnt} 원문 댓글 {cData.comment_cnt}
                    </Card.Text>
                  </small>
                </Col>
                <Col xs={3} md={3} style={{textAlign: "right"}}>
                  <Button
                    className="mb-1"
                    size='sm'
                    type="checkbox"
                    variant="outline-warning"
                    checked={checked}
                    value="1"
                    onClick={(e) => {
                      setChecked(!e.currentTarget.checked)
                    }}
                  >
                    {checked ? "★" : "☆"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* {
            accountFlag ?   
              <Row>
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
              </Row>
            :
            null
          } */}
      </Card>
    </Col>
    )
  }
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

export default ContentsComponent;