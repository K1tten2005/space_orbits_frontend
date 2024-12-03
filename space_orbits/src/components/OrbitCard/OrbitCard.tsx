import React from 'react';
import './OrbitCard.css';
const default_image = './images/default_image.jpg'

interface OrbitCardProps {
    orbit: {
        id: number;
        image: string | null;
        height: number;
        short_description: string;
    };
}

const OrbitCard: React.FC<OrbitCardProps> = ({ orbit }) => {
    return (
        <div className="orbit-card">
            <img src={orbit.image|| default_image} alt={`Орбита ${orbit.height} км`} />
            <h3>Высота {orbit.height} км</h3>
            <p>{orbit.short_description}</p>
        </div>
    );
};

export default OrbitCard;