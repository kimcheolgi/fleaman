import { useEffect, useState } from 'react';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import MetaTag from '../SEOMetaTag';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge';
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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

function Write() {
  let a = useSelector((state) => state.bg )
  let [category, setCategory] = useState("분류");
  let [title, setTitle] = useState("");
  let [categoryList, setCategoryList] = useState(["자유", "질문", "잡담"]);
  return (
    <div style={{height: "100vh"}}>
      <MetaTag title="Community Write" desc="플리맨 게시판 작성 페이지 FleaMan Community Write Page" url="https://fleaman.shop/write" keywords=", Write Page"/>
      
      <InputGroup className="mb-3">

        <DropdownButton
        variant="outline-secondary"
        title={category}
        id="input-group-dropdown-1"
        onSelect={(e)=>{ 
          setCategory(e)
        }}
      >
        {
          categoryList.map((category, idx) => {
            return (
              <Dropdown.Item
                key={idx}
                eventKey={category}
              >
                {category}
              </Dropdown.Item>
            )
          })
        }
        </DropdownButton>
        <Form.Control
          style={{
            backgroundColor: a == "light" ? null : "#212529", 
            border: a == "light" ? null : "1px solid #6c757d",
            color: a == "light" ? "black" : "white"
          }}
          placeholder={"제목을 입력해주세요"}
          aria-label={"제목을 입력해주세요"}
          aria-describedby="basic-addon2"
          onChange={(e)=>{ 
            setTitle(e.target.value)
          }}
          value={title}
        />
      </InputGroup>
    </div>

  )
  

}



export default Write;

