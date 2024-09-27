import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 4000, // Ajusta la velocidad de transición (en milisegundos)
    slidesToShow: 3, // Mostrar 3 imágenes al mismo tiempo
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Velocidad de autoplay (0 para movimiento continuo)
    cssEase: "linear", // Transición suave
    pauseOnHover: false,
    draggable: false, // Desactiva el arrastre para evitar problemas de rendimiento
    swipe: false, // Desactiva el deslizamiento táctil
  };

  // Estilo para las imágenes con márgenes
  const imageStyle: React.CSSProperties = {
    width: "calc(100% - 20px)", // Ajusta el ancho para que se adapte al contenedor
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    margin: "0 10px",
  };

  // Estilo para el texto debajo de cada imagen
  const textStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "1rem",
    color: "#333", // Ajusta el color según tu diseño
  };

  return (
    <div style={{ width: "100%", margin: "0 auto", overflow: "hidden" }}>
      <Slider {...settings}>
        <div>
          <img
            src="https://w.wallhaven.cc/full/ex/wallhaven-exmxpw.jpg"
            alt="Imagen 1"
            style={imageStyle}
          />
          <div style={textStyle}>Texto para Imagen 1</div>
        </div>
        <div>
          <img
            src="https://w.wallhaven.cc/full/ex/wallhaven-exg77k.jpg"
            alt="Imagen 2"
            style={imageStyle}
          />
          <div style={textStyle}>Texto para Imagen 2</div>
        </div>
        <div>
          <img
            src="https://w.wallhaven.cc/full/43/wallhaven-433rg3.jpg"
            alt="Imagen 3"
            style={imageStyle}
          />
          <div style={textStyle}>Texto para Imagen 3</div>
        </div>
        <div>
          <img
            src="https://w.wallhaven.cc/full/9d/wallhaven-9dp3y1.jpg"
            alt="Imagen 4"
            style={imageStyle}
          />
          <div style={textStyle}>Texto para Imagen 4</div>
        </div>
      </Slider>
    </div>
  );
};

export default ImageCarousel;
