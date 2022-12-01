import React, { useState, lazy, Suspense, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'; 
import './App.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import { parseJwt} from './utils.js'
import Button from 'react-bootstrap/Button';
import Loader from './Loader';
import SearchInput from './SearchInput';
import TopButton from './TopButton';
import MetaTag from './SEOMetaTag';
import ContentsList from './page/ContentsList';
import Login from './page/Login';
import ScrapShare from './page/ScrapShare';
import ProductShare from './page/ProductShare';

import "./App.css";
import CommentedProductList from './page/CommentProductList';

// const ContentsList = lazy(() => import('./page/ContentsList'))
// const Login = lazy(() => import('./page/Login'))


function App() {
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
    if (localStorage.getItem('searched') == undefined) {
      localStorage.setItem('searched', JSON.stringify([]))
    }
  }, [])
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

 
  let navigate = useNavigate();

  let [items, setItems] = useState(
    [
      {
        category: "Mac", 
        contents: ['Macbook Air', 'MacBook Pro', 'iMac 24"', 'Mac mini', 'Accessories']
      },
      {
        category: "iPad", 
        contents: ['iPad Pro', 'iPad Air', 'iPad', 'iPad mini', 'Accessories']
      },
      {
        category: "iPhone", 
        contents: ['iPhone Pro Max', 'iPhone Pro', 'iPhone', 'iPhone mini', 'iPhone SE', 'Accessories']
      },
      {
        category: "Watch", 
        contents: ['Apple Watch', 'Apple Watch SE', 'Accessories']
      },
      {
        category: "AirPods", 
        contents: ['AirPods', 'AirPods Pro', 'AirPods Max', 'Accessories']
      },
      {
        category: "GPU", 
        contents: ['GTX10', 'RTX20', 'RTX30', 'RTX40']
      },
    ]
  );

  useEffect(()=>{
    let ins = document.createElement('ins');
    let scr = document.createElement('script');
    ins.className = 'kakao_ad_area';
    ins.style = "display:none;";
    scr.async = 'true';
    scr.type = "text/javascript";
    scr.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    ins.setAttribute('data-ad-width','300');
    ins.setAttribute('data-ad-height','250');
    ins.setAttribute('data-ad-unit','DAN-SW7c6hDuKSq24TvA');
    document.querySelector('.adfit').appendChild(ins);
    document.querySelector('.adfit').appendChild(scr);

  }, [])

  return (
    <div className="App">
      
      <MetaTag title="플리맨" desc="중고물품 통합 검색 플랫폼 플리맨 FleaMan" url="https://fleaman.shop/" keywords=""/>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <img
              alt=""
              src="/black_bg.jpeg"
              style={{backgroundColor: 'black'}}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <img
              alt=""
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {
                items.map((d, i)=>{
                  return(
                    <NavDropdown key={d.category} title={d.category} id="basic-nav-dropdown">
                      {
                        d.contents.map((content, idx)=>{
                          return (
                            <NavDropdown.Item key={content} onClick={()=>{ navigate('/list/'+d.category+'/'+content)}}>{content}</NavDropdown.Item>
                          )
                        })
                      }
                    </NavDropdown>
                  )
                })
              }
              <Nav.Link href="/commented">댓글 달린 물건</Nav.Link>

            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <LoginButton/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='row'>
        {
          resize > 1080 ?
          <div className="col-md-3 col-sm-0">
            {/* <div className="adfit adfit_left"></div> */}
          </div>
          : null 
        }
        <div className={resize > 1080 ? 'col-md-6': ''} style={{padding: "5%"}}>
          <Suspense 
            fallback={
              <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
            }>
            <Routes>
              <Route path='/' element={
                <div>
                  <div style={{margin: "10px"}}>
                    <SearchInput main={true}></SearchInput>
                  </div>
                </div>
              }>
              </Route>
              <Route path='/list/:categoryName/:itemName' element={
                  <ContentsList />
                } />
              <Route path='/share/scrap/:hash' element={
                  <ScrapShare />
                } />
              <Route path='/share/product/:hash' element={
                  <ProductShare />
                } />
              <Route path='/commented' element={
                  <CommentedProductList />
                } />
              <Route path='/login' element={
                  <Login />
                } />

            </Routes>
          </Suspense>
        </div>
        {
          resize > 1080 ? 
          <div className="col-md-3 col-sm-0">
            <div className="adfit adfit_right"></div>
            <TopButton></TopButton>
          </div> 
          : 
          <div className="adfit"></div>
        }      
        </div>
    </div>
  );
}

function LoginButton() {
  let cred = localStorage.getItem('googleAccount')
  let nick = localStorage.getItem('userNickName')

  let navigate = useNavigate();

  if (cred == undefined) {
    return(
      <Navbar.Text onClick={() => { navigate('/login') }}>
        <Button variant="outline-secondary">Login</Button>
      </Navbar.Text>
    )
  }
  else {
    let userInfo = parseJwt(cred)
    return (
      <Navbar.Text onClick={() => { navigate('/login') }}>
        <Button variant="outline-secondary">My Page </Button>
      </Navbar.Text>
    )
  }
}

export default App;
