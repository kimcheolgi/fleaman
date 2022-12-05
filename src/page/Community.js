import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Tables() {
  let { page } = useParams();
  let cred = localStorage.getItem('googleAccount')
  let lastPage = 24;
  return (
    <>
      <h4>
        플리 게시판
      </h4>
      <h6>
        자유롭게 중고 물품 정보를 공유하는 게시판입니다.
      </h6>
      <img
          alt=""
          src="/logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '} FleaMan
      <Row xs={1} md={1} className="g-1">
            
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{width: "20%"}}>작성자</th>
              <th style={{width: "55%"}}>글 제목</th>
              <th style={{width: "25%"}}>작성 일시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
            </tr>

            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>Jacob</td>
              <td>ㅁ</td>
              <td>@fat</td>
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
            <Button size="sm">
              글쓰기
            </Button>
          </div> 
          : null
        }  
        </Col>
      </Row>
      
    </>
  );
}

function Paging({ currentPage, lastPage }) {
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
    <Pagination size='sm'>
      <Pagination.First href={path+ffButton} />
      <Pagination.Prev href={path+fButton} />
      {
        pageList.map((page, idx)=>{
          return(
            <Pagination.Item 
              key={idx} 
              href={path+page} 
              active={currentPage == page}
            >
              {page}
            </Pagination.Item>
          )
        })
      }
      <Pagination.Next href={path+lButton} />
      <Pagination.Last href={path+llButton} />
    </Pagination>
  );
}


export default Tables;