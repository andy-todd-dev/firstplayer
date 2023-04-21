import "./App.css";
import { useEffect, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import randomColor from "randomcolor";

const App = () => {
  const [timer, setTimer] = useState();
  const [winner, setWinner] = useState();
  const [touches, setTouches] = useState([]);
  const currentTouchIds = touches.map((touch) => touch.identifier).sort();
  const currentTouchIdsString = currentTouchIds.join(",");

  useEffect(() => {
    console.log("Current touches: ", currentTouchIds);

    timer && clearTimeout(timer);
    winner && !currentTouchIds.includes(winner) && setWinner();

    if (currentTouchIds.length > 1) {
      setTimer(
        setTimeout(() => {
          setWinner(
            currentTouchIds[Math.floor(Math.random() * currentTouchIds.length)]
          );
        }, 1000)
      );
    }
  }, [currentTouchIdsString]);

  const circles = touches.map((touch) => {
    const useColor = (winner && touch.identifier === winner) || !winner;
    return (
      <Circle
        key={touch.identifier}
        x={touch.clientX}
        y={touch.clientY}
        radius={60}
        fill={
          useColor
            ? randomColor({
                luminosity: "light",
                seed: Math.pow(touch.identifier, 5).toString(),
                format: "hex",
              })
            : "darkgrey"
        }
      />
    );
  });

  const touchHandler = (e) => {
    e.preventDefault();

    // Convert unhelpfull custom touchList type to standard array
    var touchList = [];
    for (var i = 0; i < e.touches.length; i++) {
      touchList.push(e.touches[i]);
    }
    setTouches(touchList);
  };

  return (
    <div
      className="App"
      onTouchStart={touchHandler}
      onTouchMove={touchHandler}
      onTouchEnd={touchHandler}
      onTouchCancel={touchHandler}
    >
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>{circles}</Layer>
      </Stage>
    </div>
  );
};

export default App;
