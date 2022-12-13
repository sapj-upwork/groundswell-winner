import "./WinnerForm.css";
import Form from "react-bootstrap/Form";
import React from "react";
import * as Unicons from "@iconscout/react-unicons";
import Button from "react-bootstrap/Button";
import { validateCsv } from "./utils";
import Papa from "papaparse";
import { showError, showInfo } from "../../common/toast";

function WinnerForm(props) {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [amount, setAmount] = React.useState("$50");

  const inputRef = React.useRef(null);

  /* Drag */
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /* File dropped */
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateCsv(e.dataTransfer.files[0], onSuccesfulParse);
    }
  };

  /* File parsed & validated */
  const onSuccesfulParse = (file) => {
    setFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (
          !results.data ||
          results.data.length <= 0 ||
          !results.data[0].Name
        ) {
          setFile(null);
          showError("Invalid CSV! Ensure CSV follows proper format.");
          return null;
        }

        setRows(results.data);
        return results.data;
      },
    });
  };

  /* File selected */
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateCsv(e.target.files[0], onSuccesfulParse);
    }
  };

  /* Prevent refresh on upload click */
  const onButtonClick = function (e) {
    e.preventDefault();
    inputRef.current.click();
  };

  /* Prevent refresh on upload click */
  const beginAnimation = function (amount) {
    props.onWheelSpin(rows, amount);
  };

  function Graphic(props) {
    if (!!props.file) {
      return (
        <div>
          <Unicons.UilFile size="50" color={dragActive ? "#fff" : "#41b39b"} />
          <p className="wf-file-name">{file.name}</p>
        </div>
      );
    } else {
      return (
        <Unicons.UilCloudUpload
          size="50"
          color={dragActive ? "#fff" : "#41b39b"}
        />
      );
    }
  }

  return (
    <div className="wf-container">
      <h1 className="mt-5 mb-3">Lottery</h1>
      <Form className="wf-form">
        <input
          ref={inputRef}
          type="file"
          id="wf-file-upload-input"
          accept=".csv"
          multiple={false}
          onChange={handleChange}
        />
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          id="wf-file-upload-container"
          htmlFor="wf-file-upload-input"
          className={dragActive ? "mb-4 drag-active" : "mb-4"}
        >
          <div className="wf-drag-info">
            <Graphic file={file} />
            <p>
              Drag and drop your CSV file here or <br />
              <button onClick={onButtonClick} className="wf-upload-btn">
                <b>Click here to Upload</b>
              </button>
            </p>
          </div>
        </label>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          autoFocus
          type="text"
          className="wf-text-input mb-4 w-100"
        ></input>
        <Button
          className="w-submit-btn"
          size="lg"
          disabled={!file || !amount}
          onClick={() => beginAnimation(amount)}
          variant="info w-100"
        >
          I'm Feeling Generous
        </Button>
      </Form>
    </div>
  );
}

export default WinnerForm;
