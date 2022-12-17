
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


function SearchInput({main}) {
  let a = useSelector((state) => state.bg )
  const navigate = useNavigate();
  let [inputValue, setInputValue] = useState('');
  let [searchKeyword, setSearchKeyword] = useState('_');
  let [searchedKeyword, setSearchedKeyword] = useState(JSON.parse(localStorage.getItem('searched')));
  let [keyUp, setKeyUp] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('searched') == undefined) {
      setSearchedKeyword([])
    }
  }, [])

  useEffect(() => {
    console.log(searchKeyword)
    if (searchKeyword != '_'){
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
              setSearchKeyword(inputValue)
              navigate({
                pathname: ".",
                search: '?query='+inputValue,
              });
              setInputValue("")
            }
          }}
        />
        <Button 
          variant="outline-secondary" 
          id="button-addon2"
          onClick={() => {
            setSearchKeyword(inputValue)
            navigate({
              pathname: ".",
              search: '?query='+inputValue,
            });
            setInputValue("")
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
                        search: '?query='+item,
                      });
                      
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