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
    ]
  );
  return (
    <div className="App">
      <MetaTag title="FleaMan" desc="중고물품 통합 검색 플랫폼" url="https://fleaman.shop/"/>
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
              src="/logo-white.png"
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

            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <LoginButton/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='row'>
        {
          resize >= 1080 ? <div className="col-md-4 col-sm-0">
          </div> : null 
        }
        <div className={resize >= 1080 ? 'col-md-4': ''}>
          <Suspense 
            fallback={
              <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
            }>
            <Routes>
              <Route path='/' element={
                <div>
                  <div style={{margin: "10px"}}>
                    {/* <CarouselFade /> */}
                    <SearchInput main={true}></SearchInput>
                  </div>
                  {/* <div style={{margin: "50px"}}>
                    <h3>
                      중고물품 통합검색은 <Badge bg="info">FleaMan</Badge>
                    </h3>
                  </div> */}
                  
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
          resize >= 1080 ? 
          <div className="col-md-4 col-sm-0">
            <TopButton></TopButton>
          </div> 
          : null 
        }      
        </div>
    </div>
  );
}

function LoginButton() {
  let cred = localStorage.getItem('googleAccount')
  let navigate = useNavigate();

  if (cred == undefined) {
    return(
      <Navbar.Text onClick={() => { navigate('/login') }}>
        <Button variant="outline-dark">Login</Button>
      </Navbar.Text>
    )
  }
  else {
    let userInfo = parseJwt(cred)
    return (
      <Navbar.Text onClick={() => { navigate('/login') }}>
        <Button variant="outline-dark">Signed in as: {userInfo.name}</Button>
      </Navbar.Text>
    )
  }
}

export default App;
