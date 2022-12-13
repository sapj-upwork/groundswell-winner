import "./App.css";
import WinnerForm from "./components/WinnerForm/WinnerForm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import VerticalCarousel from "./components/VerticalCarousel/VerticalCarousel";
import { config } from "react-spring";
import _ from "lodash";

function App() {
  const [offsetRadius] = React.useState(7);
  const [showNavigation] = React.useState(false);
  const [configuration] = React.useState(config.gentle);

  const [rows, setRows] = React.useState([]);
  const [amount, setAmount] = React.useState("");

  const startAnimation = function (nameList, amt) {
    setRows([]);

    if (!nameList || !amt) {
      nameList = rows;
      amt = amt;
    }

    setAmount(amt);
    const shuffledRows = _.shuffle(nameList);

    setRows(
      shuffledRows.map((r, i) => ({ key: i, content: <span>{r.Name}</span> }))
    );
  };

  return (
    <div className="App">
      {rows.length ? (
        <div
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            margin: "0 auto",
            background: "#32574f",
          }}
        >
          <VerticalCarousel
            slides={rows}
            offsetRadius={offsetRadius}
            showNavigation={showNavigation}
            animationConfig={configuration}
            amount={amount}
            onWheelSpin={startAnimation}
            reset={startAnimation}
          />
        </div>
      ) : (
        <WinnerForm onWheelSpin={startAnimation} />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
