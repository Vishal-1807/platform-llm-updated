import { Routes, Route } from "react-router-dom";
import RawFeatures from "./RawFeatures/RawFeatures";
import FeatureEngineering from "./FeatureEngineering/FeatureEngineering";
// import { useParams } from "react-router-dom";
export default function Features() {
  return (
    <>
      {/* <div>{experimentId}</div> */}
      <Routes>
        <Route path="engineering" element={<FeatureEngineering/>} />
        <Route path="" element={<RawFeatures />} />
      </Routes>
    </>
  );
}
