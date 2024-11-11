
import React from "react";
import styled from "styled-components";

const Note: React.FC = () => {
    return (
        <NoteContainer>
            <h3>Chú thích</h3>
            <LegendItem>
                <ColorBox style={{ backgroundColor: '#ffeb3b' }} />
                <span>Scout Bee</span>
            </LegendItem>
            <LegendItem>
                <ColorBox style={{ backgroundColor: '#4caf50' }} />
                <span>Onlooker Bee</span>
            </LegendItem>
            <LegendItem>
                <ColorBox style={{ backgroundColor: '#2196f3' }} />
                <span>Employed Bee</span>
            </LegendItem>
        </NoteContainer>
    );
};

const NoteContainer = styled.div`
  padding: 10px;
  background: #f0f0f0;
  border-radius: 8px;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
`;

export default Note;