
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import MainContentsList from './page/MainContentsList';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import TestContentsList from './page/TestContentsList';
import { useNavigate } from "react-router-dom";
import { Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FleamanTip from './Carousel';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function SearchInput({main}) {
  let a = useSelector((state) => state.bg )
  const navigate = useNavigate();
  let [inputValue, setInputValue] = useState('');
  let [searchKeyword, setSearchKeyword] = useState('_');
  let [searchedKeyword, setSearchedKeyword] = useState(JSON.parse(localStorage.getItem('searched')));
  let [keyUp, setKeyUp] = useState(false)
  let [platformList, setPlatformList] = useState(["전체 플랫폼", "번개장터", "당근마켓", "네이버 카페", "헬로마켓"])
  let [platform, setPlatform] = useState("전체 플랫폼")

  useEffect(() => {
    if (localStorage.getItem('searched') == undefined) {
      setSearchedKeyword([])
    }
  }, [])

  useEffect(() => {
    console.log(searchKeyword)
    if (searchKeyword != '_' && searchKeyword != ""){
      let searchedItems = JSON.parse(localStorage.getItem('searched'))
      if (searchedItems == undefined) {
        localStorage.setItem('searched', JSON.stringify([searchKeyword])) 
        setSearchedKeyword([searchKeyword])
      }
      else{
        let newItems = [searchKeyword, ...searchedItems].slice(0,10)
        let setItems = new Set(newItems)
        let uniqueItems = [...setItems];
        localStorage.setItem('searched', JSON.stringify(uniqueItems))
        setSearchedKeyword(uniqueItems)
      } 
      
    }

  }, [searchKeyword])

  return (
    <div>
      {
        main ? 
        <FleamanTip />
        :
        null
      }
      <div>
      <InputGroup className="mb-3 mt-1">
        {
          main ? null :
        
        <DropdownButton
          variant="outline-secondary"
          title={platform}
          id="input-group-dropdown-1"
          onSelect={(e)=>{ 
            setPlatform(e)
          }}
        >
          {
            platformList.map((platform, idx) => {
              return (
                <Dropdown.Item
                  key={idx}
                  eventKey={platform}
                >
                  {platform}
                </Dropdown.Item>
              )
            })
          }
        </DropdownButton>
        }
        <Form.Control
          style={{
            backgroundColor: a == "light" ? null : "#212529", 
            border: a == "light" ? null : "1px solid #6c757d",
            color: a == "light" ? "black" : "white"
          }}
          placeholder={main ? "중고물품 통합검색" : "카테고리 안에서 검색"}
          aria-label={main ? "중고물품 통합검색" : "카테고리 안에서 검색"}
          aria-describedby="basic-addon2"
          onChange={(e)=>{ 
            setInputValue(e.target.value)
          }}
          value={inputValue}
          onPointerUp={(e) => {
            setKeyUp(true)
          }}

          onBlur={(e) => {
            setKeyUp(false)
          }}
          onKeyPress={(e) => {
            if (e.key == 'Enter'){
              // if (inputValue != ""){
                setSearchKeyword(inputValue)
                navigate({
                  pathname: ".",
                  search: '?query='+inputValue+"&platform="+platform,
                });
                window.location.reload()
                setInputValue("")
              // }
              // else {
              //   alert("검색어를 입력해주세요.")
              // }
            }
          }}
        />
        <Button 
          variant="outline-secondary" 
          id="button-addon2"
          onClick={() => {
            // if (inputValue != ""){
              setSearchKeyword(inputValue)
              navigate({
                pathname: ".",
                search: '?query='+inputValue+"&platform="+platform,
              });
              window.location.reload()
              setInputValue("")
            // }
            // else {
            //   alert("검색어를 입력해주세요.")
            // }
          }}
        >
          검색
        </Button>
      </InputGroup>
      {keyUp ? 
          <Row xs={1} md={1} className="g-1">      

          <Card
            border={a == "light" ? null : "secondary"}
            className="mb-2"
            style={{textAlign: "left"}}
            bg={a == "light" ? null : "dark"}
            text={a == "light" ? "dark" : "light" }
          >
            <Card.Header>
              <Card.Text>
                <Row>
                  <Col>최근 검색
                  
                    <Button 
                      className='share'
                      variant={a == "light" ? "outline-secondary" : "secondary"} 
                      style={{padding: "2px"}}
                      onMouseDown={() => {
                        localStorage.setItem('searched', JSON.stringify([]))
                        setSearchedKeyword([])
                      }}> 
                    검색 삭제 
                    </Button>
                  </Col>
                </Row>
              </Card.Text>
            </Card.Header>
            <Card.Body>
            {searchedKeyword.map((item, i) => {
              return(
                  <Button
                    style={{
                      padding: '5px', 
                      margin: '5px',
                    }}
                    variant={a == "light" ? "light" : "secondary"}
                    key={i}
                    onMouseDown={() => {
                      let searchedItems = JSON.parse(localStorage.getItem('searched'))
                      let newItems = [item, ...searchedItems].slice(0,10)
                      let setItems = new Set(newItems)
                      let uniqueItems = [...setItems];
                      localStorage.setItem('searched', JSON.stringify(uniqueItems))
                      setSearchedKeyword(uniqueItems)
                      navigate({
                        pathname: ".",
                        search: '?query='+item+"&platform="+platform,
                      });
                      window.location.reload()
                      
                    }}
                  >
                    {item}
                  </Button>
              )
            })}
            </Card.Body>
          </Card>
        </Row> : null
        }
      </div>
    {
      main ? <MainContentsList/> : <TestContentsList/>
    }
  </div>
  )
}

export default SearchInput;