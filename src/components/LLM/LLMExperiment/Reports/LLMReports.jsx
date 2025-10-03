import { Box, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import styles from './LLMReports.module.css';
import "../../../../styles/liquidGlass.css";
export default function LLMReports() {
    const { experimentId, taskType } = useParams();
    return (
        <Box sx={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)"
        }}>
            {/* Header Section */}
            <Box className="liquid-glass-card-neutral" sx={{
                p: 4,
                borderRadius: "20px",
                textAlign: "center",
                mb: 2
            }}>
                <Typography
                    variant="h4"
                    className={styles["page-title"]}
                    sx={{
                        mb: 2,
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 700,
                        fontSize: "32px",
                        color: "#1F1F29",
                        background: "linear-gradient(135deg, #1F1F29 0%, #5420E8 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    Reports & Analytics
                </Typography>
                <Typography
                    sx={{
                        color: "#6E6E88",
                        fontFamily: "Plus Jakarta Sans",
                        fontSize: "16px",
                        fontWeight: 500
                    }}
                >
                    Comprehensive model performance metrics and evaluation results
                </Typography>
            </Box>

            {/* Main Metrics Chart */}
            <Box className="liquid-glass-card-neutral" sx={{
                borderRadius: "20px",
                overflow: "hidden",
                p: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.1)"
                }
            }}>
                <Typography
                    sx={{
                        mb: 3,
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#1F1F29",
                        fontFamily: "Plus Jakarta Sans"
                    }}
                >
                    LLM Valuation & Evaluation Metrics
                </Typography>
                <Box className={styles["chart-ctn"]} sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    height: "400px", // Fixed height to match chart content
                    display: "flex"
                }}>
                    <iframe
                        src={"https://cibi.ai/cibi/grafana/d/ecddfeaf-d0de-4b10-8007-41143c53ec40/llm-valuation-and-evaluation-metrics?orgId=1&from=1705047988397&to=1705048031454&var-experiment="+experimentId+"&kiosk&refresh=5s&theme=light"}
                        width="100%"
                        height="100%"
                        style={{
                            border: "none",
                            borderRadius: "16px",
                            flex: 1
                        }}
                    />
                </Box>
            </Box>

            {/* Model Metrics Chart (for SFT tasks) */}
            {taskType === "sft" && (
                <Box className="liquid-glass-card-neutral" sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    p: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.1)"
                    }
                }}>
                    <Typography
                        sx={{
                            mb: 3,
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#1F1F29",
                            fontFamily: "Plus Jakarta Sans"
                        }}
                    >
                        Fine-Tuning Model Metrics
                    </Typography>
                    <Box className={styles["chart-ctn"]} sx={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        height: "350px", // Fixed height to match chart content
                        display: "flex"
                    }}>
                        <iframe
                            src={"https://cibi.ai/cibi/grafana/d/b711bbe2-1728-4234-977c-24f08947e994/model-metrics-llm?orgId=1&var-experiment="+experimentId+"&kiosk&theme=light&panelId=5"}
                            width="100%"
                            height="100%"
                            style={{
                                border: "none",
                                borderRadius: "16px",
                                flex: 1
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    )
}