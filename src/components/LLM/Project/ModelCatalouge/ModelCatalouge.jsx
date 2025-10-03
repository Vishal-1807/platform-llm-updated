import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/styled-engine";
import Button from "@mui/material/Button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./ModelCatalouge.module.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Chip,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Star from "../../../../assets/icons/fi_star.svg";
import Slider from "../../../../assets/icons/fi_sliders.svg";
import FilterIcon from "../../../../assets/icons/filter.svg?react";

export const ModelCatalouge = () => {
  const navigate = useNavigate();
  return (
    <Box className={styles["mod-cat-ctn"]}>
      <div className={styles["table-title-ctn"]}>
        <button className={styles["table-title-action-btn"]}>
          <FilterIcon style={{ marginRight: "10px" }} />
          <span>Filter By modal</span>
        </button>
      </div>
      <Box
        sx={{
          mt: "15px",
          display: "flex",
          flexDirection: "row",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Card className={styles["card-ctn"]}>
          <Stack
            direction={"row"}
            sx={{ gap: "10px", p: "12px 16px 0 16px", alignItems: "center" }}
          >
            <div className={styles["header"]}>Pythia-70m</div>
            <Chip className={styles["chip-title"]} label="Text-generation" />
          </Stack>
          <CardContent
            sx={{
              color: "#3F3F50",
              padding: "16px 16px 0 16px",
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
                <img src={Slider}></img>
              </div>

              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>Parameter</span>{" "}
                <span className={styles["card-data-bold"]}>70M</span>
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
                <img src={Star}></img>
              </div>
              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>License</span>{" "}
                <span className={styles["card-data-bold"]}>apache-2.0</span>
              </div>
            </Box>
          </CardContent>
          <CardContent className={styles["content"]}>
            Pythia 70M from Eleuther AI. Tiny model for experimentation.
          </CardContent>
          <CardActions className={styles["btns"]}>
            <Button className={styles["deploy"]}>
              <div className={styles["d-txt"]}>Deploy</div>
            </Button>
            <Button className={styles["fine-tune"]}>Fine Tune</Button>
          </CardActions>
        </Card>

        <Card className={styles["card-ctn"]}>
          <Stack
            direction={"row"}
            sx={{ gap: "10px", p: "12px 16px 0 16px", alignItems: "center" }}
          >
            <div className={styles["header"]}>Pythia-70m</div>
            <Chip className={styles["chip-title"]} label="Text-generation" />
          </Stack>
          <CardContent
            sx={{
              color: "#3F3F50",
              padding: "16px 16px 0 16px",
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
                <img src={Slider}></img>
              </div>

              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>Parameter</span>{" "}
                <span className={styles["card-data-bold"]}>70M</span>
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
                <img src={Star}></img>
              </div>
              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>License</span>{" "}
                <span className={styles["card-data-bold"]}>apache-2.0</span>
              </div>
            </Box>
          </CardContent>
          <CardContent className={styles["content"]}>
            Pythia 70M from Eleuther AI. Tiny model for experimentation.
          </CardContent>
          <CardActions className={styles["btns"]}>
            <Button className={styles["deploy"]}>
              <div className={styles["d-txt"]}>Deploy</div>
            </Button>
            <Button className={styles["fine-tune"]}>Fine Tune</Button>
          </CardActions>
        </Card>

        <Card className={styles["card-ctn"]}>
          <Stack
            direction={"row"}
            sx={{ gap: "10px", p: "12px 16px 0 16px", alignItems: "center" }}
          >
            <div className={styles["header"]}>Pythia-70m</div>
            <Chip className={styles["chip-title"]} label="Text-generation" />
          </Stack>
          <CardContent
            sx={{
              color: "#3F3F50",
              padding: "16px 16px 0 16px",
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
                <img src={Slider}></img>
              </div>

              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>Parameter</span>{" "}
                <span className={styles["card-data-bold"]}>70M</span>
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
                <img src={Star}></img>
              </div>
              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>License</span>{" "}
                <span className={styles["card-data-bold"]}>apache-2.0</span>
              </div>
            </Box>
          </CardContent>
          <CardContent className={styles["content"]}>
            Pythia 70M from Eleuther AI. Tiny model for experimentation.
          </CardContent>
          <CardActions className={styles["btns"]}>
            <Button className={styles["deploy"]}>
              <div className={styles["d-txt"]}>Deploy</div>
            </Button>
            <Button className={styles["fine-tune"]}>Fine Tune</Button>
          </CardActions>
        </Card>

        <Card className={styles["card-ctn"]}>
          <Stack
            direction={"row"}
            sx={{ gap: "10px", p: "12px 16px 0 16px", alignItems: "center" }}
          >
            <div className={styles["header"]}>Pythia-70m</div>
            <Chip className={styles["chip-title"]} label="Text-generation" />
          </Stack>
          <CardContent
            sx={{
              color: "#3F3F50",
              padding: "16px 16px 0 16px",
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
                <img src={Slider}></img>
              </div>

              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>Parameter</span>{" "}
                <span className={styles["card-data-bold"]}>70M</span>
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
                <img src={Star}></img>
              </div>
              <div className={styles["prjdetails"]}>
                <span className={styles["card-label"]}>License</span>{" "}
                <span className={styles["card-data-bold"]}>apache-2.0</span>
              </div>
            </Box>
          </CardContent>
          <CardContent className={styles["content"]}>
            Pythia 70M from Eleuther AI. Tiny model for experimentation.
          </CardContent>
          <CardActions className={styles["btns"]}>
            <Button className={styles["deploy"]}>
              <div className={styles["d-txt"]}>Deploy</div>
            </Button>
            <Button className={styles["fine-tune"]}>Fine Tune</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};
