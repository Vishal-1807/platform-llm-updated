import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./RawFeatures.css";

import plus from "../../../../../../assets/fi_plus.png";

import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useParams } from "react-router-dom";
import fi_star from "../../../../../../assets/fi_star.svg";
import {
  GetEnggFeatureData,
  GetRawFeatureData,
  GetRawFeatureStatus,
  UserModifiedData,
} from "../../../../../../services/Portals/MLopsPortals";

import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useLocation } from "react-router-dom";
import Buttons from "../../../../../Elements/Buttons";
import Editor from "../Editor/Editor";

export default function RawFeatures() {
  const location = useLocation();

  const stateData = location.state || {};
  const datasource = stateData.dataSourceModel;
  const { experimentId } = useParams();
  const [rawFeatureStatus, setRawFeatureStatus] = useState(false);
  const [enggFeatureStatus, setEnggFeatureStatus] = useState(false);
  const [enggFeatureData, setEnggFeatureData] = useState([]);
  const [RfLoader, setRfLoader] = useState(true);
  const [EfLoader, setEfLoader] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [enableProceed, setEnableProceed] = useState(false);
  const [polling, setPolling] = useState(false);
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const columnDefs = [
    // { field: "id", headerName: "Id", width: 150 },
    { field: "table", headerName: "Table", flex: 1, editable: true },
    {
      field: "column",
      headerName: "Column",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.5,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{ color: "red" }}
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    GetRawFeatureStatus(experimentId)
      .then((res) => {
        if (res.status === 200) {
          setRawFeatureStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let counter = 1;
  function generateUniqueId() {
    return counter++;
  }
  useEffect(() => {
    let interval = null;
    if (rawFeatureStatus && !rows?.length > 0) {
      interval = setInterval(async () => {
        GetRawFeatureData(experimentId)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.model_given_raw_features_status === "SUCCESS") {
                const rows = [];
                let data = res?.data?.model_given_raw_features;
                for (const table in data) {
                  data[table].forEach((column, index) => {
                    rows.push({ id: generateUniqueId(), table, column });
                  });
                }
                setRows(rows);
                setRfLoader(false);
                console.log("rowsvsdds", rows);

                setRawFeatureStatus(false);
                setTimeout(() => LoadEnggFeatData(), 1000);
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
  }, [rawFeatureStatus]);
  useEffect(() => {
    let interval = null;
    if (polling) {
      interval = setInterval(async () => {
        GetExpDataSet(exp_id)
          .then((res) => {
            if (res?.data?.status === "READY") {
              setPolling(false);
              setShowLoader(false);
              setLoading(false);
              setIsProceed(true);
              // setShowFeatEngg(true);
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
  }, [polling]);
  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [
        ...oldRows,
        { id, table: "", column: "", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "table" },
      }));
    };

    return (
      <GridToolbarContainer>
        {/* <Button color="primary" startIcon={<AddIcon />} >
          Add record
        </Button> */}
      </GridToolbarContainer>
    );
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, table: "", column: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "table" },
    }));
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const LoadEnggFeatData = () => {
    GetEnggFeatureData(experimentId)
      .then((res) => {
        if (res.status === 200) {
          // setEnggFeatureStatus(true);
          setEnggFeatureData(res.data.steps);
          setEfLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSave = () => {
    console.log("save");
    const convertedData = {};

    rows.forEach((item) => {
      const { table, column } = item;
      if (!convertedData[table]) {
        convertedData[table] = [];
      }
      convertedData[table].push(column);
    });

    // console.log("convertedData", convertedData);

    if (Object.keys(convertedData).length > 0) {
      UserModifiedData(experimentId, convertedData)
        .then((res) => {
          //  console.log("res", res);
          if (res.status === 200) {
            setEnableProceed(true);
            setShowEditor(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      {showEditor ? (
        <Editor dataSourceModel={datasource} />
      ) : (
        <>
          <Grid container sx={{ pt: 0 }}>
            <div className="page-caption">
              <span className="step">Steps : 2/5 {"  "}</span>
              <span className="tagline">Add records and verify details.</span>
            </div>
          </Grid>

          <Grid container>
            <Grid
              xs={6}
              sx={{
                m: 1,
                mt: 0,
                p: 1,
                background: "#fff",
                borderRadius: "10px",
              }}
            >
              <Grid container sx={{ borderBottom: "1px solid #ccc" }}>
                <Grid xs={6}>
                  <h4 style={{ paddingTop: "10px" }}>Raw Features</h4>
                </Grid>
                <Grid xs={6}>
                  <Box className="add-record" onClick={handleClick}>
                    <img src={plus} className="plus-img"></img>
                    <p className="record">Add Records</p>
                  </Box>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{
                  width: "100%",
                  maxHeight: "450px",
                  overflow: "scroll",
                  p: 1,
                  pl: 0,
                }}
              >
                <Box sx={{ width: "100%", height: "100%" }}>
                  {RfLoader ? (
                    <div className="rf-loader">
                      <center>
                        <CircularProgress />
                      </center>
                    </div>
                  ) : (
                    <>
                      {rows?.length > 0 && (
                        <DataGrid
                          rows={rows}
                          columns={columnDefs}
                          editMode="row"
                          rowModesModel={rowModesModel}
                          onRowModesModelChange={handleRowModesModelChange}
                          onRowEditStop={handleRowEditStop}
                          processRowUpdate={processRowUpdate}
                          getRowId={(row) => row.id}
                          // getRowClassName={(row) =>
                          //   row.id % 2 === 0 ? "even-row" : "odd-row"
                          // }
                          slots={{
                            toolbar: EditToolbar,
                          }}
                          slotProps={{
                            toolbar: { setRows, setRowModesModel },
                          }}
                          sx={{
                            fontFamily: "Plus Jakarta Sans",
                            color: "#3F3F50",
                            fontSize: "16px",
                            fontWeight: 500,
                            width: "100%",
                            height: "430px",
                            "& .MuiDataGrid-columnHeaders": {
                              background: "#1F1F29",
                              color: "#fff",
                              borderRadius: 0,
                            },
                            "& .MuiDataGrid-row--editable": {
                              minHeight: "42px !important",
                              maxHeight: "42px !important",
                            },
                            "& .MuiDataGrid-cellContent": {
                              height: "42px !important",
                              paddingTop: "10px",
                            },
                            "& .MuiDataGrid-row--editable:hover": {
                              background: "transparent",
                            },
                            ".MuiDataGrid-row:nth-child(even)": {
                              background: "white",
                            },
                            ".MuiDataGrid-row:nth-child(odd)": {
                              background: "#eeeef8",
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </Box>
              </Grid>
              <Box sx={{ width: 150, float: "right", mt: 2 }}>
                <Buttons
                  label={"Save Changes"}
                  onClick={onSave}
                  disabled={EfLoader || RfLoader}
                ></Buttons>
              </Box>
            </Grid>
            <Grid xs={5.5} sx={{ m: 1, mt: 0, p: 1 }} className="EF-section">
              <Grid
                xs={6}
                sx={{ display: "flex" }}
                className="Engineered-Features"
              >
                <img src={fi_star} className="EF-Img"></img>
                <h4 className="EngFeatures">Engineered Features</h4>
              </Grid>
              <div className="engg-feat-ctn">
                {EfLoader ? (
                  <div className="ef-loader">
                    <center>
                      <CircularProgress />
                    </center>
                  </div>
                ) : (
                  <>
                    {enggFeatureData?.length > 0 &&
                      enggFeatureData?.map((data, idx) => (
                        <table key={idx}>
                          <tr>
                            <td style={{ fontSize: "16px" }}>{data}</td>
                          </tr>
                        </table>
                      ))}
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
