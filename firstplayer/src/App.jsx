import { useState, useRef } from "react";
import { CgDebug } from "react-icons/cg";
import { Stage, Layer, Circle } from "react-konva";

const loadedAt = Date.now();

const MINIMUM_TOUCHES_TO_START_WINNER_SELECTION = 2;
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

const getCircleColorForTouch = (touch) =>
  CANDIDATE_COLORS[
    Math.abs(parseInt(touch.identifier) % CANDIDATE_COLORS.length)
  ];

const selectRandomWinner = (candidates) =>
  candidates[Math.floor(Math.random() * candidates.length)];

const convertTouchListToArray = (touchList) => {
  // The TouchList interface used by the touch events is not a standard array and is missing some helpful methods
  // like map, filter, etc. This function converts the TouchList to a standard array.
  var touchArray = [];
  for (var i = 0; i < touchList.length; i++) {
    touchArray.push(touchList[i]);
  }
  return touchArray;
};

const App = () => {
  const [winner, setWinner] = useState(null);
  const [touches, setTouches] = useState([]);
  const currentTouchIds = touches.map((touch) => touch.identifier).sort();
  const [showDebug, setShowDebug] = useState(false);
  const [touchesLastUpdatedAt, setTouchesLastUpdatedAt] = useState(Date.now());
  const [winnerLastSelectedAt, setWinnerLastSelectedAt] = useState(null);
  const [winnerLastNotSelectedAt, setWinnerLastNotSelectedAt] = useState(null);
  const touchesLastUpdatedAtRef = useRef(touchesLastUpdatedAt);
  touchesLastUpdatedAtRef.current = touchesLastUpdatedAt;

  const circles = touches.map((touch) => {
    const useColor =
      (winner != null && touch.identifier === winner) || winner === null;
    return (
      <Circle
        key={touch.identifier}
        x={touch.clientX}
        y={touch.clientY}
        radius={60}
        fill={useColor ? getCircleColorForTouch(touch) : LOSER_COLOR}
      />
    );
  });

  const startWinnerSelectionTimer = (currentTouchIds, timestamp) => {
    setTimeout(() => {
      const winnerSelectionTimerHasNotBeenReset =
        touchesLastUpdatedAtRef.current === timestamp;
      if (winnerSelectionTimerHasNotBeenReset) {
        setWinner(selectRandomWinner(currentTouchIds));
        setWinnerLastSelectedAt(Date.now());
      } else {
        setWinnerLastNotSelectedAt(Date.now());
      }
    }, WINNER_SELECTION_DELAY_MILLISECONDS);
  };

  const onTouchEvent = (e) => {
    const touchList = convertTouchListToArray(e.touches);
    const newTouchIds = touchList.map((touch) => touch.identifier).sort();

    if (currentTouchIds.join(",") !== newTouchIds.join(",")) {
      const winnerIsNoLongerTouching =
        winner != null && !newTouchIds.includes(winner);
      if (winnerIsNoLongerTouching) {
        setWinner(null);
      }

      const timestamp = Date.now();
      setTouchesLastUpdatedAt(timestamp);

      if (
        newTouchIds.length >= MINIMUM_TOUCHES_TO_START_WINNER_SELECTION &&
        winner === null
      ) {
        startWinnerSelectionTimer(newTouchIds, timestamp);
      }
    }

    setTouches(touchList);
  };

  return (
    <div
      className="App"
      onTouchStart={onTouchEvent}
      onTouchMove={onTouchEvent}
      onTouchEnd={onTouchEvent}
      onTouchCancel={onTouchEvent}
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
          {[
            { name: "Ver", value: import.meta.env.VITE_BUILD_VERSION },
            {
              name: "T",
              value: touchesLastUpdatedAt
                ? touchesLastUpdatedAt - loadedAt
                : null,
            },
            {
              name: "WLSA",
              value: winnerLastSelectedAt
                ? winnerLastSelectedAt - loadedAt
                : null,
            },
            {
              name: "WLNSA",
              value: winnerLastNotSelectedAt
                ? winnerLastNotSelectedAt - loadedAt
                : null,
            },
            { name: "Touches", value: touches.length },
            { name: "Winner", value: winner },
          ].map((debugItem, index) => (
            <li
              style={{ visibility: showDebug ? "visible" : "hidden" }}
              key={index}
            >
              {debugItem.name}: {debugItem.value}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
};

export default App;
