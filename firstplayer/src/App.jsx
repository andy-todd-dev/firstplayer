import { useEffect, useState, useRef } from "react";
import { CgDebug } from "react-icons/cg";
import { Stage, Layer, Circle } from "react-konva";

const WINNER_SELECTION_DELAY_MILLISECONDS = 2000;
const LOSER_COLOR = "darkslategrey";
const CANDIDATE_COLORS = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
];

const getCircleColor = (touch) =>
  CANDIDATE_COLORS[
    Math.abs(parseInt(touch.identifier) % CANDIDATE_COLORS.length)
  ];

const App = () => {
  const [winner, setWinner] = useState(null);
  const [touches, setTouches] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [lastTimerReset, setLastTimerReset] = useState(Date.now());
  const lastTimerResetRef = useRef(lastTimerReset);
  lastTimerResetRef.current = lastTimerReset;
  const currentTouchIds = touches.map((touch) => touch.identifier).sort();
  const currentTouchIdsString = currentTouchIds.join(",");

  const onTouchesChanged = () => {
    winner != null && !currentTouchIds.includes(winner) && setWinner(null);

    if (currentTouchIds.length > 1 && winner == null) {
      const timestamp = Date.now();
      setTimeout(() => {
        if (lastTimerResetRef.current == timestamp) {
          setWinner(currentTouchIds.sort(() => Math.random() - 0.5)[0]);
        }
      }, WINNER_SELECTION_DELAY_MILLISECONDS);
      setLastTimerReset(timestamp);
    }
  };

  useEffect(onTouchesChanged, [currentTouchIdsString]);

  const circles = touches.map((touch) => {
    const useColor =
      (winner != null && touch.identifier === winner) || winner == null;
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
          <li>
            <CgDebug
              onClick={() => {
                setShowDebug(!showDebug);
              }}
            />
          </li>
          <li style={{ visibility: showDebug ? "visible" : "hidden" }}>
            Ver: {import.meta.env.VITE_BUILD_VERSION}
          </li>
          <li style={{ visibility: showDebug ? "visible" : "hidden" }}>
            Touches: {touches.length}
          </li>
          <li style={{ visibility: showDebug ? "visible" : "hidden" }}>
            Winner: {winner}
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default App;
