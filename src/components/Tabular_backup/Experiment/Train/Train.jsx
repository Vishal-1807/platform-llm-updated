import { Route, Routes } from 'react-router-dom';
import ModelSelector from './ModelSelector/ModelSelector';
import ModelTrain from './ModelTrain/ModelTrain';
export default function Train(){
    return (
        <Routes>
            <Route path="" element={<ModelSelector/>}/>
            <Route path=":modelType/*" element={<ModelTrain/>}/>
        </Routes>
    )
}