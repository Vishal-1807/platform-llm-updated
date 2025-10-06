import {
  Typography,
  Box,
  Grid,
  Dialog,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import "./Selector.css";
import {
  GetAllConnectors,
  GetUserDatasets,
  UploadFileTos3,
} from "../../../../../../services/Portals/MLopsPortals";
import { useParams } from "react-router-dom";
import AppsIcon from "../../../../../../assets/DBImages/Apps.svg?react";
import TablesIcon from "../../../../../../assets/DBImages/Tables.svg?react";
import DatabasesIcon from "../../../../../../assets/DBImages/Databases.svg?react";
import StoragesIcon from "../../../../../../assets/DBImages/Storages.svg?react";
import arrow from "../../../../../../assets/DBImages/arrow.png";
import ChevronRightIcon from "../../../../../../assets/icons/chevronright.svg?react";
import mySql from "../../../../../../assets/images/DataSources/mysql.png";
import postGres from "../../../../../../assets/images/DataSources/postgres.png";
import msqls from "../../../../../../assets/images/DataSources/mssql.png";
import oracle from "../../../../../../assets/images/DataSources/oracle.png";
import redshift from "../../../../../../assets/images/DataSources/redshift.png";
import apacheHive from "../../../../../../assets/images/DataSources/Apache.png";
import trino from "../../../../../../assets/images/DataSources/trino.png";
import bigQuery from "../../../../../../assets/images/DataSources/bigquery.png";
import snowflake from "../../../../../../assets/images/DataSources/Snowflake.png";
import salesforce from "../../../../../../assets/images/DataSources/salesforce.png";
import FileUploadIcon from "../../../../../../assets/images/DataSources/fileUpload.png";
import S3 from "../../../../../../assets/images/DataSources/s3.png";
import AzuredataLake from "../../../../../../assets/images/DataSources/azure-datalake.png";
import googleCloudStorage from "../../../../../../assets/images/DataSources/googleCloud.png";
import Teradata from "../../../../../../assets/images/DataSources/teradata.png";
import Clickhouse from "../../../../../../assets/images/DataSources/clickhouse.jpeg";
import AzureSynapse from "../../../../../../assets/images/DataSources/azure_synapse.webp";
import DynamoDB from "../../../../../../assets/images/DataSources/DynamoDB.png";
import Databricks from "../../../../../../assets/images/DataSources/databricks.png";
import MongoDB from "../../../../../../assets/images/DataSources/mongodb.jpg";
import Cassandra from "../../../../../../assets/images/DataSources/cassandra.png";
import { useNavigate } from "react-router-dom";
const DataSourcesList = {
  "MySQL / MariaDB": mySql,
  PostgreSQL: postGres,
  "Microsoft SQL Server": msqls,
  Oracle: oracle,
  "Amazon Redshift": redshift,
  "Apache Hive": apacheHive,
  Trino: trino,
  BigQuery: bigQuery,
  Snowflake: snowflake,
  Salesforce: salesforce,
  S3: S3,
  "Azure DataLake": AzuredataLake,
  "Google Cloud Storage": googleCloudStorage,
  "File Upload": FileUploadIcon,
  Teradata: Teradata,
  Clickhouse: Clickhouse,
  "Azure Synapse": AzureSynapse,
  DynamoDB: DynamoDB,
  Databricks: Databricks,
  MongoDB: MongoDB,
  Cassandra: Cassandra,
};
import Buttons from "../../../../../Elements/Buttons";
import cibilogo from "../../../../../../assets/LoginImages/cibiLogo.png";
import { faX, faUpload, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinearProgress from "@mui/material/LinearProgress";
import { SpaRounded } from "@mui/icons-material";
export default function Selector() {
  const { projectId, experimentId } = useParams();
  const [connectorsList, setConnectorsList] = useState([]);
  const [selectedConnector, setSelectedConnector] = useState("");
  const [userDatasets, setUserDatasets] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [fileData, setFileData] = useState("");
  const [signedUrl, setSignedUrl] = useState("");
  const [FileName, setFileName] = useState("");

  const inputFile = useRef(null);
  const navigate = useNavigate();

  const onuploadFileChange = (e) => {
    let file = e.target.files[0];
    console.log(file);
    if (file) {
      setFileData(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const UploadFileToBucket = async () => {
    const res = await UploadFileTos3(fileData, experimentId, "uploadPage");
    if (res.s3Res.status === 204) {
      let urlRes = res.getUrlRes.data;
      let url =
        urlRes.url.replace("https", "s3").replace(".s3.amazonaws.com", "") +
        urlRes.fields.key;
      setSignedUrl(url);

      setTimeout(() => {
        navigate(
          `/tabular/${projectId}/Experiment/${experimentId}/prepare/preview`,
          {
            state: { url: url, fileName: FileName },
          }
        );
      }, 2000);
    }
  };
  useEffect(() => {
    if (fileData) {
      UploadFileToBucket();
    }
  }, [fileData]);

  useEffect(() => {
    GetAllConnectors()
      .then((res) => {
        if (res.status === 200) {
          setConnectorsList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    GetUserDatasets()
      .then((dsres) => {
        if (dsres?.status === 200) {
          setUserDatasets(dsres.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const DataSelectorImges = {
    Apps: (<AppsIcon className="db-icon"/>),
    Storages: (<StoragesIcon className="db-icon"/>),
    Databases: (<DatabasesIcon className="db-icon"/>),
    Formats: (<TablesIcon className="db-icon"/>),
  };
  const getFormattedFileSize = (sizeInBytes) => {
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return (
      (sizeInBytes / Math.pow(1024, i)).toFixed(2) * 1 +
      " " +
      ["B", "KB", "MB", "GB", "TB"][i]
    );
  };
  return (
    <>
      <Box style={{margin:"18px 0px"}}>
        <span className="Selector-title" >
          <span className="step">Steps : 1/5</span>&nbsp;&nbsp;
          <span className="tagline">Pick a data source to start</span>
        </span>
      </Box>

      <Grid container style={{justifyContent:"flex-start"}} gap={"20px"}>
        {connectorsList.length > 0 &&
          connectorsList.map((item,idx) => (
                <Grid
                  xs={2.85}
                  className="Databaselist"
                  key={item}
                >
                  <div
                    className="DB-Details"
                    onClick={item === "Formats" ? () => setOpenModel(true) : () => navigate(item)}
                  >
                    {DataSelectorImges[item]}
                    <p>{item}</p>
                    <ChevronRightIcon className="arrow"/>
                  </div>
                </Grid>
          ))}
      </Grid>

      <Box sx={{ margin:"18px 0px 12px 0px"}}>
        <span className="Selector-title">
          Some user connected datasources
        </span>
      </Box>

      <Grid container sx={{ mb: 5, justifyContent:"flex-start"}} gap={"20px"}>
        {userDatasets.length > 0 &&
          userDatasets?.map((ds,idx) => (
              <Grid item
                xs={2.85}
                key={idx}
                onClick={() => {
                  navigate("Databases/" + ds?.dataSourceModel?.datasource, {
                    state: {
                      initialValues: ds?.dataSourceModel?.connection_data,
                    },
                  });
                }}
              >
                <div className="DataConList">
                  <div style={{ display: "flex" }}>
                    <div className="img-bg">
                      <img
                        className="icons"
                        src={DataSourcesList[ds?.dataSourceModel?.datasource]}
                        alt=""
                      ></img>
                    </div>
                    <p className="ds-name">{ds?.dataSourceModel?.datasource}</p>
                    <br />
                  </div>
                  <div>
                    {ds?.dataSourceModel?.datasource === "S3" ? (
                      <>
                        <div style={{ fontSize: "14px", display: "flex",marginTop:"10px" }}>
                        <div className="database" style={{width:"30px"}}>URL:</div>
                          <div className="dbname">
                          {ds?.url}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "14px", display: "flex",marginTop:"10px" }}>
                          <div className="database">Database:</div>
                          <div className="dbname">
                            {ds?.dataSourceModel?.connection_data?.database}
                          </div>
                        </div>

                        <div style={{ fontSize: "14px", display: "flex" }}>
                          <div className="database" style={{width:"30px"}}>Host:</div>
                          <div className="dbname">
                          {ds?.dataSourceModel?.connection_data?.host}
                          </div>
                        </div>
            
                      </>
                    )}
                  </div>
                </div>
              </Grid>
          ))}
      </Grid>

      <Dialog
        open={openModel}
        PaperProps={{
          style: {
            height: "500px", // Set the desired height here
            // Add any other styles as needed
          },
        }}
      >
        <Box
          sx={{ width: "95%", textAlign: "right", m: 1, cursor: "pointer" }}
          onClick={() => {
            setOpenModel(false);
            onChildClick(false);
          }}
        >
          X
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            background: "#fff",
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #d5d5d6",
              color: "rgba(0, 0, 0, 0.87)",
              padding: "5px",
              textAlign: "center",
            }}
          >
            <Box>
              <center>
                <img src={cibilogo} style={{ width: "20%" }}></img>
              </center>
            </Box>
            <Typography className="CreateProject">
              <b>Upload Dataset</b>
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              fontSize: "18px",
              fontWeight: 500,
              color: "rgba(0,0,0,.87)",
            }}
          ></Box>
          <CardContent
            sx={{
              p: 2,
              border: "1px dashed #ccc",
              width: "90%",
              margin: "0 auto",
              cursor: "pointer",
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Box margin={1}>
                <FontAwesomeIcon icon={faUpload} size="2xl" />
              </Box>
              <Box margin={1}>
                <input
                  hidden
                  accept=".csv,.json,.xlsx,.parquet"
                  // multiple
                  type="file"
                  ref={inputFile}
                  onChange={onuploadFileChange}
                />
                <Typography
                  sx={{
                    color: "#000B34",
                    fontFamily: "source-sans-pro",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Drag and Drop or{" "}
                  <span
                    onClick={() => {
                      inputFile.current.click();
                    }}
                  >
                    <font color="blue" style={{ textDecoration: "underline" }}>
                      Choose file
                    </font>
                  </span>{" "}
                  to upload
                </Typography>
              </Box>
            </Grid>
          </CardContent>
          {fileData && (
            <Box sx={{ width: "80%", margin: "20px auto" }}>
              <Card item>
                <CardContent>
                  <Grid container direction="row">
                    <Grid item xs={2} sx={{ mt: 2 }}>
                      <FontAwesomeIcon
                        icon={faFileLines}
                        size="2x"
                        sx={{ transform: "scale(2)" }}
                      />
                    </Grid>
                    <Grid container direction="column" item xs={10}>
                      <Grid item sx={{ fontWeight: "bold" }}>
                        <Typography
                          sx={{
                            color: "#000B34",
                            fontFamily: "source-sans-pro",
                            fontWeight: 400,
                            fontSize: "16px",
                          }}
                        >
                          {fileData.name}
                        </Typography>
                      </Grid>
                      <Grid item>{getFormattedFileSize(fileData.size)}</Grid>
                      <Grid item>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <LinearProgress variant="determinate" value={100} />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {100}%
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
}
