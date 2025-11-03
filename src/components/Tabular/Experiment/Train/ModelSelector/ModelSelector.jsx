import "./ModelSelector.css";
import ClassificationIcon from "../../../../../assets/icons/classification.svg?react";
import RegressionIcon from "../../../../../assets/icons/regression.svg?react";
import ChevronRightIcon from "../../../../../assets/icons/chevronright.svg?react";
import { useNavigate } from "react-router-dom";
export default function ModelSelector() {
    const navigate = useNavigate();
    return (
        <>
        <div className="page-caption">
            Pick up your “Train Model”
        </div>
        <div className="grid-container">
                <div className="grid-item" onClick={()=>{navigate("classification",{replace:true})}}>
                    <div className="item-icon-ctn">
                        <ClassificationIcon className="item-icon"/>
                    </div>
                    
                    <div className="item-text">
                        <div className="item-label">Classification</div>
                        <div className="item-description">predict a categorical outcome variable form set of independent variables</div>
                    </div>
                    <div className="right-icon">
                        <ChevronRightIcon/>
                    </div>
                </div>
                <div className="grid-item" onClick={()=>{navigate("regression",{replace:true})}}>
                    <div className="item-icon-ctn">
                        <RegressionIcon className="item-icon"/>
                    </div>
                    
                    <div className="item-text">
                        <div className="item-label">Regression</div>
                        <div className="item-description">predicts a continuous outcome variable from a set of independent variables</div>
                    </div>
                    <div className="right-icon">
                        <ChevronRightIcon/>
                    </div>
                </div>
        </div>
       </>
    )
}