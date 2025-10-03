import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

import {
  Deployments,
  GetListExperiments,
} from "../../services/Portals/LLMPortals";
import styles from "./Dashboard.module.css";
export const Dashboard = () => {
  const GrafanaApiUrl = "https://cibi.ai/cibi";
  const [active, setactive] = useState("Active");

  const [experimentInformation, setExperimentInformation] = useState([]);
  const [DeploymentsDetails, setDeploymentsDetails] = useState([]);
  const [expid, setexpid] = useState();
  const [ProjectList, setProjectList] = useState([]);
  const [ExperimentList, setExperimentList] = useState([]);
  const [ProjectID, setProjectID] = useState();
  const [ProjectName, setProjectName] = useState();
  const [ProjectType, setProjectType] = useState("all");
  const [ProjectFilter, setProjectFilter] = useState("all");
  const [FinalURL, setFinalURL] = useState("");
  const [PA, setPA] = useState(0);
  const [Hcc, setHcc] = useState(0);
  const [EB, setEB] = useState(0);
  const [pid, setid] = useState("");

  const getdeploy = () => {
    Deployments().then((res) => {
      setDeploymentsDetails(res.data);
    });
  };

  const GetExperimentsList = async (projectType) => {
    try {
      const res = await GetListExperiments();
      const filteredExperiments = res.data.filter((item) => {
        const isStatusValid =
          item.status === "DEPLOYED" || item.status === "TRAINED";
        const isProjectTypeValid =
          projectType === "all" || item.proj_type === projectType;
        const isNotInternal = item.proj_type !== "internal";

        return isStatusValid && isProjectTypeValid && isNotInternal;
      });
      setExperimentInformation(filteredExperiments);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  const OnchangeType = (e) => {
    const newProjectType = e.target.value;
    setProjectType(newProjectType);
    GetExperimentsList(newProjectType); // Pass the new project type
  };

  useEffect(() => {
    GetExperimentsList(ProjectType); // Fetch experiments whenever ProjectType changes
  }, [ProjectType]);

  const handleChange = (e) => {
    if (e.target.value === "all") {
      GetProjectList(ProjectFilter);
    }
    if (ProjectFilter === "llm") {
      const selectedValue = e.target.value.toLowerCase();
      setexpid(e.target.value);
      const single = `https://cibi.ai/cibi/grafana/d/a91763bb-d009-4be3-b378-2187a01e08bd/kubecost-llm?orgId=1&refresh=10s&var-namespace=${selectedValue}-train&var-namespace=${selectedValue}-infer&var-namespace=${selectedValue}-preprocess&from=now-20d&to=now&theme=light&kiosk&width=450`;
      setFinalURL(single);
    } else {
      const selectedValue = ProjectID.toLowerCase();
      const single = `https://cibi.ai/cibi/grafana/d/a91763bb-d009-4be3-b378-2187a01e08bd/kubecost-llm?orgId=1&refresh=10s&var-namespace=${selectedValue}-train&var-namespace=${selectedValue}-infer&var-namespace=${selectedValue}-preprocess&from=now-20d&to=now&theme=light&kiosk&width=450`;
      setFinalURL(single);
    }
  };
  const GetProjectList = async (ProjectFilter) => {
    try {
      const res = await GetListExperiments();
      const filteredExperiments = res.data.filter((item) => {
        const isStatusValid =
          item.status === "DEPLOYED" || item.status === "TRAINED";
        const isProjectTypeValid =
          ProjectFilter === "all" || item.proj_type === ProjectFilter;
        const isNotInternal = item.proj_type !== "internal";
        const isNotExcludedName = !["Synthetic Data Generator"].includes(
          item.proj_name
        );

        return (
          isStatusValid &&
          isNotInternal &&
          isProjectTypeValid &&
          isNotExcludedName
        );
      });
      //console.log("filteredExperiments", filteredExperiments);

      setProjectList(filteredExperiments);
      setExperimentList(filteredExperiments);
      const namespaces = filteredExperiments
        .map((exp) => generateNamespaces(exp))
        .join("");
      const finalUrl = `${baseUrl}${namespaces}&from=now-20d&to=now&theme=light&kiosk&width=450`;
      setFinalURL(finalUrl);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  const OnFilterChange = (e) => {
    const newFilter = e.target.value;
    setProjectFilter(newFilter);
    GetProjectList(newFilter);
  };

  useEffect(() => {
    GetProjectList(ProjectFilter);
  }, [ProjectFilter]);

  const OnProjectChange = (e) => {
    const newProjectID = e.target.value;
    setProjectID(newProjectID);
    GetFilteredExperiments(e.target.value);
  };

  const GetFilteredExperiments = async (e) => {
    try {
      const res = await GetListExperiments();
      const filteredExperiments = res.data.filter(
        (item) =>
          item.proj_id === e &&
          (item.status === "TRAINED" || item.status === "DEPLOYED")
      );
      setExperimentList(filteredExperiments);
      const namespaces = filteredExperiments
        .map((exp) => generateNamespaces(exp))
        .join("");
      const finalUrl = `${baseUrl}${namespaces}&from=now-20d&to=now&theme=light&kiosk&width=450`;
      setFinalURL(finalUrl);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  const baseUrl = `${GrafanaApiUrl}/grafana/d/a2159148-e5c7-4204-a1e6-fa614b5ebe6b/kubecost-llm?orgId=1&refresh=10s`;
  const generateNamespaces = (exp) => {
    const id =
      exp.proj_type === "tabular"
        ? exp.proj_id.toLowerCase()
        : exp.exp_id.toLowerCase();
    return `&var-namespace=${id}-infer&var-namespace=${id}-train&var-namespace=${id}-process`;
  };

  console.log({ FinalURL });

  const options = {
    chart: {
      type: "column",
      height: 260,
      borderRadius: 5,
      backgroundColor: null,
      plotShadow: true,
      style: {
        fontFamily: "Plus Jakarta Sans",
      },
    },
    title: {
      align: "center",
      verticalAlign: "top",
      style: {
        fontFamily: "Plus Jakarta Sans",
      },
      text: "copilot", // Add a title if needed
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Plus Jakarta Sans",
          },
          format: "{point.name}: {point.y}",
        },
        pointWidth: 60,
      },
    },
    xAxis: {
      categories: ["Prior Auth", "HCC Coding", "Eligibility & Benefits"],
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Count",
        align: "high",
      },
      style: {
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "No of Requests Processed",

        data: [
          {
            name: "Prior Auth",
            y: PA,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "#d94cf6"],
                [1, "#6033d1"],
              ],
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "12px",
                fontFamily: "Arial, sans-serif",

                color: "#333",
              },
            },
          },
          {
            name: "HCC Coding",
            y: Hcc,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "#d94cf6"],
                [1, "#6033d1"],
              ],
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "12px",
                fontFamily: "Arial, sans-serif",

                color: "#333",
              },
            },
          },
          {
            name: "Eligibility & Benefits",
            y: EB,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, "#d94cf6"],
                [1, "#6033d1"],
              ],
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "12px",
                fontFamily: "Arial, sans-serif",

                color: "#333",
              },
            },
          },
        ],
      },
    ],
  };

  const formatDate = (timestamp) => {
    const givenTime = new Date(timestamp);

    const day = String(givenTime.getDate()).padStart(2, "0");
    const month = String(givenTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(givenTime.getFullYear()).slice(-2); // Last two digits of the year
    const hours = String(givenTime.getHours()).padStart(2, "0");
    const minutes = String(givenTime.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Number of items per page
  const totalPages = Math.ceil(experimentInformation.length / pageSize);
  const currentData = experimentInformation.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className={styles["Dashboard"]}>
        <Grid
          container
          sx={{ p: 1, pt: 1, mt: 0 }}
          className={styles["Dashboard"]}
        >
          {active === "Active" ? (
            <>
              <div
                style={{
                  width: "98%",
                  margin: "10px auto",
                }}
              >
                <center>
                  <h2
                    className={styles["Exptittle"]}
                    style={{
                      fontSize: "16px",

                      paddingTop: "5px",
                    }}
                  >
                    <b>Dashboard</b>
                  </h2>
                </center>

                <div style={{ marginBottom: "10px" }}>
                  {experimentInformation.length >= 0 ? (
                    <Grid xs={12} sx={{ p: 0 }}>
                      <iframe
                        src={FinalURL}
                        width="100%"
                        height="600px"
                        style={{
                          border: "none",
                          padding: 0,
                        }}
                      />
                    </Grid>
                  ) : (
                    <center>Loading..</center>
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </Grid>
      </div>
    </>
  );
};
