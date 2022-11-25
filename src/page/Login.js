import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../GoogleLogin';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import Button from 'react-bootstrap/Button';
import MetaTag from '../SEOMetaTag';
import Row from 'react-bootstrap/Row';


function Login() {
  let cred = localStorage.getItem('googleAccount')
  const navigate = useNavigate();
  let [isLogin, setIsLogin] = useState(cred != undefined);
  let [isUpdate, setIsUpdate] = useState(false);
  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  const onGoogleSignIn = async res => {
    const { credential } = res;
    console.log(handleCredentialResponse(res))
    localStorage.setItem('googleAccount', credential)
    setIsUpdate(true);
    setIsLogin(true);
  };

  const onGoogleSignOut = () => {
    localStorage.removeItem('googleAccount')
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
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          {userInfo.family_name} 플리 Page</h4>
        <div>
          <img
                alt=""
                src={userInfo.picture}
                width="100"
                height="100"
                className="d-inline-block align-top"
              />
        </div>
        <Button className='mt-5' onClick={ onGoogleSignOut } variant="outline-secondary">Sign Out</Button> 
      </div>
    )
  }

}


export default Login;

