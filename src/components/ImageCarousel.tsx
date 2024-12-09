import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "./bdd";

interface Service {
  id: number;
  name: string;
  image: string;
  qualification: number;
  description: string | boolean;
}
interface ServicesProps {
  darkMode: boolean;
}

const ImageCarousel: React.FC<ServicesProps> = ({ darkMode }) =>{
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga

  const dataToken = {
    params: {
      token: localStorage.getItem("token")
    }
  }


  useEffect(() => {
    setLoading(true); // Establece el estado de carga en true al iniciar la solicitud
    fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToken),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.result)
        if (response.result && Array.isArray(response.result)) {
          const services: Service[] = response.result; // Aseguramos el tipo
          setData(services);
          setLoading(false);
        } else {
          console.error("Formato de datos inesperado:", response);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        setLoading(false); // Manejo de error: establece el estado de carga en false
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    draggable: false,
    swipe: false,
  };

  const imageStyle: React.CSSProperties = {
    width: "calc(100% - 20px)",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    margin: "0 10px",
  };

  const textStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "1.5rem",
    color: "#333",
    fontWeight: "bold",
  };

  return (
    <div style={{ width: "100%", margin: "0 auto", overflow: "hidden",color: darkMode ? '#aaa' : '#000'  }}>
      {loading ? (
        <p>Obteniendo servicios...</p> // Muestra el mensaje mientras se cargan los datos
      ) : data.length > 0 ? (
        <Slider {...settings}>
          {data.map((service) => (
            <div key={service.id}>
              <img
                src={
                  service.image
                    ? `data:image/jpeg;base64,${atob(service.image)}`
                    : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"
                }
                alt={service.name}
                style={imageStyle}
              />
              <div style={textStyle}>{service.name}</div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No se encontraron servicios.</p> // Mensaje en caso de que no haya datos
      )}
    </div>
  );
};

export default ImageCarousel;