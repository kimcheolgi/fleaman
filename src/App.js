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

const ContentsList = lazy(() => import('./page/ContentsList'))
const TestContentsList = lazy(() => import('./page/TestContentsList'))

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
  let [macbook_air, setMacbook_air] = useState(['M1']);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => { navigate('/') }}><Badge bg="info">FleaMan</Badge></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <NavDropdown title="MacBook Air" id="basic-nav-dropdown">
                {
                  macbook_air.map((m, idx)=>{
                    return (
                      <NavDropdown.Item key={idx} onClick={()=>{ navigate('/list/macbookair/'+m)}}>{m}</NavDropdown.Item>
                    )
                  })
                }
              </NavDropdown> */}
              <NavDropdown title="MacBook Air" id="basic-nav-dropdown">
                {
                  macbook_air.map((m, idx)=>{
                    return (
                      <NavDropdown.Item key={idx} onClick={()=>{ navigate('/test/macbookair/'+m)}}>{m}</NavDropdown.Item>
                    )
                  })
                }
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='row'>
        {
          resize >= 1080 ? <div className="col-md-2 col-sm-0"></div> : null 
        }
        <div className='col-md-8'>
          <Suspense fallback={<div>로딩중임</div>}>
            <Routes>
              <Route path='/' element={
                // <div>홈입니다.</div>
                <div>
                  <div style={{margin: "10px"}}>
                    <CarouselFade />
                  </div>
                  <div style={{margin: "50px"}}>
                    <h2>
                      중고물품 통합검색은 <Badge bg="info">FleaMan</Badge>
                    </h2>
                  </div>
                  {/* <div style={
                    { 
                      height: resize >= 1080 ? "300px" : "200px", 
                      width: 'auto', 
                      backgroundSize: "cover", 
                      backgroundPosition: "center", 
                      backgroundImage: 'url(' + coverimage + ')' 
                    }
                  }></div> */}
                  
                </div>
              }>
              </Route>
              <Route path='/list/:categoryName/:itemName' element={
                    <ContentsList />
                } />
              <Route path='/test/:categoryName/:itemName' element={
                    <TestContentsList />
                } />
            </Routes>
          </Suspense>
        </div>
        {
          resize >= 1080 ? <div className="col-md-2 col-sm-0"></div> : null 
        }      
        </div>
    </div>
  );
}

export default App;
