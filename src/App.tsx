import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import Environment from "./components/Environment";
import ControlPanel from "./components/ControlPanel";
import GlobalStyles from "./styles/GlobalStyles";
import Note from "./components/Note";
import { Parameters, Bee, FoodSource } from "./types";

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }

    if (this.items.length > 10) {
      this.items.pop();
    }
  }

  getItems() {
    return this.items.map(item => item.element);
  }
}

const App: React.FC = () => {
  const [parameters, setParameters] = useState<Parameters>({
    maxIterations: 100,
    foodSources: 10,
  });
  const [bees, setBees] = useState<Bee[]>([]);
  const [foodSources, setFoodSources] = useState<FoodSource[]>([]);
  const [iteration, setIteration] = useState<number>(0);
  const intervalRef = useRef<any | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPlayFirst, setIsPlayFirst] = useState<boolean>(true);
  const [topFoodSources, setTopFoodSources] = useState<Bee []>([]);
  const topFoodSourcesQueue = useRef(new PriorityQueue<Bee>());

  const initializeBees = () => {
    setIsRunning(false);
    setIsPlayFirst(true);

    const initialFoodSources = Array.from({ length: parameters.foodSources }, (_, index) => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      quality: Math.random() * 200 + index * 10,
    }));

    const employedBees = Array.from({ length: parameters.foodSources }, (_, index) => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      fitness: 0,
      foodSource: index,
      role: 'employed',
    }));

    const onlookerBees = Array.from({ length: parameters.foodSources }, (_, index) => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      fitness: 0,
      foodSource: index,
      role: 'onlooker',
    }));

    const scoutBees = Array.from({ length: 1 }, (_, index) => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      fitness: 0,
      foodSource: index,
      role: 'scout',
    }));
    const initialBees: Bee[] = [...employedBees, ...onlookerBees, ...scoutBees] as Bee[];

    setFoodSources(initialFoodSources);
    setBees(initialBees);
    setIteration(0);
    topFoodSourcesQueue.current = new PriorityQueue<Bee>();
  };

  const calculateFitness = (bee: Bee, foodSource: FoodSource) => {
    const distance = Math.sqrt((bee.x - foodSource.x) ** 2 + (bee.y - foodSource.y) ** 2);
    return foodSource.quality / (distance + 1);
  };

  const moveTowardsFoodSource = (bee: Bee, foodSource: FoodSource) => {
    const directionX = foodSource.x - bee.x;
    const directionY = foodSource.y - bee.y;
    const length = Math.sqrt(directionX ** 2 + directionY ** 2);
    const normalizedX = directionX / length;
    const normalizedY = directionY / length;

    return {
      x: bee.x + normalizedX,
      y: bee.y + normalizedY,
    };
  };

  const employedBeePhase = () => {
    setBees((prevBees) =>
      prevBees.map((bee) => {
        const currentFoodSource = foodSources[bee.foodSource];
        const newPosition = moveTowardsFoodSource(bee, currentFoodSource);
        const newBee = {
          ...bee,
          ...newPosition,
          role: 'employed',
        } satisfies Bee;
        newBee.fitness = calculateFitness(newBee, currentFoodSource);
        return newBee;
      })
    );
  };

  const onlookerBeePhase = () => {
    const totalFitness = bees.reduce((sum, bee) => sum + bee.fitness, 0);
    setBees((prevBees) =>
      prevBees.map((bee) => {
        const probability = bee.fitness / totalFitness;
        if (Math.random() < probability) {
          const chosenFoodSource = foodSources[Math.floor(Math.random() * parameters.foodSources)];
          const newBee = {
            ...bee,
            x: chosenFoodSource.x + (Math.random() - 0.5),
            y: chosenFoodSource.y + (Math.random() - 0.5),
            role: 'onlooker',
          } satisfies Bee;
          newBee.fitness = calculateFitness(newBee, chosenFoodSource);
          return newBee;
        }
        return bee;
      })
    );
  };

  const scoutBeePhase = () => {
    setBees((prevBees) => {
      const beeWithLowestFitness = prevBees.reduce((lowest, bee) => (bee.fitness < lowest.fitness ? bee : lowest), prevBees[0]);

      return prevBees.map((bee) => {
        if (bee === beeWithLowestFitness) {
          return {
            ...bee,
            x: Math.random() * 500,
            y: Math.random() * 500,
            foodSource: Math.floor(Math.random() * parameters.foodSources),
            fitness: 0,
            role: 'scout',
          };
        }
        return bee;
      });
    });
  };

  const runABC = () => {
    if (iteration >= parameters.maxIterations) {
      setIsRunning(false); // Dừng khi vượt quá số vòng lặp tối đa
      return;
    }
    employedBeePhase();
    onlookerBeePhase();
    scoutBeePhase();
    setIteration((prev) => prev + 1);
  };

  const updateTopFoodSources = () => {
    const allBees = bees.filter(bee => bee.role !== 'scout');
    allBees.forEach(bee => {
      topFoodSourcesQueue.current.enqueue(bee, bee.fitness);
    });
    setTopFoodSources(topFoodSourcesQueue.current.getItems());
  };

  useEffect(() => {
    initializeBees();
    if (isRunning) {
      intervalRef.current = setInterval(runABC, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [parameters]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(runABC, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    updateTopFoodSources();
  }, [iteration, foodSources]);

  const toggleSimulation = () => {
    if (isPlayFirst) {
      setIsPlayFirst(false);
    }
    setIsRunning((prev) => !prev);
  };

  return (
    <>
      <Container>
        <Panel>
          <GlobalStyles />
          <ControlPanel parameters={parameters} setParameters={setParameters} initializeBees={initializeBees} />
          <Note />
          <button onClick={toggleSimulation}>
            {isPlayFirst ? "Start" : isRunning ? "Pause" : "Continue"}
          </button>
          <h2>Vòng lặp hiện tại: {iteration}</h2>
        </Panel>
        <Environment bees={bees} foodSources={foodSources} />
        <RankingTable>
          <h3>Top Food Sources</h3>
          <ul>
            {topFoodSources.map((bee, index) => (
              <li key={index}>
                Food Source {index + 1}: {bee.fitness.toFixed(2)}
              </li>
            ))}
          </ul>
        </RankingTable>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
`;
const Panel = styled.div`
  height: 100%;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-between;
`;
const RankingTable = styled.div`
  margin-top: 20px;
  h3 {
    margin-bottom: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    li {
      margin-bottom: 5px;
    }
  }
`;
export default App;
