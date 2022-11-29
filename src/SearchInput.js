
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


function SearchInput({main}) {
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
        localStorage.setItem('searched', JSON.stringify(newItems))
        setSearchedKeyword(newItems)
      } 
      
    }

  }, [searchKeyword])

  return (
    <div>
      <img
          alt=""
          src="/logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '} FleaMan
      <div>
      <InputGroup className="mb-3 mt-1">
        <Form.Control
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
            // border="warning" 
            className="mb-2"
            style={{textAlign: "left"}}
          >
            <Card.Header>
              <Card.Text>
                <Row>
                  <Col md={8}>최근 검색</Col>
                  <Col md={4} style={{textAlign: "right"}}>
                    <Button 
                      variant="secondary" 
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
                    style={{padding: '5px', margin: '5px'}}
                    variant="light"
                    key={i}
                    onMouseDown={() => {
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