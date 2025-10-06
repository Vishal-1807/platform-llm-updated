// import { useLocation, useParams } from "react-router-dom";

// export default function Preview() {
// const location = useLocation();
// const stateData = location.state || {};
// return <>{stateData.url}</>;

import { Box, Grid } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  GetDataPreview,
  GetExpDataSet,
  GetListExperiments,
  UpdateExp,
} from "../../../../../services/Portals/MLopsPortals";
import { TableDataContainer } from "../../../Common/TableDataContainer";

export default function Preview() {
  const location = useLocation();
  const stateData = location.state || {};
  const [dataURL, setDataURL] = useState("");
  // const dataURL = stateData.url
  const [finalData, setFinalData] = useState({});
  const [columnDefs, setColumnDefs] = useState([]);
  const [convertedRows, setConvertedRows] = useState([]);
  const [tableMetaData, setTableMetaData] = useState({});
  const [updateStatus, setUpdateStatus] = useState(false);
  const experimentId = useParams().experimentId;
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);

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
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data[0].status === "CREATED") {
            setUpdateStatus(true);
          }
          GetExpDataSet(experimentId).then((res) => {
            setDataURL(res.data.url);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId]);

  useEffect(() => {
    if (dataURL) {
      GetDataPreview(dataURL)
        .then((res) => {
          if (res.status === 200) {
            setFinalData(JSON.parse(res.data.sample_data));
            let dataset = JSON.parse(res.data.sample_data);
            const eachObjectKeys = Object.keys(
              dataset[Object.keys(dataset)[0]]
            );
            const convertedArray = eachObjectKeys.map((key) => {
              const newObj = {};
              Object.keys(dataset).forEach((prop) => {
                newObj[prop] = dataset[prop][key];
              });
              return newObj;
            });
            setConvertedRows(convertedArray);

            let colDefs = [];
            const keys = Object.keys(JSON.parse(res.data.sample_data));
            keys.forEach((key) => colDefs.push({ field: key }));
            setColumnDefs(colDefs);

            let tableMetaData = {
              fileName: dataURL.split("/").pop(),
              rows: res.data.n_rows,
              columns: res.data.n_columns,
            };
            setTableMetaData(tableMetaData);
            if (updateStatus) {
              UpdateExp(experimentId)
                .then((res) => {})
                .catch((err) => {
                  console.log(err);
                });
            }

            // }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dataURL]);

  return (
    <>
      <Grid container sx={{ pt: 0 }}>
        <div className="page-caption">
          <span className="step">Steps : 5/5 {"  "}</span>
          <span className="tagline">Upload the supported files.</span>
        </div>
      </Grid>
      <Box
        sx={{
          background: "rgb(244,244,245)",
        }}
      >
        <TableDataContainer data={tableMetaData} />
        <Box sx={{ background: "#fff", p: "20px" }}>
          {convertedRows.length > 0 && (
            <div
              className="ag-theme-alpine"
              style={{ height: "500px", width: "100%" }}
            >
              <AgGridReact
                className="data-table"
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={convertedRows}
                pagination={true}
                gridOptions={gridOptions}
                paginationPageSize={20}
                animateRows={true}
                overlayNoRowsTemplate={"No Data"}
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}
              ></AgGridReact>
            </div>
          )}
          {/* <Box sx={{ mt: 1, textAlign: "end" }}>
          <Button
            sx={{
              background: "#545CC0",
              color: "#fff",
              margin: "0px 10px",
              "&:hover": {
                bgcolor: "#545CC0",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
                color: "#fff",
              },
            }}
            endIcon={<EastIcon sx={{ color: "white" }} />}
            onClick={() => onSelect("Train")}
          >
            Next
          </Button>
        </Box> */}
        </Box>
      </Box>
    </>
  );
}
