import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import '../Components/NrityaCard.css';

function NrityaCard({ data, title, type }) {
    let isDarkModeOn = useSelector(selectDarkModeStatus)  ;
    if(type === 'aboutFounder'){
        isDarkModeOn = true;
    }

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '250rem',
        backgroundColor: isDarkModeOn ? '#000' : '#fff',
        color: isDarkModeOn ? '#fff' : '#000',
        boxShadow: '1em 1em 1em 1em rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        borderRadius: '0.75rem'
    };

    return (
        <Card sx={cardStyle}>
            
            <CardContent sx={{ padding: '1rem', color: cardStyle.color }}>
            {type !== 'aboutStudio' && (
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        position: 'relative',
                        padding: '0.1rem',
                        paddingTop: '0.5rem',
                        fontSize: '25px',
                        textTransform: 'capitalize',
                        color: cardStyle.color
                    }}
                >
                    {title}
                </Typography>
            )}
                {data}
            </CardContent>
        </Card>
    );
}

export default NrityaCard;
