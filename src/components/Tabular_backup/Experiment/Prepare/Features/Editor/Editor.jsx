import { Box, Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import "./Editor.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import eye from "../../../../../../assets/Editor-images/CV.svg";
import editor_rec from "../../../../../../assets/Editor-images/editor_rec.svg";
import fi_bookmark from "../../../../../../assets/Editor-images/fi_bookmark.svg";
import fi_target from "../../../../../../assets/Editor-images/fi_target.png";
import Previewed from "../../../../../../assets/Editor-images/Previewed.svg";
import {
  ExecuteQuery,
  ExportData,
  FetchSqlQueries,
  GetExpDataSet,
  GetGeneratedSQL,
  GetHistoricalQueries,
  PopulateSQLStatus,
  SaveQuery,
} from "../../../../../../services/Portals/MLopsPortals";

import CircularProgress from "@mui/material/CircularProgress";

import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-sqlserver";

import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Editor({ dataSourceModel }) {
  const { projectId, experimentId } = useParams();
  const [Queryvalue, setQueryvalue] = useState("");
  const [dataFrame, setDataFrame] = useState({});
  const [loading, setLoading] = React.useState(false);

  const [columnDefs, setColumnDefs] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [polling, setPolling] = useState(false);
  const [HQuerieStatus, setHQuerieStatus] = useState(false);
  const [relevantQueries, setRelevantQueries] = useState([]);
  const [availQueryLoader, setAvailQueryLoader] = useState(true);
  const [populateSQLStatus, setPopulateSQLStatus] = useState(false);
  const [GeneratedSql, setGeneratedSql] = useState("");
  const [showFeatEngg, setShowFeatEngg] = useState(false);
  const [error, seterror] = useState("");
  const [isProceed, setIsProceed] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [savetext, setSaveText] = useState("Save & Proceed");
  const [showQuery, setshowQuery] = useState(false);
  const [preview, setpreview] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const PreviewQuery = (query) => {
    setQueryvalue(query);
    setSelectedQuery(query === selectedQuery ? null : query);
  };
  const navigate = useNavigate();
  const CodeSnippet = ({ code }) => {
    return (
      <SyntaxHighlighter
        language="sql"
        style={duotoneLight}
        // showLineNumbers={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    );
  };

  const onExecute = () => {
    if (!Queryvalue) {
      return;
    }
    setShowLoader(true);
    seterror("");
    onExecuteQuery("executequery");
  };

  const onSaveQuery = () => {
    if (!Queryvalue) {
      return;
    }
    setShowLoader(true);
    setLoading(true);
    seterror("");
    setSaveText("Generating Preview");
    onExecuteQuery("savequery");
  };
  const onExecuteQuery = (value) => {
    ExecuteQuery(dataSourceModel, Queryvalue)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data?.error) {
            seterror(res.data?.error);
            setShowLoader(false);
            if (value === "savequery") {
              setShowLoader(true);
            }
            return;
          } else if (value === "savequery") {
            // setSaveText("Saving Query");
            SaveQuery(dataSourceModel, Queryvalue, experimentId)
              .then((res) => {
                if (res.status === 200) {
                  setSaveText("Exporting Data");
                  ExportData(experimentId).then((res) => {
                    if (res.status === 200) {
                      setPolling(true);
                      setShowLoader(true);
                    }
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }

          const columnDefs = res.data.data_frame.columns.map((columnName) => ({
            field: columnName.toLowerCase(), // You can customize the field name as needed
          }));
          setColumnDefs(columnDefs);

          console.log("columnDefs", columnDefs);
          // Extract columns from the sample data
          const columns = res.data.data_frame.columns;

          // Extract data from the sample data
          const data = res.data.data_frame.data.map((rowData) => {
            const rowObject = {};
            columns.forEach((column, index) => {
              rowObject[column] = rowData[index];
            });
            return rowObject;
          });

          console.log("data", data);
          setDataFrame(data);
          if (value === "savequery") {
            setShowLoader(true);
          } else {
            setShowLoader(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let interval = null;
    if (polling) {
      setShowLoader(true);
      interval = setInterval(async () => {
        GetExpDataSet(experimentId)
          .then((res) => {
            console.log("editor", res);
            if (res?.data?.status === "READY") {
              setPolling(false);
              setShowLoader(true);
              setLoading(false);
              setIsProceed(true);
              navigate(
                `/tabular/${projectId}/Experiment/${experimentId}/prepare/feature/engineering`,
                {
                  state: { url: res.data.url },
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [polling]);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 200,
  }));

  function onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
  const gridOptions = {
    onFirstDataRendered: onFirstDataRendered,
  };

  useEffect(() => {
    GetHistoricalQueries(experimentId)
      .then((res) => {
        if (res.status === 200) {
          setHQuerieStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    let interval = null;
    if (HQuerieStatus) {
      interval = setInterval(async () => {
        FetchSqlQueries(experimentId)
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              if (res.data.relevant_queries_status === "SUCCESS") {
                setRelevantQueries(res.data.relevant_queries);

                setHQuerieStatus(false);

                PopulateSQLStatus(experimentId)
                  .then((res) => {
                    if (res.status === 200) {
                      setPopulateSQLStatus(true);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
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
  }, [HQuerieStatus]);

  useEffect(() => {
    let interval = null;
    if (populateSQLStatus) {
      interval = setInterval(async () => {
        GetGeneratedSQL(experimentId)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.generated_sql_status === "SUCCESS") {
                setQueryvalue(res.data.generated_sql);

                setGeneratedSql(res.data.generated_sql);
                setPopulateSQLStatus(false);
                setPageLoad(false);
                setshowQuery(true);
                setAvailQueryLoader(false);
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
  }, [populateSQLStatus]);

  return (
    <>
      <Grid>
        <div className="page-caption">
          <span className="step">Steps : 3/5 </span>
          <span className="tagline">
            Select recommended queries to preview and edit
          </span>
        </div>
      </Grid>
      <Grid container>
        <Grid xs={4}>
          <Box sx={{ display: "flex", mt: 1 }}>
            <div className="editor_rec">
              <img src={editor_rec} className="Editor-img"></img>
            </div>
            <h4 className="Editor-Title">Recommended Queries</h4>
          </Box>

          <Box className="Query-list">
            {availQueryLoader ? (
              <div className="avail-l-ctn">
                <CircularProgress />
              </div>
            ) : (
              <div className="q-l-ctn">
                <Box className="Query-Box"></Box>

                <Box sx={{ height: "550px", overflowY: "scroll" }}>
                  {relevantQueries?.length > 0 &&
                    relevantQueries.map((query, index) => (
                      <>
                        <div
                          className="queries"
                          onClick={() => PreviewQuery(query)}
                        >
                          {selectedQuery === query && (
                            <div className="Preview">
                              <img src={Previewed}></img>
                            </div>
                          )}

                          <CodeSnippet
                            className="list-querys"
                            key={index}
                            code={query}
                          />
                        </div>
                      </>
                    ))}
                </Box>
              </div>
            )}
          </Box>
        </Grid>

        {showQuery ? (
          <>
            <Grid xs={8} sx={{ pl: 2 }}>
              <Box>
                <AceEditor
                  id="editor"
                  aria-label="editor"
                  mode="mysql"
                  theme="sqlserver"
                  name="editor"
                  width="100%"
                  fontSize={18}
                  minLines={15}
                  maxLines={10}
                  showPrintMargin={false}
                  showGutter
                  placeholder="Write your query here..."
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                  }}
                  value={Queryvalue}
                  onChange={(value) => setQueryvalue(value)}
                  showLineNumbers
                />
              </Box>
              <Grid container sx={{ mt: 1 }}>
                <Grid xs={4}>
                  <Box className="output">
                    <img src={fi_target}></img>
                    <span>
                      <b>Output</b>
                    </span>
                  </Box>
                </Grid>
                <Grid xs={8}>
                  <Box sx={{ display: "flex", width: "380px", float: "right" }}>
                    <button
                      className="edit-preview"
                      onClick={onExecute}
                      style={{ display: "flex" }}
                    >
                      <p style={{ margin: "0px" }}>Preview </p>{" "}
                      <p style={{ margin: "1px 0 0 6px" }}>
                        {" "}
                        <img src={eye}></img>
                      </p>
                    </button>
                    <button className="saveandexport" onClick={onSaveQuery}>
                      {savetext}
                      <span>
                        <img
                          style={{ marginTop: "5px" }}
                          src={fi_bookmark}
                        ></img>
                      </span>
                    </button>
                  </Box>
                </Grid>
              </Grid>
              <Box className="query-preview">
                <Box sx={{ textAlign: "center" }}>
                  {showLoader ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {Object.keys(dataFrame).length > 0 &&
                        columnDefs.length > 0 && (
                          <div className="ag-theme-alpine" style={gridStyle}>
                            <AgGridReact
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              rowData={dataFrame}
                              pagination={true}
                              gridOptions={gridOptions}
                              paginationPageSize={15}
                              animateRows={true}
                              overlayNoRowsTemplate={"No Data"}
                              sx={{
                                fontFamily: "Plus Jakarta Sans",
                                color: "#3F3F50",
                                fontSize: "16px",
                                fontWeight: 500,
                              }}
                            ></AgGridReact>
                          </div>
                        )}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
}
