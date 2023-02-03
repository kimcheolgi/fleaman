import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../GoogleLogin';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import Button from 'react-bootstrap/Button';
import MetaTag from '../SEOMetaTag';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge';
import ReactTooltip from "react-tooltip";
// import S3 from 'react-aws-s3';
import Loader from '../Loader';
import AdSense from 'react-adsense';


const getLevel = (level) => {
  if (level <= 4){
    return <Badge bg="secondary">level: {level}</Badge>
  }
  else if (level == 5){
    return <Badge bg="success" text="dark">level: {level}</Badge>
  }
  else if (level == 6){
    return <Badge bg="primary">level: {level}</Badge>
  }
  else if (level == 7){
    return <Badge bg="info">level: {level}</Badge>
  }
  else if (level == 8){
    return <Badge bg="warning" text="dark">level: {level}</Badge>
  }
  else if (level == 9){
    return <Badge bg="danger">level: {level}</Badge>
  }
  else if (level == 10){
    return <Badge bg="dark">level: {level}</Badge>
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

function Login() {
  const doubleClick = useRef({
    isDoubleClick: false
  })
  
  let a = useSelector((state) => state.bg )

  let cred = localStorage.getItem('googleAccount')
  let nick = localStorage.getItem('userNickName')
  const navigate = useNavigate();
  let [isLogin, setIsLogin] = useState(cred != undefined);
  let [isUpdate, setIsUpdate] = useState(false);
  let [level, setLevel] = useState(0);
  let [commentCount, setCommentCount] = useState(0);
  let [dailyCount, setDailyCount] = useState(0);
  let [tableCount, setTableCount] = useState(0);

  let [isLoading, setIsLoading] = useState(false);
  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  const onGoogleSignIn = async res => {
    if (doubleClick.current.isDoubleClick){
      return ;
    }
    doubleClick.current.isDoubleClick = true;

    const { credential } = res;
    localStorage.setItem('googleAccount', credential)
    axios.post("https://api.fleaman.shop/user/login", {
        google_token: credential
      }).then(function (response) {
        let nickName = response.data.nick_name;
        localStorage.setItem('userNickName', nickName)
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
      }).finally(() =>{
        doubleClick.current.isDoubleClick = false;
      });
    setIsUpdate(true);
    setIsLogin(true);
  };

  const onGoogleSignOut = () => {
    localStorage.removeItem('googleAccount')
    localStorage.removeItem('userNickName')
    setIsUpdate(true);
    setIsLogin(false);
  };

  useEffect(() => {
    if (!isUpdate) return;
    setIsLoading(true)
    setTimeout(()=>{ navigate('/') }, 500);
  }, [isLogin]);

  useEffect(() => {
    if (cred != undefined){
      axios.post("https://api.fleaman.shop/user/login", {
        google_token: cred
      }).then(function (response) {
        let user_data = response.data;
        setLevel(user_data.level)
        setCommentCount(user_data.comment_cnt)
        setDailyCount(user_data.daily_cnt)
        setTableCount(user_data.table_cnt)
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
      });
    }
  }, [])
  if (isLoading){
    return (
      <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row> 
    )
  }
  if (cred == undefined){
    return (
      <div style={{height: "100vh"}}>
        <MetaTag title="Login" desc="플리맨 로그인 FleaMan Login" url="https://fleaman.shop/login" keywords=", Login" />
        <H3 c={a == "light" ? "dark":"white"}>Login</H3>
        <H6 c={a == "light" ? "dark":"white"}>로그인하시고 플리맨 커뮤니티에 동참해보세요!</H6>
        <Card 
          border={a == "light" ? null : "secondary"}
          bg={a}
          text={a == "light" ? "dark" : "light"}
          style={{margin: "5%", padding: "5%"}}>
          <Card.Text>
            <img
              alt=""
              src="/spin1.gif"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            <small> 구글 로그인 한번으로 회원가입이 가능합니다</small>
          </Card.Text>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}><GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" /></div>
        </Card>
        <div className='mt-5'>
          {/* <AdSense.Google
            style={{ display: 'block' }}
            client='ca-pub-3213525149688431'
            slot='5111538528'
            format='auto'
            responsive="true"
          /> */}
          {/* <AdSense.Google
            style={{ display: 'block' }}
            client='ca-pub-3213525149688431'
            slot='1373843183'
            format='autorelaxed'
            // responsive="true"
          /> */}
        </div>
      </div>
    );
  }
  else {
    if (isLoading) {
      <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row> 
    }
    else {
      let userInfo = parseJwt(cred)
      return (      
        <div style={{height: "100vh"}}>
          <MetaTag title="My Page" desc="플리맨 마이 페이지 FleaMan My Page" url="https://fleaman.shop/login" keywords=", My Page"/>
          <Card 
            border={a == "light" ? null : "secondary"}
            bg={a}
            text={a == "light" ? "dark" : "light"}
            style={{margin: "5%", padding: "5%"}}>
            <H4 c={a == "light" ? "dark":"white"} className='mt-2'>
              <img
                alt=""
                src="/spin1.gif"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              "{nick}"님의 페이지
            </H4>
            <div className='mb-3'>
              {level != 0 ? getLevel(level):<div></div>} 
              <ReactTooltip 
                id='level'
                getContent={dataTip =>
                  <div>
                    <Row> 
                      level 1: 가입
                    </Row>
                    <Row>
                      level 2: 출석 7일 + 댓글 수 10
                      </Row>
                    <Row>
                      level 3: 출석 15일 + 댓글 수 30 + 게시글 수 5
                      </Row>
                    <Row>
                      level 4: 출석 30일 + 댓글 수 60 + 게시글 수 10
                    </Row>
                    <Row>
                      level 5 이상: 커뮤니티 활동에 따른 비율 별 정책 적용
                    </Row>
                  </div>
                }
              />
              <Badge 
                bg='secondary'
                style={{borderRadius: "50%", "marginLeft": "3px"}}
                data-for="level"
                data-tip
                >?</Badge>
            </div>
            
            <div>
              {level != 0 ? 
              <img
                alt=""
                src={getImg(level)}
                width="100"
                height="100"
                className="d-inline-block align-top"
                style={{backgroundColor: "white"}}
              />: <div className="d-inline-block align-top" style={{width: "100px", height: "100px", backgroundColor: "white"}}/>
              }
            </div>
            <H6 c={a == "light" ? "dark":"white"} className='mt-3'>
            <div style={{textAlign: "center"}}>
              <div>
                작성 게시물 수: {tableCount}
              </div>
              <div>
                작성한 댓글 수: {commentCount}
              </div>
              <div>
                출첵 수: {dailyCount}
              </div>
            </div>
            </H6>
            <div>
              <NickNameModal credential={cred} a={a} ></NickNameModal>
            {/* <Button className='mt-5' onClick={ onGoogleSignOut } variant="outline-secondary">닉네임 수정</Button>  */}
            </div>
            
            <div>
              <Button 
                className='mt-1' 
                onClick={ onGoogleSignOut } 
                variant={a == "light" ? "outline-secondary":"secondary"}
              >
                로그아웃
              </Button> 
            </div>
          </Card>
          <div className='mt-5'>
            {/* <AdSense.Google
              style={{ display: 'block' }}
              client='ca-pub-3213525149688431'
              slot='5111538528'
              format='auto'
              responsive="true"
            /> */}
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
  }

}


function NickNameModal({ credential, a }) {
  const navigate = useNavigate();
  const value = 'sm-down';
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("")
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <>
      <Button className='mt-5' 
      onClick={() => handleShow(value)}
      variant={a == "light" ? "outline-secondary":"secondary"}>닉네임 수정</Button> 

      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>닉네임 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3 mt-1">
            <Form.Control
              aria-describedby="basic-addon2"
              onChange={(e)=>{ 
                setInputValue(e.target.value)
              }}
              value={inputValue}
            />
            <Button 
              variant="outline-secondary" 
              id="button-addon2"
              onClick={() => {
                axios.post("https://api.fleaman.shop/user/edit-nickname", {
                  google_token: credential,
                  nick_name: inputValue
                }).then(function (response) {
                  let status = response.data;
                  if (status == 'S'){
                    localStorage.setItem('userNickName', inputValue)
                    window.location.reload();
                  }
                  else if (status == 'D'){
                    alert("이미 존재하는 닉네임입니다.")
                  }  
                }).catch(function (error) {
                  alert('닉네임 변경에 실패했습니다.');
                });

              }}
            >
              수정
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;

