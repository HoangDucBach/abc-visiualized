import React from "react";
import styled from "styled-components";

interface BeeProps {
    x: number;
    y: number;
    role: 'scout' | 'onlooker' | 'employed';
}

const Bee: React.FC<BeeProps> = ({ x, y, role }) => {
    const randomDeltaX = Math.random() * 10;
    const randomDeltaY = Math.random() * 10;
    return <BeeIcon style={{ left: `${x + randomDeltaX}px`, top: `${y + randomDeltaY}px`, backgroundColor: getColorByRole(role) }} />;
};

const getColorByRole = (role: 'scout' | 'onlooker' | 'employed') => {
    switch (role) {
        case 'scout':
            return '#ffeb3b'; // Yellow
        case 'onlooker':
            return '#4caf50'; // Green
        case 'employed':
            return '#2196f3'; // Blue
        default:
            return '#ffeb3b'; // Default to yellow
    }
};

const BeeIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

export default Bee;
