import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

function CarouselFade() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://scontent.ficn1-1.fna.fbcdn.net/v/t1.6435-9/180065330_2904995319713891_3514262188074743253_n.png?stp=dst-png_s960x960&_nc_cat=110&ccb=1-7&_nc_sid=e3f864&_nc_ohc=wchCfxyhCa4AX--jUAg&_nc_ht=scontent.ficn1-1.fna&oh=00_AT-AD70xTucQrhSEW7H692TSRoqfctE9ORh76HYmqE9BaQ&oe=6361F4A2"
          alt="First slide"
          style={{height: "250px"}}
        />
        <Carousel.Caption>
          {/* <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://scontent.ficn1-1.fna.fbcdn.net/v/t39.30808-6/240656376_4199065030161727_4006416780831999268_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=e3f864&_nc_ohc=mlu_PFFo5CUAX8wLmkM&_nc_ht=scontent.ficn1-1.fna&oh=00_AT9A9KlQQAjXWM6Yf2t-6_MAiu4AwXlwiYTnRzpQ4Ma6Tw&oe=634036A2"
          alt="Second slide"
          style={{height: "250px"}}

        />

        <Carousel.Caption>
          {/* <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://cdn.digitaltoday.co.kr/news/photo/202004/230010_205295_315.png"
          alt="Third slide"
          style={{height: "250px"}}

        />

        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFade;