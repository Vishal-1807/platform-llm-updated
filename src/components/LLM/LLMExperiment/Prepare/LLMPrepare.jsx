import { Routes, Route,useParams } from "react-router-dom";
import PreTrain from "./PreTrain/PreTrain";
import FineTune from "./FineTune/FineTune";
import DataPreview from "./FineTune/DataPreview";
import DataSelector from "./PreTrain/DataSelector";
export default function LLMPrepare() {
   const { taskType } = useParams();
  return (
    <>
      
      <Routes>
        <Route path="" element={taskType === "pretrain" ? <PreTrain /> : (taskType === "sft" ? <FineTune /> : <></>)} />
        <Route path="preview" element={taskType === "pretrain" ? <DataSelector/> : <DataPreview />} />
      </Routes>
      {/* {taskType === "pretrain" ? <PreTrain /> : (taskType === "finetune" ? <FineTune /> : null)} */}
    </>
  );
}
