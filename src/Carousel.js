import Carousel from 'react-bootstrap/Carousel';

function FleamanTip() {
  return (
    <Carousel variant="dark" interval="10000">
      <Carousel.Item className='mb-3'>
        <h5>플리맨 Tip. 통합검색 사용법</h5>
        <p>메인페이지에서 중고물품 통합검색으로 여러 플랫폼의 결과를 한번에 확인한다.</p>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <h5>플리맨 Tip. 스크랩 사용법</h5>
        <p>우측 하단의 별모양 버튼을 눌러 스크랩한 뒤 메인페이지에서 스크랩된 물건을 확인한다.</p>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <h5>플리맨 Tip. 핫딜 정보 사용법</h5>
        <p>핫딜 정보 메뉴를 눌러 저렴한 가격의 핫딜 정보를 확인한다.</p>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <h5>플리맨 Tip. 댓글 사용법</h5>
        <p>댓글 버튼을 눌러 물건에 달린 댓글을 확인한다. 로그인 후 댓글을 남겨본다.</p>
      </Carousel.Item>
      <Carousel.Item className='mb-3'>
        <h5>플리맨 Tip. 시세 확인하기</h5>
        <p>시세를 확인하고 싶은 물건의 메뉴 페이지로 이동한다. 필요시 키워드를 입력해 시세를 확인한다.</p>
      </Carousel.Item>
    </Carousel>
  );
}

export default FleamanTip;