import { useEffect, useState } from 'react';
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

function Login() {
  let cred = localStorage.getItem('googleAccount')
  let nick = localStorage.getItem('userNickName')
  const navigate = useNavigate();
  let [isLogin, setIsLogin] = useState(cred != undefined);
  let [isUpdate, setIsUpdate] = useState(false);
  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  const onGoogleSignIn = async res => {
    const { credential } = res;
    console.log(handleCredentialResponse(res))
    localStorage.setItem('googleAccount', credential)
    axios.post("https://api.fleaman.shop/user/login", {
        google_token: credential
      }).then(function (response) {
        let nickName = response.data.nick_name;
        localStorage.setItem('userNickName', nickName)
        console.log(nickName)
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
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
    console.log(isUpdate, isLogin)
    if (!isUpdate) return;
    navigate('/');
  }, [isLogin]);


  if (cred == undefined){
    return (
      <div>
        <MetaTag title="Login" desc="플리맨 로그인 FleaMan Login" url="https://fleaman.shop/login" keywords=", Login" />
        <h3>Login</h3>
        <h6>로그인하시고 플리맨 커뮤니티에 동참해보세요!</h6>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}><GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" /></div>

      </div>
    );
  }
  else {
    let userInfo = parseJwt(cred)
    console.log(userInfo)
    return (
      <div>
        <MetaTag title="My Page" desc="플리맨 마이 페이지 FleaMan My Page" url="https://fleaman.shop/login" keywords=", My Page"/>
        <h4 className='mt-5'>
        <img
              alt=""
              src="/spin4.gif"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          "{nick}"님의 페이지</h4>
        <div>
          <img
                alt=""
                src="/logo.png"
                width="100"
                height="100"
                className="d-inline-block align-top"
              />
        </div>
        <div>
          <NickNameModal credential={cred} ></NickNameModal>
        {/* <Button className='mt-5' onClick={ onGoogleSignOut } variant="outline-secondary">닉네임 수정</Button>  */}
        </div>
        
        <Button className='mt-1' onClick={ onGoogleSignOut } variant="outline-secondary">Sign Out</Button> 
      </div>
    )
  }

}


function NickNameModal({ credential }) {
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
      variant="outline-secondary">닉네임 수정</Button> 

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

