import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { IToDoState, toDoState } from "../atoms";

interface IDragabbleCardProps {
  todoId: number;
  todoText: string;
  index: number;
  boardId: string;
}

function DragabbleCard({
  todoId,
  todoText,
  index,
  boardId,
}: IDragabbleCardProps) {
  const setTodos = useSetRecoilState(toDoState);
  const closeListBtn = () => {
    setTodos((allBoards: IToDoState) => {
      const copyBoards = [...allBoards[boardId]];
      copyBoards.splice(index, 1);
      return { ...allBoards, [boardId]: copyBoards };
    });
  };
  return (
    <Draggable key={todoId} draggableId={todoId + ""} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {todoText}
          <span onClick={closeListBtn}>✘</span>
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DragabbleCard);

const Card = styled.li`
  position: relative;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 10px;
  width: 100%;
  background: #fff;
  span {
    position: absolute;
    top: 6px;
    right: 10px;
    padding: 5px 9px;
    border-radius: 3px;
    background-color: rgba(96, 95, 95, 0.5);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }
`;
