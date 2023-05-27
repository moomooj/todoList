import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DragabbleCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

interface IBordProps {
  todos: ITodo[];
  boardId: string;
}

interface IForm {
  todo: string;
}

function Board({ todos, boardId }: IBordProps) {
  const setTodos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ todo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("todo", "");
  };

  const closeBoard = () => {
    setTodos((allBoards) => {
      const copyallBoards = { ...allBoards };
      delete copyallBoards[boardId];
      return copyallBoards;
    });
  };

  return (
    <Wrapper>
      <BoardCloseBtn onClick={closeBoard}>✘</BoardCloseBtn>
      <Title>{boardId}</Title>
      <From onSubmit={handleSubmit(onValid)}>
        <input
          {...register("todo", { required: true })}
          type="text"
          placeholder={`${boardId} 을/를 추가해보세요!`}
        ></input>
      </From>
      <Droppable droppableId={boardId + ""}>
        {(provided) => (
          <Area ref={provided.innerRef} {...provided.droppableProps}>
            {todos.map((todo, index) => (
              <DragabbleCard
                key={todo.id}
                boardId={boardId}
                todoId={todo.id}
                todoText={todo.text}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;

const Wrapper = styled.ul`
  position: relative;
  width: 300px;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 250, 249, 0.7);
  padding: 20px 20px;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin: 10px 0 20px 0;
  font-size: 18px;
`;
const Area = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease-in-out;
  height: 100%;
`;

const From = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  input {
    border: none;
    outline: none;
    padding: 15px 15px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const BoardCloseBtn = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  background-color: rgba(216, 210, 210, 0.7);
  color: white;
  border-radius: 50%;
  cursor: pointer;
`;
