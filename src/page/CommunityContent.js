import { useEffect, useState } from 'react';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import MetaTag from '../SEOMetaTag';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge';
import { useParams, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MDEditor from '@uiw/react-md-editor';


const getDateDiffComment = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();
  
  return Math.floor((diffDate - (9 * 60 * 60 * 1000)) / (1000 * 60 * 60 * 24));
}


const getHourDiffComment = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();

  return Math.floor((diffDate  - (9 * 60 * 60 * 1000)) / (1000 * 60 * 60));
}

const getLevel = (level) => {
  if (level <= 4){
    return <Badge bg="secondary">{level}</Badge>
  }
  else if (level == 5){
    return <Badge bg="success" text="dark">{level}</Badge>
  }
  else if (level == 6){
    return <Badge bg="primary">{level}</Badge>
  }
  else if (level == 7){
    return <Badge bg="info">{level}</Badge>
  }
  else if (level == 8){
    return <Badge bg="warning" text="dark">{level}</Badge>
  }
  else if (level == 9){
    return <Badge bg="danger">{level}</Badge>
  }
  else if (level == 10){
    return <Badge bg="dark">{level}</Badge>
  }
}

const getImg = (level) => {
  if (level <= 4){
    return "/logo.png"
  }
  else if (level == 5){
    return "/logo.png"
  }
  else if (level == 6){
    return "/logo.png"
  }
  else if (level == 7){
    return "/logo.png"
  }
  else if (level == 8){
    return "/logo.png"
  }
  else if (level == 9){
    return "/logo.png"
  }
  else if (level == 10){
    return "/logo.png"
  }
}


let H3 = styled.h3`
  color : ${ props => props.c };
`;

