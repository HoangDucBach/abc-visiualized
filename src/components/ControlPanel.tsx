import React from "react";
import styled from "styled-components";

interface ControlPanelProps {
  parameters: {
    maxIterations: number;
    foodSources: number;
  };
  setParameters: React.Dispatch<React.SetStateAction<{
    maxIterations: number;
    foodSources: number;
  }>>;
  initializeBees: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ parameters, setParameters, initializeBees }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParameters((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <Panel>
      <h2>Bảng điều chỉnh</h2>
      <label>
        Số nguồn thức ăn:
        <Input type="number" name="foodSources" value={parameters.foodSources} onChange={handleChange} />
      </label>
      <button onClick={initializeBees}>Khởi tạo bầy ong</button>
    </Panel>
  );
};

const Panel = styled.div`
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export default ControlPanel;
