import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Box
  } from "@mui/material";
import DocumentIcon from "../../../assets/icons/document.svg?react";
import TimeCircleIcon from "../../../assets/icons/timecircle.svg?react";
import EyeIcon from "../../../assets/icons/eye.svg?react";
import styles from "./ListProjects.module.css";
export default function ListProjects({ projectsList, onClickProject }){
    return (
        <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
          justifyContent: "start",
        }}
      >
        {(projectsList).map((data) => (
          <Card
            sx={{ width: 350 }}
            variant="outlined"
            className={styles["card-ctn"]}
            id={data.proj_id}
            key={data.proj_id}
          >
            <CardHeader
              className={styles["card-header"]}
              sx={{
                "& .MuiTypography-root":{
                fontSize: "24px",
                fontWeight: 600,
                color:"#101016"
                }
              }}
              title={data.proj_name}
              // subheader="Name"
            />
            <CardContent
              sx={{
                color: "rgba(119, 119, 119, 1)",
                p: "0 20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 1,
                  alignItems: "center",
                  borderBottom: "1px solid rgba(238, 238, 248, 1)",
                  pb: 1,
                }}
              >
                <div className={styles["expicon"]}>
                  <DocumentIcon />
                </div>

                <div className={styles["prjdetails"]}>
                  <span className={styles["card-data-bold"]}>{data.experiments}</span>{" "}
                  <span className={styles["card-label"]}> Experiments</span>
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 1,
                  alignItems: "center",
                  borderBottom: "1px solid rgba(238, 238, 248, 1)",
                  pb: 1,
                }}
              >
                <div className={styles["expicon"]}>
                  <TimeCircleIcon />
                </div>
                <div>
                  <span className={styles["card-label"]}>
                    {new Date(data.ts).toISOString().split("T")[0]}{" "}
                    {new Date(data.ts).toLocaleTimeString()}
                  </span>
                </div>
              </Box>
            </CardContent>
            <CardContent sx={{ p: "0 20px", height:"70px", overflow:"hidden"}}>
              <span className={styles["card-description"]}>{data.description}</span>
            </CardContent>

            <CardContent >
              <Box sx={{ textAlign: "center" }}>
                <Button
                  className={styles["card-button"]}
                  onClick={(e) => onClickProject(e, data.proj_id)}
                >
                  <span style={{ display: "flex" }}>
                    <EyeIcon style={{ paddingRight: "10px"}} />
                    <span className={styles["viewprojects"]}></span>View Project
                  </span>
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )
}