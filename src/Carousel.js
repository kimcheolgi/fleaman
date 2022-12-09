import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'


let H5 = styled.h5`
  color : ${ props => props.c };
`;

let P = styled.p`
  color : ${ props => props.c };
`;

function FleamanTip() {
  let a = useSelector((state) => state.bg )

  return (
    <Carousel variant={a == "light" ? "dark":"white"} interval="10000">
      {/* <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 안드로이드 어플 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>모바일 크롬에서 fleaman.shop을 들어간다. 우측상단 세 개 점을 누른다. "홈 화면에 추가하기"를 눌러 설치한다.</P>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 아이폰 어플 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>모바일 크롬에서 fleaman.shop을 들어간다. "바로가기 만들기"를 눌러 설치한다.</P>
      </Carousel.Item> */}
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 통합검색 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>메인페이지에서 중고물품 통합검색으로 여러 플랫폼의 결과를 한번에 확인한다.</P>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 스크랩 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>우측 하단의 별모양 버튼을 눌러 스크랩한 뒤 메인페이지에서 스크랩된 물건을 확인한다.</P>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 핫딜 정보 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>핫딜 정보 메뉴를 눌러 저렴한 가격의 핫딜 정보를 확인한다.</P>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 댓글 사용법</H5>
        <P c={a == "light" ? "dark":"white"}>댓글 버튼을 눌러 물건에 달린 댓글을 확인한다. 로그인 후 댓글을 남겨본다.</P>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <H5 c={a == "light" ? "dark":"white"}>플리맨 Tip. 시세 확인하기</H5>
        <P c={a == "light" ? "dark":"white"}>시세를 확인하고 싶은 물건의 메뉴 페이지로 이동한다. 필요시 키워드를 입력해 시세를 확인한다.</P>
      </Carousel.Item>
    </Carousel>
  );
}

export default FleamanTip;