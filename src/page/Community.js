import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';

import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import AdSense from 'react-adsense';
import MetaTag from '../SEOMetaTag';


let H4 = styled.h4`
  color : ${ props => props.c };
`;


let H6 = styled.h6`
  color : ${ props => props.c };
`;

const getDateDiff = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  const diffDate = date1.getTime() - date2.getTime();
  
  return Math.floor(diffDate / (1000 * 60 * 60 * 24));
}

const getDateMatch = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  const diffDate = date1.getDate() - date2.getDate();
  return diffDate == 0;
}

const getLevel = (level) => {
  if (level <= 4){
    return <Badge bg="secondary">{level}</Badge>
  }
  else if (level == 5){
    return <Badge bg="success" text="dark">{level}</Badge>
  }
  else if (level == 6){
    return <Badge bg="primary">{level}</Badge>
  }
  else if (level == 7){
    return <Badge bg="info">{level}</Badge>
  }
  else if (level == 8){
    return <Badge bg="warning" text="dark">{level}</Badge>
  }
  else if (level == 9){
    return <Badge bg="danger">{level}</Badge>
  }
  else if (level == 10){
    return <Badge bg="dark">{level}</Badge>
  }
}

function Tables() {
  let navigate = useNavigate();
  let a = useSelector((state) => state.bg )
  let { page } = useParams();
  let cred = localStorage.getItem('googleAccount')
  let [lastPage, setLastPage] = useState(5);
  let [dataList, setDataList] = useState([]);

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

  useEffect(() => {
    axios.get("https://api.fleaman.shop/table/tables?type=table&page="+page)
    .then(function (response) {
      let data_list = response.data;
      setDataList(data_list[0])
      setLastPage(data_list[1])
    }).catch(function (error) {
      console.log(error, '게시판 정보를 가져오는데 실패했습니다.');
    });
  }, [])

  return (
    <div>
      <MetaTag title="플리 게시판" desc="플리맨 게시판 FleaMan Community Page" url="https://fleaman.shop/content" keywords=", 플리 게시판, Community Page"/>
      <H4 c={a == "light" ? "dark":"white"}>
        플리 게시판
      </H4>
      <H6 c={a == "light" ? "dark":"white"}>
        자유롭게 정보를 공유하는 게시판입니다.
      </H6>
      <Row xs={1} md={1} className="g-1">
            
        <Table striped bordered hover variant={a}>
          <thead>
            <tr style={{fontSize: "0.8rem"}}>
              <th style={{width: "10%"}}>분류</th>
              <th style={{width: "35%"}}>글 제목</th>
              <th style={{width: "15%"}}>조회수</th>
              <th style={{width: "20%"}}>작성자</th>
              <th style={{width: "10%"}}>날짜</th>
            </tr>
          </thead>
          <tbody style={{fontSize: "0.8rem"}}>
            {
              dataList.map((data, idx) => {
                let data_date = !getDateMatch(data.reg_date) ? data.reg_date.split(" ")[0].replaceAll("-", ".").slice(5) : data.reg_date.split(" ")[1].slice(0, 5)
                return (
                  <tr key={idx}>
                    <td>{data.category}</td>
                    <td>
                      <a 
                        href={'/content/'+data._id}
                        onClick={() => {
                          console.log("test")
                        }}
                        style={{color: a == "light" ? "black" : "white"}}
                      >
                        {data.title} 
                        <span style={{color: "gray"}}>
                          [{data.comment_cnt}]
                        </span>
                      </a>
                    </td>
                    <td>{data.view_cnt}</td>
                    <td>
                      <a href={"/page/"+data.name} style={{color: a == "light" ? "black" : "white"}}>
                        {getLevel(data.level)} {data.name}
                      </a>  
                    </td>
                    <td>{data_date}</td>
                  </tr>
                )
              })
            }
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
            <Button size="sm" variant={a == "light" ? "outline-secondary":"secondary"} href="/write">
              글쓰기
            </Button>
          </div> 
          : null
        }  
        </Col>
      </Row>
      
      <div className='mt-5'>
        <AdSense.Google
          style={{ display: 'block' }}
          client='ca-pub-3213525149688431'
          slot='5111538528'
          format='auto'
          responsive="true"
        />
        {/* <AdSense.Google
          style={{ display: 'block' }}
          client='ca-pub-3213525149688431'
          slot='1373843183'
          format='autorelaxed'
          // responsive="true"
        /> */}
      </div>
    </div>
  );
}

function range(start, stop, step) {
  if (typeof stop == 'undefined') {
      // one param defined
      stop = start;
      start = 0;
  }

  if (typeof step == 'undefined') {
      step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
  }

  return result;
};

function Paging({ currentPage, lastPage }) {
  let a = useSelector((state) => state.bg )

  let pageList = []
  let ffButton = 1
  let fButton = currentPage != 1 ? currentPage - 1 : currentPage
  let llButton = lastPage
  let lButton = currentPage != lastPage ? currentPage + 1 : lastPage
  let path = '/community/'

  
  pageList = range(currentPage - 2 >= 1 ? currentPage - 2 : 1, currentPage + 3 <= lastPage + 1 ? currentPage + 3 : lastPage + 1)
  
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
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>{"<"}</span>
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
            <span aria-hidden='true' style={{color: a == "light" ? "black" : "white"}}>{">"}</span>
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