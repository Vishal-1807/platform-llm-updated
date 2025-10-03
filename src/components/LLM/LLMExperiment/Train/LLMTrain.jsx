import { useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import LLMModelTrain from "./ModelTrain.jsx/LLMModelTrain";
import LLMModelSelector from "./ModelSelector.jsx/LLMModelSelector";

export default function LLMTrain(){
    const { projectId, experimentId, taskType } = useParams();
    return (
        <Routes>
            <Route path="" element={<LLMModelSelector/>}/>
            <Route path="status" element={<LLMModelTrain/>}/>
        </Routes>
    )
}