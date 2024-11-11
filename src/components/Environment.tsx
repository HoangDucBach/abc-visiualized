import React from "react";
import styled from "styled-components";
import Bee from "./Bee";
import { Bee as IBee, FoodSource as IFoodSource } from "../types";

interface EnvironmentProps {
    bees: IBee[];
    foodSources: IFoodSource[];
}

const Environment: React.FC<EnvironmentProps> = ({ bees, foodSources }) => {
    // Tìm giá trị fitness cao nhất để tham chiếu
    const maxFitness = Math.max(...foodSources.map((food) => food.quality));

    // Đếm số lượng ong tại mỗi nguồn thức ăn
    const beeCounts = foodSources.map((_, index) =>
        bees.filter((bee) => bee.foodSource === index).length
    );

    return (
        <EnvContainer>
            {bees.map((bee, index) => (
                <Bee key={index} x={bee.x} y={bee.y} role={bee.role} />
            ))}
            {foodSources.map((food, index) => (
                <FoodSourceContainer key={index} style={{ left: `${food.x}px`, top: `${food.y}px` }}>
                    <FoodSourceIcon
                        style={{
                            width: `${(food.quality / maxFitness) * 30 + 10}px`, // Kích thước tỉ lệ với fitness
                            height: `${(food.quality / maxFitness) * 30 + 10}px`, // Kích thước tỉ lệ với fitness
                            backgroundColor: `rgba(255, 87, 34, ${(food.quality / maxFitness) * 0.7 + 0.3})`, // Màu sắc thay đổi theo fitness
                        }}
                    />
                    <BeeCount>{beeCounts[index]}</BeeCount>
                </FoodSourceContainer>
            ))}
        </EnvContainer>
    );
};

const EnvContainer = styled.div`
  width: 600px;
  height: 600px;
  background: #171717;
  position: relative;
`;

const FoodSourceContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FoodSourceIcon = styled.div`
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transition: width 0.2s, height 0.2s, background-color 0.2s;
`;

const BeeCount = styled.div`
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  z-index: 999;
`;

export default Environment;
