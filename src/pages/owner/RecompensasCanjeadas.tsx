import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, Typography, TableRow, Paper, Button, Card, CardMedia } from "@mui/material";
import RedeemIcon from '@mui/icons-material/Redeem';
import DoneIcon from '@mui/icons-material/Done';
import { API_BASE_URL } from 'components/bdd';
import { Snackbar, Alert } from '@mui/material';
import noImage from '../../assets/NoImagen.png';
import { useTranslation } from 'react-i18next';

interface ServicesProps {
    darkMode: boolean;
}

interface Reward {
    id: number;
    img: string;
    name: string;
    pointsRequired: number;
    user: string;
    entregada: boolean;
    user_id: number;
}

const RecompensasCanjedas: React.FC<ServicesProps> = ({ darkMode }) => {
    const [rewardsData, setRewardsData] = useState<Reward[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para abrir el Snackbar
    const [entregadas, setEntregadas] = useState(false);
    const idService = localStorage.getItem('service');
    const [message, setMessage] = useState(''); // Estado para el mensaje a mostrar
    const { t, i18n } = useTranslation("rewardRedeemed");

    useEffect(() => {
        let isMounted = true;

        const intervalId = setInterval(() => {
            if (isMounted) {
                fetch(`${API_BASE_URL}/get_rewards_by_service`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({params: {service_id: idService}})
                })
                .then((res) => res.json())
                .then((response) => {
                    if (!response.result || response.result.data.length === 0) {
                        console.log("No hay recompensas");
                        setRewardsData([]);  // Si no hay recompensas, aseguramos que rewardsData esté vacío
                    } else {
                        console.log(response);
                        setRewardsData(response.result.data.map((reward: any) => ({
                            id: reward.id,
                            img: reward.image,
                            name: reward.name,
                            pointsRequired: reward.points_required,
                            user: reward.user.name,
                            entregada: reward.entregada,
                            user_id: reward.user.id
                        })));
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener los datos:", error);
                });
            }
          }, 5000);
       
          return () => {
            isMounted = false;
            clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
        };
    }, []);

    const handleEntregar = (rewardId: number, user_id: number) => {
        console.log("ID de la recompensa:", rewardId);
        console.log("User:", user_id);

        fetch(`${API_BASE_URL}/validate_reward_delivery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({params: {reward_id: rewardId, user_id: user_id}})  
        })
        .then(response => response.json())
        .then((data) => {
            if (data.result.status == true){
                console.log("Exito al canjear",data.result);

                setRewardsData(prevRewards =>
                    prevRewards.map(reward =>
                        reward.id === rewardId
                            ? { ...reward, entregada: true } // Actualiza el estado de "entregada"
                            : reward
                    )
                );

                setMessage('Recompensa canjeada correctamente.');
                setOpenSnackbar(true);

            }else{
                console.log("Error al canjear");
                setMessage('No se pudo canjear la recompensa.');
                setOpenSnackbar(true);
            }
        })
        .catch((error) => {
            console.error("Error al cambiar de rol al usuario: ", error.message || "Error desconocido");
        });
    };
  
    return (
        <div className="first-div">
            <div className="second-div">
                <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
                    <RedeemIcon style={{ marginRight: '4px' }} />
                    <span style={{ fontWeight: 'bold' }}>{t("breadcrumbName")}</span>
                    </div>
                    <TableContainer>
                        <Table>
                        <TableRow>
                            <TableCell align="center" sx={{display: { xs: "none", sm: "table-cell" },fontWeight: "bold",}}>{t("image")}</TableCell>
                            <TableCell sx={{ fontWeight: "bold", }}>{t("name")}</TableCell>
                            <TableCell sx={{ fontWeight: "bold",}}>{t("requiredPoints")}</TableCell>
                            <TableCell sx={{ fontWeight: "bold", }}>{t("user")}</TableCell>
                            <TableCell sx={{fontWeight: "bold",}}>{t("status")}</TableCell>
                        </TableRow>
                        <TableBody>
                        {rewardsData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    {t("emptyMessage")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rewardsData.map((reward, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                    <CardMedia
                                      component="img"
                                      height="50"
                                      width="50"
                                      image={reward.img ? `data:image/jpeg;base64,${atob(reward.img)}` : noImage}
                                      alt={reward.name}
                                    />
                                  </TableCell>
                                  <TableCell>{reward.name}</TableCell>
                                  <TableCell>{reward.pointsRequired}</TableCell>
                                  <TableCell>{reward.user}</TableCell>
                                  <TableCell>
                                    {!reward.entregada ? (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => handleEntregar(reward.id, reward.user_id)}
                                      >
                                        <DoneIcon sx={{ marginRight: 0.5 }} />
                                        Entregar
                                      </Button>
                                    ) : (
                                      <Typography color="text.secondary">Entregado</Typography>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Tiempo que durará visible el Snackbar
                onClose={() => setOpenSnackbar(false)} // Cierra el Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centra el Snackbar en la parte superior
                >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    {message}
                </Alert>
                </Snackbar>
            </div>
        </div>

    );
};

export default RecompensasCanjedas;