import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ContentsComponent from "../ContentsComponent";
import Loader from "../Loader.js";
import TopButton from "../TopButton";
import Table from 'react-bootstrap/Table';
import MetaTag from "../SEOMetaTag";
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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

const getDateDiff = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();
  
  return Math.floor(diffDate / (1000 * 60 * 60 * 24));
}


const getHourDiff = (d) => {
  const date1 = new Date();
  const date2 = new Date(d);
  
  const diffDate = date1.getTime() - date2.getTime();

  return Math.floor(diffDate / (1000 * 60 * 60));
}

let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function DailyCheck() {
  let cred = localStorage.getItem('googleAccount')

  let a = useSelector((state) => state.bg )
  const [ref, inView] = useInView();

  const location = useLocation()
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
  let [inputValue, setInputValue] = useState('');
  let [searchKeyword, setSearchKeyword] = useState('_');
  let [totalData, setTotalData] = useState([]);
  let [scrollId, setScrollId] = useState('first');
  let [moreFlag, setMoreFlag] = useState(true)
  let [loading, setLoading] = useState(true)
  let [empty, setEmpty] = useState(false)
  let [viewItems, setViewItems] = useState([])
  let count = 20
  let [offset, setOffset] = useState(0);
  useEffect(() => {
    setLoading(true)
    setEmpty(false)
    let url = "https://api.fleaman.shop/table/tables?genre=daily&count="+count+"&offset="+offset
    axios.get(url)
      .then((result) => {
        let productData = result.data
        setOffset(offset + count)
        setViewItems(productData)
        if (productData.length == 0){
          setMoreFlag(false)
          setEmpty(true)
        }
        else {
          setMoreFlag(true)
        }
      })
      .catch(() => {
        console.log('데이터 로드 실패')
      })
    }, []
  )

  useEffect(()=>{
    if(viewItems.length !==0 && inView) {
      let url = "https://api.fleaman.shop/table/tables?genre=daily&count="+count+"&offset="+offset
      axios.get(url)
        .then((result) => {
          let productData = result.data
          let copyData = [...viewItems]
          let dataCopy = [...copyData, ...productData]
          setViewItems([...new Set(dataCopy)])
          setOffset(offset + count)
          if (productData.length == 0){
            setMoreFlag(false)
          }
        })
        .catch((error) => {
          if (error.response.status == 500){
            window.location.reload();
          }
        })
      }
  },[inView]);

  useEffect(() => {
    setLoading(false)
  }, [totalData])

  
  function getNewPrice(price) {
    let nPrice = Math.round(price / 1000) * 1000
    nPrice = nPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return nPrice
  }


  if (loading){
    return (
      <Row xs={1} md={1} className="g-1">      
        <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
      </Row>
    )
  }
  else if (empty){
    return (
      <div>
        <h2>
          검색 결과가 없습니다.
        </h2>
      </div>
    )
  }
  else {
    return(
      <div>
        <MetaTag title="dailycheck" desc={"플리맨 춣석체크"} url={"https://fleaman.shop/dailycheck"} keywords={", 출석체크, 핫딜, 핫딜 정보, 뽐뿌, 루리웹, 클리앙, 쿨엔조이"} />


        <H4 c={a == "light" ? "dark":"white"}>출석체크 페이지</H4>
        <H6 c={a == "light" ? "dark":"white"}>출석체크를 하고 레벨을 올려보세요</H6>  
        
        <InputGroup className="mb-3 mt-1">
        
          <Form.Control
            style={{
              backgroundColor: a == "light" ? null : "#212529", 
              border: a == "light" ? null : "1px solid #6c757d",
              color: a == "light" ? "black" : "white"
            }}
            placeholder="출석 메세지"
            aria-label="출석 메세지"
            aria-describedby="basic-addon2"
            onChange={(e)=>{ 
              setInputValue(e.target.value)
            }}
            value={inputValue}
            onKeyPress={(e) => {
              if (e.key == 'Enter'){
                if (inputValue != ""){
                  if (cred != undefined){
                    axios.post("https://api.fleaman.shop/table/insert", {
                      genre: "daily",
                      content: inputValue,
                      google_token: cred
                    }).then(function (response) {
                      let res = response.data;
                      if (res) {
                        window.location.reload();
                      }
                      else {
                        alert("이미 출석체크 하셨습니다")
                      }
                    }).catch(function (error) {
                      alert('출석체크에 실패했습니다');
                    });
                  }
                  else {
                    alert("로그인이 필요한 서비스입니다")
                  }
                  setInputValue("")
                }
                else {
                  alert("메세지를 입력해주세요")
                }
              }
            }}
          />
          <Button 
            variant="outline-secondary" 
            id="button-addon2"
            onClick={() => {
              if (inputValue != ""){
                if (cred != undefined){
                  axios.post("https://api.fleaman.shop/table/insert", {
                    genre: "daily",
                    content: inputValue,
                    google_token: cred
                  }).then(function (response) {
                    let res = response.data;
                    if (res) {
                      window.location.reload();
                    }
                    else {
                      alert("이미 출석체크 하셨습니다")
                    }
                  }).catch(function (error) {
                    alert('출석체크에 실패했습니다');
                  });
                }
                else {
                  alert("로그인이 필요한 서비스입니다")
                }
                setInputValue("")
              }
              else {
                alert("메세지를 입력해주세요")
              }
            }}
          >
            등록
          </Button>
        </InputGroup>

        {
          loading ?
          <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>      
            <Loader type="spokes" color="#E5FFCC" message="로딩중입니다" />
          </Row> 
          :
          <Row xs={1} md={1} className="g-1" style={{height: "100vh"}}>
            {
              viewItems.map((cData, idx)=>{
                return(
                  <CheckCard key={idx} a={a} data={cData} /> 
                )
              })
            }
          </Row>
        }   

        {
          moreFlag ? <Button ref={ref} style={{margin:"30px"}} variant="outline-primary" onClick={()=>{
            let url = "https://api.fleaman.shop/table/tables?genre=daily&count="+count+"&offset="+offset
            axios.get(url)
              .then((result) => {
                let productData = result.data
                let copyData = [...viewItems]
                let dataCopy = [...copyData, ...productData]
                setViewItems([...new Set(dataCopy)])
                setOffset(offset + count)
                if (productData.length == 0){
                  setMoreFlag(false)
                }
              })
              .catch((error) => {
                if (error.response.status == 500){
                  window.location.reload();
                }
              })
                  

          }}> More...</Button> : null
        }
        {
          resize <= 1080 ? 
          <TopButton></TopButton> : null
        }
      </div>
    )
  }
}

const CheckCard = ({a, data}) => {
  let dateDiff = getDateDiff(data.reg_date);
  let hourDiff = getHourDiff(data.reg_date);
  let diffDate = dateDiff >= 1 ? dateDiff + "일 전" : hourDiff != 0 ? hourDiff + "시간 전" : "방금 전"
  return (
    <Col className='mt-2'>
      <Card 
          style={{
            padding: "10px", 
            textAlign: "left",
            border: "1px solid #00000000",
            backgroundColor: a == "light" ? "#f2f3f4": "#343a40"
          }}
          border={null}
          text={a == "light" ? "dark" : "light" }
          >
        <Card.Title>
          <Row>
            <Col xs={8} md={8}>
              {getLevel(data.level)} {data.nick_name}  
            </Col>
            <Col xs={4} md={4} style={{textAlign: "right"}}>
              <small className="text-muted">{diffDate}</small>
            </Col>
          </Row>
        </Card.Title>
        <Card.Text>
          {data.content}
        </Card.Text>
      </Card>
    </Col>
  )
}

export default DailyCheck;