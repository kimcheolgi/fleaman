import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';


let H4 = styled.h4`
  color : ${ props => props.c };
`;


let H6 = styled.h6`
  color : ${ props => props.c };
`;


function Tables() {
  let a = useSelector((state) => state.bg )
  let { page } = useParams();
  let cred = localStorage.getItem('googleAccount')
  let lastPage = 24;
  return (
    <div style={{height: "100vh"}}>
      <H4 c={a == "light" ? "dark":"white"}>
        플리 게시판(준비중입니다!!!)
      </H4>
      <H6 c={a == "light" ? "dark":"white"}>
        자유롭게 중고 물품 정보를 공유하는 게시판입니다.
      </H6>
      <Row xs={1} md={1} className="g-1">
            
        <Table striped bordered hover variant={a}>
          <thead>
            <tr>
              <th style={{width: "10%"}}>분류</th>
              <th style={{width: "60%"}}>글 제목</th>
              <th style={{width: "20%"}}>작성자</th>
              <th style={{width: "10%"}}>작성일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
              <td>@mdo</td>
            </tr>

            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>

            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
        <Col className='right_button'>
          <div className='paging'>
            <Paging currentPage={Number(page)} lastPage={lastPage}/>
          </div>
        {
          cred != undefined ? 
          <div>
            <Button size="sm" variant="outline-secondary" >
              글쓰기
            </Button>
          </div> 
          : null
        }  
        </Col>
      </Row>
      
    </div>
  );
}

function Paging({ currentPage, lastPage }) {
  let a = useSelector((state) => state.bg )

  let pageList = []
  let ffButton = 1
  let fButton = currentPage != 1 ? currentPage - 1 : currentPage
  let llButton = lastPage
  let lButton = currentPage != lastPage ? currentPage + 1 : lastPage
  let path = '/community/'
  if ( currentPage == 1){
    pageList = [currentPage, currentPage + 1, currentPage + 2]
  }
  else if (currentPage == 2) {
    pageList = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }
  else if (currentPage == lastPage){
    pageList = [currentPage - 2, currentPage - 1, currentPage]
  }
  else if (currentPage + 1 == lastPage) {
    pageList = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1]
  }
  else {
    pageList = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }
  return (
    <nav aria-label='Page navigation'>

      <MDBPagination className='mb-0'>
        <MDBPaginationItem>
          <MDBPaginationLink style={{backgroundColor: "#00000000"}} href={path+ffButton} aria-label='First'>
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>«</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink style={{backgroundColor: "#00000000"}} href={path+fButton} aria-label='Previous'>
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>prev</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
        {
          pageList.map((page, idx)=>{
            return(
              <MDBPaginationItem key={idx}>
                <MDBPaginationLink href={path+page} style={{color: a == "light" ? "black" : "white", backgroundColor: currentPage == page ? "#abaeb1": "#00000000"}}>
                  { page}
                </MDBPaginationLink>
              </MDBPaginationItem>
            )
          })
        }

        <MDBPaginationItem>
          <MDBPaginationLink style={{backgroundColor: "#00000000"}} href={path+lButton} aria-label='Next'>
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>next</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink style={{backgroundColor: "#00000000"}} href={path+llButton} aria-label='Last'>
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>»</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>

  );
}


export default Tables;