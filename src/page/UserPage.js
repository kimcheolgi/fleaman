import { useEffect, useState } from 'react';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import MetaTag from '../SEOMetaTag';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge';
import { useParams } from "react-router-dom";

const getLevel = (level) => {
  if (level <= 4){
    return <Badge bg="secondary">level: {level}</Badge>
  }
  else if (level == 5){
    return <Badge bg="success" text="dark">level: {level}</Badge>
  }
  else if (level == 6){
    return <Badge bg="primary">level: {level}</Badge>
  }
  else if (level == 7){
    return <Badge bg="info">level: {level}</Badge>
  }
  else if (level == 8){
    return <Badge bg="warning" text="dark">level: {level}</Badge>
  }
  else if (level == 9){
    return <Badge bg="danger" text="dark">level: {level}</Badge>
  }
  else if (level == 10){
    return <Badge bg="dark" text="dark">level: {level}</Badge>
  }
}

const getImg = (level) => {
  if (level <= 4){
    return "/logo.png"
  }
  else if (level == 5){
    return "/logo.png"
  }
  else if (level == 6){
    return "/logo.png"
  }
  else if (level == 7){
    return "/logo.png"
  }
  else if (level == 8){
    return "/logo.png"
  }
  else if (level == 9){
    return "/logo.png"
  }
  else if (level == 10){
    return "/logo.png"
  }
}


let H3 = styled.h3`
  color : ${ props => props.c };
`;

let H4 = styled.h4`
  color : ${ props => props.c };
`;

let H6 = styled.h6`
  color : ${ props => props.c };
`;

function UserPage() {
  let { nick } = useParams();
  let a = useSelector((state) => state.bg )

  let [level, setLevel] = useState(0);
  let [commentCount, setCommentCount] = useState(0);
  let [dailyCount, setDailyCount] = useState(0);
  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  

  useEffect(() => {
    axios.get("https://api.fleaman.shop/user/get-user?nick_name="+nick)
    .then(function (response) {
      let user_data = response.data;
      setLevel(user_data.level)
      setCommentCount(user_data.comment_cnt)
      setDailyCount(user_data.daily_cnt)
    }).catch(function (error) {
      alert('유저 정보를 가져오는데 실패했습니다.');
    });
  }, [])


  return (
    <div style={{height: "100vh"}}>
      <MetaTag title="User Page" desc="플리맨 유저 페이지 FleaMan User Page" url="https://fleaman.shop/login" keywords=", User Page"/>
      <Card 
        border={a == "light" ? null : "secondary"}
        bg={a}
        text={a == "light" ? "dark" : "light"}
        style={{margin: "5%", padding: "5%"}}>
        <H4 c={a == "light" ? "dark":"white"} className='mt-2'>
          <img
            alt=""
            src="/spin1.gif"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          "{nick}"님의 페이지
        </H4>
        <div className='mb-3'>
          {level != 0 ? getLevel(level):<div></div>}
        </div>
        <div>
          {level != 0 ? 
          <img
            alt=""
            src={getImg(level)}
            width="100"
            height="100"
            className="d-inline-block align-top"
            style={{backgroundColor: "white"}}
          />: <div className="d-inline-block align-top" style={{width: "100px", height: "100px", backgroundColor: "white"}}/>
          }
        </div>
        <H6 c={a == "light" ? "dark":"white"} className='mt-3'>
          작성한 댓글 수: {commentCount}, 출첵 수: {dailyCount}
        </H6>
      </Card>
    </div>

  )
  

}



export default UserPage;

