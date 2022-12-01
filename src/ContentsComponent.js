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
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import ReactTooltip from "react-tooltip";


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


function ContentsComponent({cData, resize, scrap, setSearchItems, reco, cate}){
  let [accountFlag, setAccountFlag] = useState(false);
  let [accountInfo, setAccountInfo] = useState([]);
  let [checked, setChecked] = useState(false);
  let [initCheck, setInitCheck] = useState(false);
  let [onComment, setOnComment] = useState(false);
  let [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let cred = localStorage.getItem('googleAccount')
    if (cred != undefined){
      setAccountFlag(true)
      let userInfo = parseJwt(cred)
      setAccountInfo(userInfo)
    }
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

  let [comments, setComments] = useState([]);
  useEffect(() => {
    let url = "https://api.fleaman.shop/product/get-comment?product_link=" + cData.link
    console.log(url)
    axios.get(url)
      .then((result) => {
        let comments = result.data
        setComments(comments)
      })
      .catch(() => {
        console.log('댓글 로드 실패')
      })
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
  


  let [linkHash, setLinkHash] = useState("")
  const handleScrapShare = async (productData) => {
    axios.post("https://api.fleaman.shop/share/product", {
      data_list: productData
    }).then(function (response) {
      linkHash = response.data;
      setLinkHash(linkHash)
    }).catch(function (error) {
      alert('링크 복사에 실패하였습니다.');
    });
  };
  
  const handleCopyClipBoard = async (hash) => {
    if (hash != ""){
      try {
        await navigator.clipboard.writeText("https://fleaman.shop/share/product/" + hash);
        alert('링크가 복사되었습니다.');
      } catch (error) {
        alert('링크 복사에 실패하였습니다.');
      }
    }
  };

  useEffect(() => {
    handleCopyClipBoard(linkHash)
  }, [linkHash])



  let text_len = resize  >= 1080 ? 25 : 13
  // let data_name = cData.title.length >= text_len ? cData.title.substr(0, text_len) + "..." : cData.title
  let data_name = cData.title
  let new_price = 0

  if (!reco) {
    let price = cData.price;
    new_price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  else {
    new_price = 0
  }
  let dateDiff = getDateDiff(cData.reg_date);
  let hourDiff = getHourDiff(cData.reg_date);
  let diffDate = dateDiff >= 1 ? dateDiff + "일 전" : hourDiff != 0 ? hourDiff + "시간 전" : "방금 전"


  
  let imgUrl = cData.img_url
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
              <Card.Img referrerPolicy='no-referrer' variant="top" src={imgUrl} height="100"/>
            </Col>
            <Col xs={9} md={9}>
              <Row>
                <Col xs={8} md={8}>
                  
                  <Badge bg='light' text="dark">{reco ? cData.source1 : cData.source}</Badge>
                  {
                    !reco ? <ColoredBadge state={cData.state}/> : <Badge bg='light' text="dark">{cData.source2}</Badge>
                  }
                  
                  {
                    reco ? null 
                    : <Button variant="outline-secondary" size='sm' style={{padding: "1px", margin: "2px"}}
                    onClick={() => {
                     handleScrapShare([cData])
                    }}
                   >
                     공유 링크
                   </Button>
                  }
                  
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
                <Col xs={9} md={9}>
                  {reco ? null : <Card.Text>{new_price}원 </Card.Text>}
                </Col>
              </Row>
              {
                reco ? <Row>
                  <Col xs={9} md={9} >
                  <small className="text-muted">
                    <Card.Text>
                      원문 좋아요 {cData.like_cnt} 원문 댓글 {cData.comment_cnt}
                    </Card.Text>
                  </small>
                </Col>
                </Row>: null
              }
              <Row>
                <Col xs={8} md={8} >
                  <Card.Text> {cData.location} </Card.Text>
                </Col>
                <Col xs={4} md={4} style={{textAlign: "right"}}>
                {
                  !reco ? 
                  <Button
                        className="mb-1"
                        size='sm'
                        variant="outline-warning"
                        style={{margin:"1px", padding: "3px"}}
                        onClick={(e) => {
                          setOnComment(!onComment)
                        }}
                      >
                        {onComment ? "접기" : "댓글"+comments.length}
                      </Button> : null
                }
                {
                  reco ? null :
                      <Button
                        className="mb-1"
                        size='sm'
                        type="checkbox"
                        style={{margin:"1px", padding: "3px"}}
                        variant="outline-warning"
                        checked={checked}
                        value="1"
                        data-for="scrap"
                        data-tip
                        onClick={(e) => {
                          setChecked(!e.currentTarget.checked)
                        }}
                      >
                        {checked ? "★" : "☆"}
                      </Button>
                      
                }
                <ReactTooltip 
                  id='scrap'
                  getContent={dataTip => "스크랩"}
                />
                </Col>
              </Row>
            </Col>
          </Row>
          {
            comments.length != 0 && onComment?

          
          <Card body={false} border={onComment ? "#dee2e6": "light" } style={{padding: "5px"}}>
            {
              
              onComment ? 
                comments.map((comment, idx) => {
                  let dateDiffComment = getDateDiff(comment.create_date);
                  let hourDiffComment = getHourDiff(comment.create_date);
                  let diffDateComment = dateDiffComment >= 1 ? dateDiffComment + "일 전" : hourDiffComment != 0 ? hourDiffComment + "시간 전" : "방금 전"
                  return (
                    <Row key={idx}>
                      <Col xs={3} md={3} style={{textAlign: "center", fontWeight: "bold"}}>
                        {comment.nick_name}
                      </Col>
                      <Col xs={accountInfo.email == comment.email ? 5 : 7} md={accountInfo.email == comment.email ? 5:7} style={{textAlign: "left"}}>
                        {comment.comment}
                      </Col>
                      <Col xs={2} md={2} style={{textAlign: "right", color: "gray"}}>
                        {diffDateComment}
                      </Col>
                        { 
                          accountInfo.email == comment.email ? 
                          <Col xs={2} md={2} style={{ textAlign: "right"}}>
                            <Button
                              size='sm'
                              // style={{margin:"1px", padding: "3px"}}
                              variant="outline-secondary"
                              onClick={(e) => {
                                let google_token = localStorage.getItem('googleAccount')
                                axios.post("https://api.fleaman.shop/product/delete-comment", {
                                  google_token: google_token,
                                  comment_id: comment._id,
                                  link: comment.product_link
                                }).then(function (response) {
                                  let copyData = [...comments]
                                  let filteredData = copyData.filter(x => x._id != comment._id)
                                  setComments(filteredData)
                                }).catch(function (error) {
                                  alert('댓글 삭제에 실패하였습니다.');
                                });
                              }}
                            >
                              삭제
                            </Button>
                          </Col>
                           : null
                        }
                    </Row>
                  )
                })
                : null
            }
            </Card> : null
          }


          {
            accountFlag && onComment?   
              <Row>
                <InputGroup className="mb-1 mt-3">
                  <Form.Control
                    placeholder="의견 작성하기(50자 미만)"
                    aria-label="comment"
                    aria-describedby="basic-addon"
                    onChange={(e)=>{ 
                      setInputValue(e.target.value)
                    }}
                  />
                  <Button variant="outline-secondary" id="button-addon" size='sm'
                    onClick={() => {
                      let google_token = localStorage.getItem('googleAccount')
                      axios.post("https://api.fleaman.shop/product/insert-comment", {
                        google_token: google_token,
                        comment: inputValue,
                        data: cData,
                        product_link: cData.link
                      }).then(function (response) {
                        let commentsData = response.data
                        if (commentsData == "F"){
                          alert('글자수 규칙에 위반됩니다.');
                        }
                        else {
                          setComments(commentsData)
                        }
                      }).catch(function (error) {
                        alert('댓글 달기에 실패하였습니다.');
                      });
                    }}
                  >
                    작성
                  </Button>
                </InputGroup>
              </Row>
            : onComment ? <Row>
              <Col style={{textAlign: "center", color: "gray"}}> 댓글 달기는 로그인이 필요한 서비스입니다.</Col>
          </Row> : null
            
          }
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