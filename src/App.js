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
import Tables from './page/Community';
import { useDispatch, useSelector } from "react-redux"
import { changeBg } from "./store.js"
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./App.css";
import CommentedProductList from './page/CommentProductList';
import { Badge } from 'react-bootstrap';
import Commented from './page/Commented';
import MyComment from './page/MyComment';
import DailyCheck from './page/DailyCheck';
import UserPage from './page/UserPage';
import Write from './page/Write';
import CommunityContent from './page/CommunityContent';
import Edit from './page/Edit';
// const ContentsList = lazy(() => import('./page/ContentsList'))
// const Login = lazy(() => import('./page/Login'))
import AdSense from 'react-adsense';


function App() {
  let dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('watched') == undefined) {
      localStorage.setItem('watched', JSON.stringify([]))
    }
    if (localStorage.getItem('searched') == undefined) {
      localStorage.setItem('searched', JSON.stringify([]))
    }
    if (localStorage.getItem('mode') == undefined) {
      localStorage.setItem('mode', "light")
    }
  }, [])
  const [resize, setResize] = useState(window.innerWidth);
  let a = useSelector((state) => state.bg )
  document.documentElement.setAttribute('data-color-mode', a)

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
        contents: ['Macbook Air', 'MacBook Pro', 'iMac 24"', 'Mac mini']
      },
      {
        category: "iPad", 
        contents: ['iPad Pro', 'iPad Air', 'iPad', 'iPad mini']
      },
      {
        category: "iPhone", 
        contents: ['iPhone Pro Max', 'iPhone Pro', 'iPhone', 'iPhone mini', 'iPhone SE']
      },
      {
        category: "Watch", 
        contents: ['Apple Watch', 'Apple Watch SE']
      },
      {
        category: "AirPods", 
        contents: ['AirPods', 'AirPods Pro', 'AirPods Max']
      },
      {
        category: "GPU", 
        contents: ['GTX10', 'RTX20', 'RTX30', 'RTX40', 'RX5000', 'RX6000', 'RX7000']
      },
    ]
  );

  useEffect(()=>{
    let inner = document.createElement('script');
    let scr = document.createElement("script")
    scr.src = "https://ads-partners.coupang.com/g.js"
    // inner.innerHTML = `new PartnersCoupang.G({"id":629094,"template":"carousel","trackingCode":"AF7144675","width":"100%","height":"100%"})`;
    // document.querySelector('.coupang').appendChild(scr);
    // document.querySelector('.coupang').appendChild(inner);
  }, [])

  return (
    <div className={"App no-gutters"}>
      <div className={a +"_back no-gutters"}>
        <MetaTag title="플리맨" desc="중고물품 통합 검색 플랫폼 플리맨 FleaMan" url="https://fleaman.shop/" keywords=""/>
        <Navbar bg={a} variant={a} expand="lg">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/logo.png"
                style={{backgroundColor: 'white'}}
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
                style={{backgroundColor: 'white'}}
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
                              <NavDropdown.Item key={content} href={'/list/'+d.category+'/'+content}>{content}</NavDropdown.Item>
                            )
                          })
                        }
                      </NavDropdown>
                    )
                  })
                }
                <Nav.Link href="/hotdeal">
                  <Badge bg='danger' size="sm">hot</Badge>
                  핫딜 정보
                </Nav.Link>
                {/* <Nav.Link href="/community/1">
                  플리 게시판
                </Nav.Link>
                <Nav.Link href="/dailycheck">
                  출석체크
                </Nav.Link> */}

                <NavDropdown key={"community"} title={"플리판"} id="basic-nav-dropdown">
                  <NavDropdown.Item key={"notice"} href={"/notice/1"}>{"공지 게시판"}</NavDropdown.Item>
                  <NavDropdown.Item key={"community"} href={"/community/1"}>{"플리 게시판"}</NavDropdown.Item>
                  <NavDropdown.Item key={"dailycheck"} href={"/dailycheck"}>{"출석체크"}</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              <Button
                size='sm'
                variant={a == "light" ? "dark" : "light"}
                onClick={() => {
                  let changeColor = a == "light" ? "dark" : "light"
                  dispatch(changeBg(changeColor))
                  localStorage.setItem("mode", changeColor)
                }}  
                style={{marginRight: "5px"}}
              >
                {a == "light" ? "Dark" : "Light"}
              </Button>
              <LoginButton a={a}/>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className='row no-gutters'>
          {
            resize > 1260?
            <div className="col-md-3 col-sm-0 no-gutters"> 
              {window.location.pathname != "/login"?
              <div 
                // style={{paddingTop: "100px", paddingLeft: "30px"}}
              >
                {/* <AdSense.Google
                  // className='adfit_left'
                  style={{ 
                    display: 'block'
                  }}
                  client='ca-pub-3213525149688431'
                  slot='5098246021'
                  format='auto'
                  responsive='true'
                /> */}
                <AdSense.Google
                  className='adfit_left'
                  style={{ 
                    display: 'inline-block',
                    width: "250px",
                    height: "600px"
                  }}
                  client='ca-pub-3213525149688431'
                  slot='5098246021'
                />
              </div>: null}
              {/* <div className="adfit adfit_left"></div> */} 
            </div>
            : null 
          }
          <div className={resize > 1260 ? 'col-md-6  no-gutters': ' no-gutters'}>
            {/* <Suspense 
              fallback={
                <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
              }> */}
              <div className='no-gutters'>
                <div style={{margin: "10px"}}>
                {window.location.pathname != "/login"?
                  <div className="mt-3 mb-3"
                    style={{
                      // width: "728px",
                      // height: "100px",
                      // maxHeight: "100px"
                    }}
                  >
                    {/* {
                      <iframe 
                        src={"https://ads-partners.coupang.com/widgets.html?id=629138&template=carousel&trackingCode=AF7144675&subId="} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        referrerPolicy="unsafe-url"
                      ></iframe>
                    } */}
                    {/* <amp-ad
                        layout="fixed"
                        width="700"
                        height="100"
                        type="adsense"
                        data-ad-client="ca-pub-3213525149688431"
                        data-ad-slot="7753684162">
                    </amp-ad> */}
                    <AdSense.Google
                      style={{ 
                        display: 'inline-block', 
                        // width: resize > 1260 ? "700px" : "300px", 
                        width: "100%",
                        height: "100px" 
                      }}
                      client='ca-pub-3213525149688431'
                      slot='7753684162'
                      // format='auto'
                      // responsive='true'
                    />
                    
                  </div>:null}
              <Routes>
                <Route path='/' element={           
                  <SearchInput main={true}></SearchInput>
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
                <Route path='/hotdeal' element={
                    <CommentedProductList />
                  } />
                <Route path='/login' element={
                    <Login />
                  } />
                <Route path='/community/:page' element={
                    <Tables />
                  } />
                <Route path='/notice/:page' element={
                    <Tables />
                  } />
                <Route path='/write' element={
                    <Write />
                  } />
                <Route path='/edit/:id' element={
                    <Edit />
                  } />
                <Route path='/commented' element={
                    <Commented />
                  } />
                <Route path='/content/:id' element={
                    <CommunityContent />
                  } />
                <Route path='/mycomment' element={
                    <MyComment />
                  } />
                <Route path='/dailycheck' element={
                    <DailyCheck />
                  } />
                <Route path='/page/:nick' element={
                    <UserPage />
                  } />

              </Routes>
            {/* </Suspense> */}
              </div>
            </div>
            
          </div>
          {
            resize > 1260 ? 
            <div className="col-md-3 col-sm-0 no-gutters">
              {/* <div className="adfit adfit_right"></div> */}
              {window.location.pathname != "/login"?

              <div
                // style={{paddingTop: "100px", paddingRight: "30px"}}
              >
                {/* <AdSense.Google
                  // className='adfit_right'
                  style={{ 
                    display: 'block'
                  }}
                  client='ca-pub-3213525149688431'
                  slot='5098246021'
                  format='auto'
                  responsive="true"
                /> */}
                  <AdSense.Google
                  className='adfit_right'
                  style={{ 
                    display: 'inline-block',
                    width: "250px",
                    height: "600px"
                  }}
                  client='ca-pub-3213525149688431'
                  slot='5098246021'
                />
                
              </div>:null}
              <TopButton outside={true}></TopButton>
            </div> 
            : 
            // <div className="adfit"></div>
            null
          }      
          </div>

          <div className='mt-5' style={{color: "gray"}}>
            <p>
              Copyright 2022. 플리맨 all rights reserved.
            </p>
            <p style={{margin: "0", paddingBottom: "30px"}}>
              문의 메일: info@fleaman.shop
            </p>
        </div>
        </div>
    </div>
  );
}

