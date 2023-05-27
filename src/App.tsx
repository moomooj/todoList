import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  boardName: string;
}

function App() {
  const [todos, setTodo] = useRecoilState(toDoState);
  const [addBoardBtn, setAddBoardBtn] = useState(false);
  const setTodos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const todoForLocal = useRecoilValue(toDoState);

  useEffect(() => {
    let todosJson = JSON.stringify(todoForLocal);
    localStorage.setItem("toDoState", todosJson);
  }, [todoForLocal]);

  const setAddBoard = () => {
    setAddBoardBtn((prev) => !prev);
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      setTodo((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    if (destination.droppableId !== source.droppableId) {
      setTodo((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  const onSubmit = ({ boardName }: IForm) => {
    setTodos((allBoards) => {
      return { [boardName]: [], ...allBoards };
    });
    setValue("boardName", "");
    setAddBoardBtn(false);
  };
  return (
    <>
      <AddBoardBtn onClick={setAddBoard}>✔︎</AddBoardBtn>
      {addBoardBtn ? (
        <AddFrom onSubmit={handleSubmit(onSubmit)}>
          <AddBoard>
            <div onClick={setAddBoard}>✘</div>
            <h2>보드 추가</h2>
            <input
              {...register("boardName", { required: true })}
              type="text"
              placeholder="보드를 추가하세요"
            />
          </AddBoard>
        </AddFrom>
      ) : null}

      <DragDropContext onDragEnd={onDragEnd}>
        <Wrap>
          <Boards>
            {Object.keys(todos).map((boardId) => (
              <Board boardId={boardId} key={boardId} todos={todos[boardId]} />
            ))}
          </Boards>
        </Wrap>
      </DragDropContext>
    </>
  );
}

export default App;

const AddBoardBtn = styled.button`
  position: absolute;
  top: 40px;
  right: 50px;
  border: none;
  outline: none;
  background-color: rgba(222, 222, 222, 0.5);
  box-shadow: rgba(29, 29, 29, 0.4) 0px 5px 25px;
  color: white;
  border-radius: 50%;
  font-size: 25px;
  cursor: pointer;
  width: 50px;
  height: 50px;
`;
const AddFrom = styled.form`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const AddBoard = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  background-color: #e3dfdf;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin-top: 20px;
    font-size: 24px;
    font-weight: 700;
  }
  input {
    margin-top: 50px;
    width: 80%;
    border: none;
    outline: none;
    padding: 16px 30px 16px 10px;
    border-radius: 5px;
  }
  div {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    background-color: rgba(136, 136, 136, 0.7);
    box-shadow: rgba(29, 29, 29, 0.4) 0px 5px 25px;
    color: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const Wrap = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 10vh;
`;
const Boards = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
`;