let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function CommunityContent() {
  let navigate = useNavigate();
  let a = useSelector((state) => state.bg )
  let { id } = useParams();

  let [content, setContent] = useState({});
  let [token, setToken] = useState("");
  let [email, setEmail] = useState("");
  let [comments, setComments] = useState([]);
  let [commentOpen, setCommentOpen] = useState([]);
  let [inputComment, setInputComment] = useState("");
  let [inputComments, setInputComments] = useState([]);
  useEffect(() => {
    let cred = localStorage.getItem('googleAccount')
    if (cred != undefined){
      setToken(cred)
      let userInfo = parseJwt(cred)
      setEmail(userInfo.email)
    }
  }, [])

  useEffect(() => {
    axios.get("https://api.fleaman.shop/table/tables?type=content&table_id="+id)
    .then(function (response) {
      let contentData = response.data;
      setContent(contentData)
      setCommentOpen(Array.from({length: contentData.length}, () => false))
      setCommentOpen(Array.from({length: contentData.length}, () => ""))
    }).catch(function (error) {
      console.log(error, '게시물 정보를 가져오는데 실패했습니다.');
      alert('게시물 정보를 가져오는데 실패했습니다.')
      navigate('/community/1')
    });
  }, [])

  useEffect(() => {
    axios.get("https://api.fleaman.shop/table/tables?type=comment&table_id="+id)
    .then(function (response) {
      let commentData = response.data;
      setComments(commentData)
    }).catch(function (error) {
      console.log(error, '댓글 정보를 가져오는데 실패했습니다.');
      alert('댓글 정보를 가져오는데 실패했습니다.')
    });
  }, [])
  

  return (
    <div>
      <MetaTag title="Community Content" desc="플리맨 게시물 페이지 FleaMan Community Content Page" url="https://fleaman.shop/content" keywords=", Content Page"/>
      <H4 c={a == "light" ? "dark":"white"}>플리 게시판</H4>
      <H6 c={a == "light" ? "dark":"white"}>광고 또는 욕설 및 음란물의 경우 경고없이 삭제 및 제재합니다</H6>
      <Card
        style={{
          padding: "1px", 
          textAlign: "left",
          border: "1px solid #00000000",
          backgroundColor: a == "light" ? "#f2f3f4": "#343a40"
        }}
        border={null}
        // bg={a == "light" ? "light" : "dark"}
        text={a == "light" ? "dark" : "light" }
      >
          <Card.Header>
            <Row >
              <Col xs={12} md={9} style={{fontSize: "1.4rem", fontWeight: "bold"}}>
                <Badge style={{marginRight: "10px"}} bg="light" text='dark'>
                  {content.category}
                </Badge>
                {content.title}
              </Col>
              <Col xs={12} md={3} className='right_button' style={{color: "gray", textAlign: "right"}}>
                {content.reg_date}
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col >
                <a href={"/page/"+content.name} style={{color: a == "light" ? "black" : "white"}}>
                  {getLevel(content.level)}{content.name}
                </a>
              </Col>
              <Col className='right_button' style={{color: "gray"}}>
                조회수: {content.view_cnt}, 댓글수: {content.comment_cnt}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <MDEditor.Markdown source={content.content} 
              style={{ 
                whiteSpace: 'pre-wrap',  
                backgroundColor: a == "light" ? "#f2f3f4":"#343a40"
              }} 
            />

            {/* <Card.Text style={{whiteSpace: "pre-wrap"}}>
              {content.content}
            </Card.Text> */}
          </Card.Body>
          <Card.Footer>
            <Card.Text>
              댓글
            </Card.Text>
            {
              comments.length != 0 ?
            
              <Card 
                body={false} 
                border={a == "dark" ? "light" : null } 
                style={{padding: "10px"}}
                bg={a == "light" ? null : "dark"}
                text={a == "light" ? "dark" : "light" }
              >
            
            {
              comments.map((comment, idx) => {
                let dateDiffComment = getDateDiffComment(comment.reg_date);
                let hourDiffComment = getHourDiffComment(comment.reg_date);
                let diffDateComment = dateDiffComment >= 1 ? dateDiffComment + "d" : hourDiffComment > 0 ? hourDiffComment + "h" : "방금"
                return (
                  <div className='mt-2' 
                    style={{ 
                      borderBottom: a == "light" ? "1px solid #6c757d" : "1px solid #6c757d",
                      padding: "5px",
                    }}>
                    <Row key={idx} style={{
                      fontSize: "0.8rem",
                    }}>
                      <Col xs={10} md={10} style={{textAlign: "left", fontWeight: "bold"}}>
                        <a href={"/page/"+comment.name} style={{color: a == "light" ? "black" : "white"}}>
                          {getLevel(comment.level)} {comment.name}
                        </a>
                      </Col>
                      <Col xs={2} md={2} style={{textAlign: "right", color: "gray"}}>
                        {diffDateComment}
                      </Col>
                        
                      </Row>
                      <Row>
                        <Col xs={8} md={8} style={{textAlign: "left", whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </Col>
                        <Col xs={4} md={4} style={{textAlign: "right", color: "gray"}}>
                          { 
                          token != "" && comment.update != -1 ?
                            <Button
                              size='sm'
                              style={{fontSize: "0.5rem"}}
                              variant="outline-secondary"
                              onClick={(e) => {
                                let copyCommentOpen = [...commentOpen]
                                copyCommentOpen[idx] = !commentOpen[idx]
                                setCommentOpen(copyCommentOpen)
                              }}
                            >
                              댓글
                            </Button> : null
                          }
                          
                          { 
                          email == comment.email && comment.update != -1 ? 
                            <Button
                              size='sm'
                              style={{fontSize: "0.5rem"}}
                              variant="outline-secondary"
                              onClick={(e) => {
                                if (window.confirm("정말 삭제합니까?")) { 
                                  axios.post("https://api.fleaman.shop/table/delete", {
                                    type: "comment",
                                    google_token: token,
                                    data_id: comment._id,
                                  }).then(function (response) {
                                    window.location.reload()
                                  }).catch(function (error) {
                                    alert('댓글 삭제에 실패하였습니다.');
                                  });
                                
                                } else {
                                  alert("삭제가 취소됩니다");
                                }
                              }}
                            >
                              삭제
                            </Button>
                          : null
                          }
                        </Col>
                      </Row>
                      {
                        comment.comment_part.map((c, idx) => {
                          let dateDiffComment = getDateDiffComment(c.reg_date);
                          let hourDiffComment = getHourDiffComment(c.reg_date);
                          let diffDateComment = dateDiffComment >= 1 ? dateDiffComment + "d" : hourDiffComment > 0 ? hourDiffComment + "h" : "방금"
                          return (
                            <div style={{paddingLeft: "20px"}}>
                              <Row key={idx} style={{
                                fontSize: "0.8rem",
                              }}>
                                
                                <Col xs={10} md={10} style={{textAlign: "left", fontWeight: "bold"}}>
                                  <a href={"/page/"+c.name} style={{color: a == "light" ? "black" : "white"}}>
                                    {getLevel(c.level)} {c.name}
                                  </a>
                                </Col>
                                <Col xs={2} md={2} style={{textAlign: "right", color: "gray"}}>
                                  {diffDateComment}
                                </Col>
                                </Row>
                                <Row>
                                  <Col xs={9} md={9} style={{textAlign: "left", whiteSpace: 'pre-wrap'}}>
                                    {c.content}
                                  </Col>
                                  <Col xs={3} md={3} style={{textAlign: "right", color: "gray"}}>
                                    { 
                                    email == c.email && c.update != -1  ? 
                                      <Button
                                        size='sm'
                                        style={{fontSize: "0.5rem"}}
                                        variant="outline-secondary"
                                        onClick={(e) => {
                                          if (window.confirm("정말 삭제합니까?")) { 
                                            axios.post("https://api.fleaman.shop/table/delete", {
                                              type: "comment",
                                              google_token: token,
                                              data_id: c._id,
                                            }).then(function (response) {
                                              window.location.reload()
                                            }).catch(function (error) {
                                              alert('댓글 삭제에 실패하였습니다.');
                                            });
                                          
                                          } else {
                                            alert("삭제가 취소됩니다");
                                          }
                                        }}
                                      >
                                        삭제
                                      </Button>
                                    : null
                                    }
                                  </Col>
                                </Row>
                              </div>
                          )
                        })
                      }
                      {
                        commentOpen[idx] ? 
                        <Row>
                          <InputGroup className="mb-1 mt-1">
                            <Form.Control
                              as="textarea" 
                              placeholder="의견 작성하기(100자 미만)"
                              aria-label="comment"
                              aria-describedby="basic-addon"
                              style={{
                                backgroundColor: a == "light" ? null : "#212529", 
                                border: a == "light" ? null : "1px solid #6c757d",
                                color: a == "light" ? "black" : "white"
                              }}
                              onChange={(e)=>{
                                let copyComments = [...inputComments]
                                copyComments[idx] = e.target.value 
                                setInputComments(copyComments)
                              }}
                              value={inputComments[idx]}
                            />
                            <Button variant="outline-secondary" id="button-addon" size='sm'
                              onClick={() => {
                                console.log(inputComment[idx])
                                if (inputComments[idx] != undefined){
                                  // console.log(inputComments[idx])
                                  axios.post("https://api.fleaman.shop/table/insert", {
                                    type: "comment",
                                    content: inputComments[idx],
                                    google_token: token,
                                    parent_comment_id: comment._id,
                                    table_id: id
                                  }).then(function (response) {
                                    window.location.reload()
                                  }).catch(function (error) {
                                    alert('댓글 입력에 실패했습니다.');
                                  });
                                }
                                else {
                                  alert("댓글을 입력해주세요.")
                                }
                              }}
                            >
                              작성
                            </Button>
                          </InputGroup>
                        </Row> 
                        : null
                      }
                    </div>
                )
              })
            } 
            
            </Card> : null
            }
            {
              token != "" ?   
                <Row>
                  <InputGroup className="mb-1 mt-3">
                    <Form.Control
                      as="textarea" 
                      placeholder="의견 작성하기(100자 미만)"
                      aria-label="comment"
                      aria-describedby="basic-addon"
                      style={{
                        backgroundColor: a == "light" ? null : "#212529", 
                        border: a == "light" ? null : "1px solid #6c757d",
                        color: a == "light" ? "black" : "white"
                      }}
                      onChange={(e)=>{ 
                        setInputComment(e.target.value)
                      }}
                      value={inputComment}
                    />
                    <Button variant="outline-secondary" id="button-addon" size='sm'
                      onClick={() => {
                        if (inputComment != ""){
                          axios.post("https://api.fleaman.shop/table/insert", {
                            type: "comment",
                            content: inputComment,
                            parent_comment_id: '-',
                            google_token: token,
                            table_id: id
                          }).then(function (response) {
                            window.location.reload()
                          }).catch(function (error) {
                            alert('댓글 입력에 실패했습니다.');
                          });
                        }
                        else {
                          alert("댓글을 입력해주세요.")
                        }
                      }}
                    >
                      작성
                    </Button>
                  </InputGroup>
                </Row>
              : 
              <Row className='mt-3'>
                <Col style={{textAlign: "center", color: "gray"}}> 댓글 달기는 로그인이 필요한 서비스입니다.</Col>
              </Row>
            }
          </Card.Footer>
        </Card>
      <Button 
        className='mt-3'
        size="xl"
        variant={a == "light" ? "outline-secondary":"secondary"}
        style={{margin: "2px"}}
        onClick={() => {
          navigate(-1)
          }
        }
      >
        뒤로 가기
      </Button>
      {
        email == content.email ?
      
        <Button 
          className='mt-3'
          size="xl"
          variant={a == "light" ? "outline-secondary":"secondary"}
          style={{margin: "2px"}}

          onClick={() => {
              let path = "/edit/" + id
              navigate(path)
            }
          }
        >
          수정
        </Button> : null 
      }
      {
        email == content.email && comments.length == 0 ?
      
        <Button 
          className='mt-3'
          size="xl"
          variant={a == "light" ? "outline-secondary":"secondary"}
          style={{margin: "2px"}}

          onClick={() => {
            if (window.confirm("정말 삭제합니까?")) { 
              axios.post("https://api.fleaman.shop/table/delete", {
                type: "table",
                google_token: token,
                data_id: id
              }).then(function (response) {
                alert('게시물이 삭제되었습니다.')
                navigate('/community/1')
              }).catch(function (error) {
                alert('게시물 작성에 실패했습니다.');
              });
            }
            else {
              alert('삭제가 취소되었습니다.')
            }
          }
          }
        >
          삭제
        </Button> : null 
      }
    <div className='mt-5'>
      <AdSense.Google
        style={{ display: 'block' }}
        client='ca-pub-3213525149688431'
        slot='5111538528'
        format='auto'
        responsive="true"
      />
      {/* <AdSense.Google
        style={{ display: 'block' }}
        client='ca-pub-3213525149688431'
        slot='1373843183'
        format='autorelaxed'
        // responsive="true"
      /> */}
    </div>
    </div>
  )
  

}



export default CommunityContent;