function LoginButton({ a }) {
  let cred = localStorage.getItem('googleAccount')
  let [nick, setNick] = useState("")

  let [userData, setUserData] = useState({})
  useEffect(() => {
    if (cred != undefined){
      axios.post("https://api.fleaman.shop/user/login", {
        google_token: cred
      }).then(function (response) {
        let userD = response.data;
        setUserData(userD)
        setNick(userD.nick_name)
        
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
      });
    }
  }, [cred])
  let navigate = useNavigate();

  if (cred == undefined) {
    return(
      <Navbar.Text onClick={() => { navigate('/login') }}>
        <Button size="sm" variant={a == "light" ? "outline-secondary":"secondary"}>로그인</Button>
      </Navbar.Text>
    )
  }
  else {
    return (
      <Nav>
        <NavDropdown key={"login"} title={nick} id="basic-nav-dropdown">
          <NavDropdown.Item key={"mypage"} onClick={()=>{ navigate('/login')}}>
            My Page
          </NavDropdown.Item>
          <NavDropdown.Item key={"mycomment"} onClick={()=>{ navigate('/mycomment')}}>
            나의 댓글
          </NavDropdown.Item>
        </NavDropdown>      
      </Nav>
      // <Navbar.Text onClick={() => { navigate('/login') }}>
      //   <Button variant={a == "light" ? "outline-secondary":"secondary"}>My Page </Button>
      // </Navbar.Text>
    )
  }
}

export default App;