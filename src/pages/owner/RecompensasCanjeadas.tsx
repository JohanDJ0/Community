import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, Typography, TableRow, Paper, Button, Card, CardMedia } from "@mui/material";
import RedeemIcon from '@mui/icons-material/Redeem';
import DoneIcon from '@mui/icons-material/Done';
import { API_BASE_URL } from 'components/bdd';
import noImage from '../../assets/NoImagen.png';

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
    // Datos de ejemplo
    const rewards = [
    {
        img: 'https://via.placeholder.com/50',
        name: 'Recompensa 1',
        pointsRequired: 100,
        user: 'Usuario 1',
        action: 'Entregada',
    },
    {
        img: 'https://via.placeholder.com/50',
        name: 'Recompensa 2',
        pointsRequired: 200,
        user: 'Usuario 2',
        action: 'Entregada',
    },
    {
        img: 'https://via.placeholder.com/50',
        name: 'Recompensa 2',
        pointsRequired: 200,
        user: 'Usuario 2',
        action: 'Entregada',
    },
    {
        img: 'https://via.placeholder.com/50',
        name: 'Recompensa 2',
        pointsRequired: 200,
        user: 'Usuario 2',
        action: 'Entregada',
    },
    ];

    const [rewardsData, setRewardsData] = useState<Reward[]>([]);
    const [entregadas, setEntregadas] = useState(false);
    const idService = localStorage.getItem('service');

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
      
        // Aquí va la lógica de tu función, por ejemplo, una solicitud de API
        // fetch('/api/entregar', { method: 'POST', body: JSON.stringify({ id: rewardId, entregada }) })
    };
  
    return (
        <div className="first-div">
            <div className="second-div">
                <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
                    <RedeemIcon style={{ marginRight: '4px' }} />
                    <span style={{ fontWeight: 'bold' }}>Recompensas canjeadas</span>
                    </div>
                    <TableContainer>
                        <Table>
                        <TableRow>
                            <TableCell align="center" sx={{display: { xs: "none", sm: "table-cell" },fontWeight: "bold",}}>Imagen</TableCell>
                            <TableCell sx={{ fontWeight: "bold", }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: "bold",}}>Puntos Requeridos</TableCell>
                            <TableCell sx={{ fontWeight: "bold", }}>Usuario</TableCell>
                            <TableCell sx={{fontWeight: "bold",}}>Acción</TableCell>
                        </TableRow>
                        <TableBody>
                        {rewardsData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay recompensas canjeadas...
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
            </div>
        </div>

    );
};

export default RecompensasCanjedas;