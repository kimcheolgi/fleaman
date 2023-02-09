import { useEffect, useState } from 'react';
import {handleCredentialResponse, parseJwt} from '../utils.js'
import MetaTag from '../SEOMetaTag';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge';
import { useParams, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import MDEditor from '@uiw/react-md-editor';
import { FileDrop } from 'react-file-drop'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
  let navigate = useNavigate();
  let a = useSelector((state) => state.bg )
  let [category, setCategory] = useState("분류");
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [categoryList, setCategoryList] = useState(["자유", "질문", "정보", "건의"]);
  let [token, setToken] = useState("");
  const [value, setValue] = useState("**내용을 입력해주세요.**");
  const [boardColor, setBoardColor] = useState(false)


  let cred = localStorage.getItem('googleAccount')

  useEffect(() => {
    if (cred != undefined){
      axios.post("https://api.fleaman.shop/user/login", {
        google_token: cred
      }).then(function (response) {
        let user_data = response.data;
        if (user_data.admin){
          setCategoryList(["공지", "자유", "질문", "정보", "건의"])
        }
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
      });
    }
  }, [])

  useEffect(() => {
    let cred = localStorage.getItem('googleAccount')
    if (cred != undefined){
      setToken(cred)
    }
    else {
      alert("로그인이 필요한 서비스입니다.")
      navigate('/')
    }
  }, [])

  useEffect(() =>{
    console.log(value)
  }, [value])
  return (
    <div>
      <MetaTag title="Community Write" desc="플리맨 게시판 작성 페이지 FleaMan Community Write Page" url="https://fleaman.shop/write" keywords=", Write Page"/>
      <H4 c={a == "light" ? "dark":"white"}>게시물 작성</H4>
      <H6 c={a == "light" ? "dark":"white"}>광고 또는 욕설 및 음란물의 경우 경고없이 삭제 및 제재합니다</H6>
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
      {/* <InputGroup>
        <Form.Control 
          as="textarea" 
          aria-label="With textarea"
          style={{
            backgroundColor: a == "light" ? null : "#212529", 
            border: a == "light" ? null : "1px solid #6c757d",
            color: a == "light" ? "black" : "white",
            height: "75vh"
          }}
          onChange={(e)=>{ 
            setContent(e.target.value)
            console.log(content)
          }}
        />
      </InputGroup> */}
      <Row>
        <Col sm={12} md={12}>
          <FileDrop
            // onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
            // onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
            // onFrameDrop={(event) => console.log('onFrameDrop', event)}
            onDragOver={(event) => {
              console.log('onDragOver', event)
              setBoardColor(true)
            }}
            onDragLeave={(event) => {
              console.log('onDragLeave', event)
              setBoardColor(false)
            }}
            
            onDrop={(files, event) => {
              console.log('onDrop!', files, event)
              console.log(files[0])
              const formdata = new FormData();
              formdata.append(
                "file",
                files[0],
              )
              const headers={'Content-Type': files[0].type}
              if (files[0].size >= 5000000){
                alert("5MB 이상 파일은 업로드가 불가능합니다.")  
              }
              else if (files[0].type == 'image/png' || files[0].type == 'image/jpeg' || files[0].type == 'image/jpg' ){
                axios.post("https://api.fleaman.shop/table/upload-image", 
                formdata, headers)
                .then(function (response) {
                  let imageName = response.data
                  
                  let newValue = value + "\n\n !["+ files[0].name +"](https://image.fleaman.shop/"+ imageName + ")"
                  setValue(newValue)
                  
                  console.log(response); //"dear user, please check etc..."
                });
              }
              else {
                alert("png, jpg, jpeg 파일이 아닙니다.")
              }
              
              setBoardColor(false)
            }}
          >
          <MDEditor
            value={value}
            onChange={setValue}
            preview="edit"
            height={500}
            style={{
              backgroundColor: boardColor ? "#adb5bd": null
            }}
          />
          </FileDrop>
        </Col>
        <Col sm={12} md={12}>
          <MDEditor.Markdown 
            source={value} 
            style={{ 
              whiteSpace: 'pre-wrap',  
              backgroundColor: a == "light" ? "#f2f3f4":"#343a40",
              textAlign: "left",
              height: "500px",
              overflow: "scroll"
            }} 
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button 
            className='mt-3'
            size="xl"
            variant={a == "light" ? "outline-secondary":"secondary"}
            onClick={() => {
              if (category == "분류"){
                alert("게시물 분류를 선택해주세요.")
              }
              else if (title == ""){
                alert("제목을 입력해주세요.")
              }
              else if (value == ""){
                alert("내용을 입력해주세요.")
              }
              else {
                axios.post("https://api.fleaman.shop/table/insert", {
                  type: "table",
                  content: value,
                  google_token: token,
                  category: category,
                  title: title
                }).then(function (response) {
                  alert('게시물이 등록되었습니다.')
                  navigate('/community/1')
                }).catch(function (error) {
                  alert('게시물 작성에 실패했습니다.');
                });
              }
            }}
          >
            글쓰기
          </Button>
        </Col>
      </Row>
    </div>
  )
  

}



export default Write;

