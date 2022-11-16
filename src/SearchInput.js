
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import MainContentsList from './page/MainContentsList';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import TestContentsList from './page/TestContentsList';
import { useNavigate } from "react-router-dom";

function SearchInput({main}) {
  const navigate = useNavigate();
  let [inputValue, setInputValue] = useState('');
  let [searchKeyword, setSearchKeyword] = useState('_');

  useEffect(() => {
    console.log(searchKeyword)
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
      <InputGroup className="mb-3 mt-1">
        <Form.Control
          placeholder="검색어를 입력하세요"
          aria-label="검색어를 입력하세요"
          aria-describedby="basic-addon2"
          onChange={(e)=>{ 
            setInputValue(e.target.value)
          }}
          value={inputValue}
          onKeyPress={(e) => {
            if (e.key == 'Enter'){
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
            // setSearchKeyword(inputValue)
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
    {
      main ? <MainContentsList/> : <TestContentsList/>
    }
  </div>
  )
}

export default SearchInput;