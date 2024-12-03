export const followService = async (id: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`/follow/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        params: {
          token: token,
        },
      }),
    });

    if (response.ok) {
      return true; // Indica éxito
    } else {
      console.error('Error al seguir el servicio');
      return false;
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return false;
  }
};