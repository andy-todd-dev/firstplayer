import { useEffect, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";

import randomColor from "randomcolor";

const WINNER_SELECTION_DELAY_MILLISECONDS = 1000;
const LOSER_COLOR = "darkslategrey";

const getCircleColor = (touch) =>
  randomColor({
    luminosity: "light",
    seed: Math.pow(touch.identifier, 5).toString(),
    format: "hex",
  });

const App = () => {
  const [timerData, setTimerData] = useState();
  const [winner, setWinner] = useState();
  const [touches, setTouches] = useState([]);
  const currentTouchIds = touches.map((touch) => touch.identifier).sort();
  const currentTouchIdsString = currentTouchIds.join(",");

  useEffect(() => {
    console.log("Current touches: ", currentTouchIds);

    timerData && clearTimeout(timerData.timeoutId) && setTimerData();
    winner && !currentTouchIds.includes(winner) && setWinner();

    if (currentTouchIds.length > 1) {
      const timeoutId = setTimeout(() => {
        setWinner(
          currentTouchIds[Math.floor(Math.random() * currentTouchIds.length)]
        );
        setTimerData();
      }, WINNER_SELECTION_DELAY_MILLISECONDS);
      setTimerData({
        timeoutId,
        timestamp: Date.now(),
      });
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
        fill={useColor ? getCircleColor(touch) : LOSER_COLOR}
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
      <footer>
        <ul>
          <li>Ver: {import.meta.env.VITE_BUILD_VERSION}</li>
          <li>Touches: {touches.length}</li>
          <li>
            Countdown:{" "}
            {timerData
              ? WINNER_SELECTION_DELAY_MILLISECONDS -
                (Date.now() - timerData.timestamp)
              : "n/a"}
          </li>
          <li>Winner: {winner ? "Yes" : "No"}</li>
        </ul>
      </footer>
    </div>
  );
};

export default App;
