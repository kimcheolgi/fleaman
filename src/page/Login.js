import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../GoogleLogin';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import Button from 'react-bootstrap/Button';

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
    return (
      <div>
        <h3>{userInfo.name} My Page</h3>
        <Button onClick={ onGoogleSignOut } variant="dark">Sign Out</Button> 
      </div>
    )
  }

}


export default Login;

