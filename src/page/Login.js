import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../GoogleLogin';

function handleCredentialResponse(response) {
  const responsePayload = parseJwt(response.credential);
  console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


export default function Login({ isLogin, setIsLogin }) {
  const navigate = useNavigate();

  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  const onGoogleSignIn = async res => {
    const { credential } = res;
    console.log(handleCredentialResponse(res))
    // setIsLogin(true);
  };

  useEffect(() => {
    if (!isLogin) return;
    navigate('/');
  }, [isLogin]);

  return (
    <div>
      <h3>로그인 안해도 문제없습니다. 구글 계정없으면 하지마세요.</h3>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}><GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" /></div>
    </div>
  );
}