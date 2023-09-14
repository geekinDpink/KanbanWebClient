// not use
import React, { useContext } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

export default function HomePage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const onClickHandler = () => {
    redDispatch({ type: "up" });
  };

  console.log(redState);

  return (
    <>
      <h1>Welcome to Task Management System</h1>
      <p>To start, please login via the top right hand corner.</p>
      <button onClick={onClickHandler}>{redState.count}</button>
    </>
  );
}
