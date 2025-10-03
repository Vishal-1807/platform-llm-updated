import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Box, StyledEngineProvider, CircularProgress } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../../../../../../assets/icons/copy.svg?react";
import NewTabIcon from "../../../../../../assets/icons/newtab.svg?react";
import UploadIcon from "../../../../../../assets/icons/upload.svg?react";
import DownloadIcon from "../../../../../../assets/icons/download.svg?react";
import BoxIcon from "../../../../../../assets/icons/box.svg?react";
import CrossIcon from "../../../../../../assets/icons/cross.svg?react";
import PreprocessFileURL from "../../../../../../assets/Files/preprocess.py?url";
import SyntaxHighlighter from "react-syntax-highlighter";
import pythonContent from "../../../../../../assets/Files/preprocess.py?raw";
import "./FeatureEngineering.css";
import {
  UploadFileTos3,
  UpdateConfig,
  Preprocess,
  GetExpDataSet,
} from "../../../../../../services/Portals/MLopsPortals";

export default function FeatureEngineering() {
  const experimentId = useParams().experimentId;
  const location = useLocation();
  const stateData = location.state || {};
  const dataURL = stateData.url;
  const [copied, setCopied] = useState(false);
  const [pyFileURI, setPyFileURI] = useState("");
  const [txtFileURI, setTxtFileURI] = useState("");
  const [pyFileData, setPyFileData] = useState(null);
  const [txtFileData, setTxtFileData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [subFlag, setSubFlag] = useState(false);
  const [pollStatus, setPollStatus] = useState(false);
  const pyFileInput = useRef(null);
  const txtFileInput = useRef(null);

  const navigate = useNavigate();
  const copyText = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const uploadpyFiles = async (e) => {
    let file = e.target.files[0];
    if (file) {
      setPyFileData(file);
      const res = await UploadFileTos3(file, experimentId, "FeatureEnggPage");
      if (res.s3Res.status === 204) {
        let urlRes = res.getUrlRes.data;
        let url =
          urlRes.url.replace("https", "s3").replace(".s3.amazonaws.com", "") +
          urlRes.fields.key;
        setPyFileURI(url);
        // navigate
      }
    }
  };

  const uploadTextFiles = async (e) => {
    let file = e.target.files[0];

    if (file) {
      setTxtFileData(file);
      const res = await await UploadFileTos3(
        file,
        experimentId,
        "FeatureEnggPage"
      );
      if (res.s3Res.status === 204) {
        let urlRes = res.getUrlRes.data;
        let url =
          urlRes.url.replace("https", "s3").replace(".s3.amazonaws.com", "") +
          urlRes.fields.key;
        setTxtFileURI(url);
        // navigate
      }
    }
  };
  const submit = () => {
    if (!pyFileURI) {
      return;
    }
    setSubFlag(true);
    setLoader(true);
    let formData = {
      preprocess_path: pyFileURI,
      requirements_path: txtFileURI,
    };
    UpdateConfig(experimentId, "preprocess", formData)
      .then((res) => {
        if (res.status === 200) {
          Preprocess(experimentId)
            .then((res) => {
              if (res.status === 200) {
                setPollStatus(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setSubFlag(true);
      });
  };

  useEffect(() => {
    let interval = null;
    if (pollStatus) {
      interval = setInterval(async () => {
        GetExpDataSet(experimentId)
          .then((res) => {
            if (res.status === 200) {
              if (res?.data?.status === "READY") {
                setPollStatus(false);
                setLoader(false);
                setSuccessMsg("SUCCESS");
                //created DataReady status manually from UI
                // updateTabStatus([{ status: "DataReady" }]);
                navigate("../../preview", {
                  state: {
                    url: res.data.url,
                  },
                });
              } else if (res?.data?.status === "PREPROCESSING_ERROR") {
                setPollStatus(false);
                setLoader(false);
                setSuccessMsg("PREPROCESSING FAILED");
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pollStatus]);

  const removePythonFile = () => {
    setPyFileData(null);
    setPyFileURI("");
  };

  const removeTextFile = () => {
    setTxtFileData(null);
    setTxtFileURI("");
  };
  return (
    <>
      <div className="page-caption">
        <span style={{ color: "var(--Shades-Black-4, #8D8DAC)" }}>
          Steps : 4/5
        </span>
        <span
          style={{
            color: "var(--Shades-Black-2, #3F3F50)",
            paddingLeft: "12px",
          }}
        >
          Upload the supported files
        </span>
      </div>
      <div className="page-container">
        <div className="left-ctn">
          <div className="left-title-ctn">
            <span style={{ fontSize: "18px", fontWeight: 700 }}>
              Feature Engineering
            </span>
            <a
              href="https://cibi.ai/cibi/jupyterhub/"
              target="_blank"
              rel="noreferrer"
            >
              <button className="f-dwld">
                <NewTabIcon /> {"  "}
                <span style={{marginTop:"1px",marginLeft:"5px"}}>CiBi Jupiter Lab</span>
              </button>
            </a>
          </div>
          <div className="field-ctn">
            <span className="field-label">
              Experiment Id:
              {copied ? <span style={{ color: "green" }}>Copied!</span> : null}
            </span>
            <div className="field">
              <span>{experimentId}</span>
              <CopyToClipboard text={experimentId} onCopy={copyText}>
                <CopyIcon sx={{ cursor: "pointer" }} />
              </CopyToClipboard>
            </div>
          </div>

          <div className="field-ctn">
            <span className="field-label">Supported files are .py</span>
            <div
              className="field"
              style={{ border: "1px dashed var(--Shades-Black-5, #B7B7D2)" }}
            >
              <div
                className="field-file"
                onClick={() => {
                  pyFileInput.current.click();
                }}
              >
                <UploadIcon />
                <div>choose file to upload</div>
                <input
                  hidden
                  accept=".py"
                  type="file"
                  ref={pyFileInput}
                  onChange={uploadpyFiles}
                />
              </div>
            </div>
            <div className="uploaded-file-names">
              {pyFileData ? (
                <div className="uploaded-file-name">
                  <span>{pyFileData?.name}</span>
                  <div className="chip-icon" onClick={removePythonFile}>
                    <CrossIcon style={{color:"#A8200D"}}/>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="field-ctn">
            <span className="field-label">Supported files are .txt</span>
            <div
              className="field"
              style={{ border: "1px dashed var(--Shades-Black-5, #B7B7D2)" }}
            >
              <div
                className="field-file"
                onClick={() => {
                  txtFileInput.current.click();
                }}
              >
                <UploadIcon />
                <div>choose file to upload</div>
                <input
                  hidden
                  accept=".txt"
                  type="file"
                  ref={txtFileInput}
                  onChange={uploadTextFiles}
                />
              </div>
            </div>
            <div className="uploaded-file-names">
              {txtFileData ? (
                <div className="uploaded-file-name">
                  <span>{txtFileData?.name}</span>
                  <div className="chip-icon" onClick={removeTextFile}>
                    <CrossIcon style={{color:"#A8200D"}}/>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <Box className="action-btn-ctn">
            {loader ? (
              <CircularProgress />
            ) : (
              <>{successMsg && <div className="s-msg">{successMsg}</div>}</>
            )}
            <button
              className="cancel-button"
              onClick={() => {
                navigate("../../preview", {
                  state: { url: dataURL },
                });
              }}
            >
              Skip
            </button>
            <button
              className="submit-button gradient-background"
              disabled={subFlag}
              onClick={submit}
            >
              Submit
              {/* <SkipNextIcon /> */}
            </button>
          </Box>
        </div>
        <div className="prev-ctn">
          {/* <Box
                    sx={{ p: 1, display: "flex", justifyContent: "space-between", width: "100%" }}
                > */}
          <div className="right-title-ctn">
            <div className="right-title-label">
              <div className="icon-ctn">
                <BoxIcon style={{color:"#5420E8"}}/>
              </div>
              <div><b>Sample Transformations</b></div>
            </div>

            <a
              href={PreprocessFileURL}
              download="Preprocess.py"
              target="_blank"
              rel="noreferrer"
            >
              <button className="f-dwld-download gradient-background">
                <DownloadIcon /> {"   "}
                <span style={{marginLeft:"10px"}}>Download Template</span>
              </button>
            </a>
          </div>
          {/* </Box> */}
          <StyledEngineProvider injectFirst>
            <SyntaxHighlighter
              className="code-ctn"
              language="python"
              // style={prism}
              showLineNumbers={true}
              wrapLongLines={true}
            >
              {pythonContent}
            </SyntaxHighlighter>
          </StyledEngineProvider>
        </div>
      </div>
    </>
  );
}
