export const coins = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            token: token,
          }
        })
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data.result?.success) {
        return true; // Éxito: se actualizaron las monedas
      } else {
        return false; // Fallo: límite alcanzado u otro error
      }
    } catch (error) {
      console.error("Error al realizar la solicitud: ", error);
      return false; // Fallo: solicitud no realizada correctamente
    }
  };
  