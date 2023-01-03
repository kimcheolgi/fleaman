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

function Edit() {
  let navigate = useNavigate();
  let { id } = useParams();
  let a = useSelector((state) => state.bg )
  let [category, setCategory] = useState("분류");
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [value, setValue] = useState("");
  let [categoryList, setCategoryList] = useState(["자유", "질문", "잡담"]);
  let [token, setToken] = useState("");
  const [boardColor, setBoardColor] = useState(false)

  useEffect(() => {
    let cred = localStorage.getItem('googleAccount')
    if (cred != undefined){
      setToken(cred)
      let userInfo = parseJwt(cred)
      axios.get("https://api.fleaman.shop/table/tables?type=content&table_id="+id)
      .then(function (response) {
        let contentData = response.data;
        if (contentData.email != userInfo.email){
          alert('유저정보가 일치하지 않습니다.')
          navigate('/community/1')
        }
        else {
          setTitle(contentData.title)
          setContent(contentData.content[0])
          setValue(contentData.content)
          setCategory(contentData.category)
        }
      }).catch(function (error) {
        console.log(error, '정보를 가져오는데 실패했습니다.');
        alert('정보를 가져오는데 실패했습니다.')
        navigate('/community/1')
      });
    }
    else {
      alert("로그인이 필요한 서비스입니다.")
      navigate('/')
    }
  }, [])

  return (
    <div style={{height: "100vh"}}>
      <MetaTag title="Community Edit" desc="플리맨 게시판 작성 페이지 FleaMan Community Edit Page" url="https://fleaman.shop/edit" keywords=", Edit Page"/>
      <H4 c={a == "light" ? "dark":"white"}>게시물 수정</H4>
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
          value={content}
          onChange={(e)=>{ 
            setContent(e.target.value)
          }}
        />
      </InputGroup> */}
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
            const formdata = new FormData();
            formdata.append(
              "file",
              files[0],
            )
            const headers={'Content-Type': files[0].type}
            axios.post("https://api.fleaman.shop/table/upload-image", 
              formdata, headers)
              .then(function (response) {
                let imageName = response.data
                let newValue = value + "\n\n !["+ files[0].name +"](https://image.fleaman.shop/"+ imageName + ")"
                setValue(newValue)
                console.log(response); //"dear user, please check etc..."
              });
            setBoardColor(false)
          }}
        >
        <MDEditor
          value={value}
          onChange={setValue}
          style={{
            backgroundColor: boardColor ? "#adb5bd": null
          }}
        />
      </FileDrop>
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
          else if (content == ""){
            alert("내용을 입력해주세요.")
          }
          else {
            axios.post("https://api.fleaman.shop/table/update", {
              type: "table",
              content: content,
              google_token: token,
              category: category,
              title: title,
              data_id: id
            }).then(function (response) {
              alert('게시물이 수정되었습니다.')
              navigate('/community/1')
            }).catch(function (error) {
              alert('게시물 수정에 실패했습니다.');
            });
          }
        }}
      >
        수정하기
      </Button>
    </div>
  )
  

}



export default Edit;

