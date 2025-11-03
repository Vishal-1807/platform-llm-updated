import { useEffect, useState } from  "react";
import { GetSourcesforConnector } from "../../../../../../services/Portals/MLopsPortals";
import { Card, CardContent, Box } from "@mui/material";
import { DataSourcesList } from "../../../../Constants/utils";
import ChevronRightIcon from '../../../../../../assets/icons/chevronright.svg?react';
import { useNavigate } from "react-router-dom";
import styles from "./Database.module.css";
export default function Database() {
    const connector = "Databases";
    const [sources, setSources] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(connector)
        GetSourcesforConnector(connector)
        .then((res) => {
          if (res.status === 200) {
            setSources(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },[]);

    return (
      <>
      <Box style={{margin:"18px 2px"}}>
        <span className={styles["Selector-title"]} >
          <span className={styles["step"]}>Steps : 1/5</span>&nbsp;&nbsp;
          <span className={styles["tagline"]}>Please select your “Database” service:</span>
        </span>
      </Box>
        <Box spacing={2} className={styles["ds-card-ctn"]}>
              {sources.length > 0 &&
                sources.map((ds) => (
                  <Card elevation={0} key={ds} className={styles["ds-card"]} onClick={() => navigate(encodeURIComponent(ds))}>
                    <CardContent className={styles["card-content"]}>
                      <div className={styles["img-ctn"]}>
                        <img
                          className={styles["icons"]}
                          src={DataSourcesList[ds]}
                          alt=""
                        ></img>
                      </div>
                      <span className={styles["ds-name"]}>{ds}</span>
                      <ChevronRightIcon/>
                    </CardContent>
                  </Card>
                ))}
        </Box>
        </>
    )
}