import React, { useState, lazy, Suspense, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'; 
import './App.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import coverimage from './img/bg.png'
import CarouselFade from './Carousel';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavbarBrand } from 'react-bootstrap';
import { parseJwt} from './utils.js'

const ContentsList = lazy(() => import('./page/ContentsList'))
const Login = lazy(() => import('./page/Login'))


function App() {
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
        contents: ['Macbook Air', 'MacBook Pro', 'iMac 24"', 'Mac mini', 'Mac Studio', 'Mac Pro', 'Displays', 'Accessories']
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
        category: "TV & Home", 
        contents: ['Apple TV', 'HomePod', 'HomePod mini', 'Accessories']
      },
    ]
  );
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => { navigate('/') }}><Badge bg="info">FleaMan</Badge></Navbar.Brand>
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

            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <LoginButton navi={navigate}/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='row'>
        {
          resize >= 1080 ? <div className="col-md-4 col-sm-0"></div> : null 
        }
        <div className='col-md-4'>
          <Suspense fallback={<div>로딩중임</div>}>
            <Routes>
              <Route path='/' element={
                <div>
                  <div style={{margin: "10px"}}>
                    <CarouselFade />
                  </div>
                  <div style={{margin: "50px"}}>
                    <h3>
                      중고물품 통합검색은 <Badge bg="info">FleaMan</Badge>
                    </h3>
                  </div>
                  
                </div>
              }>
              </Route>
              <Route path='/list/:categoryName/:itemName' element={
                    <ContentsList />
                } />

              <Route path='/login' element={
                    <Login />
                } />
            </Routes>
          </Suspense>
        </div>
        {
          resize >= 1080 ? <div className="col-md-4 col-sm-0"></div> : null 
        }      
        </div>
    </div>
  );
}

function LoginButton({ navi }) {
  let cred = localStorage.getItem('googleAccount')
  if (cred == undefined) {
    return(
      <Navbar.Text onClick={() => { navi('/login') }}>
        Login
      </Navbar.Text>
    )
  }
  else {
    let userInfo = parseJwt(cred)
    return (
      <Navbar.Text onClick={() => { navi('/login') }}>
        Signed in as: {userInfo.name}
      </Navbar.Text>
    )
  }
}

export default App;
