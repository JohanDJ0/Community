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

        if (response.ok) {
            return true;
        } else {
            console.error('Error al seguir el servicio');
            return false;
        }
    } catch(error) {
        console.log("Error al realizar la solicitud: ", error);
        return false;
    }
};