import { Route, Routes } from "react-router-dom";
import DataSource from "./DataSource/DataSource";
import Features from "./Features/Features";
// import { useParams } from "react-router-dom";
import Preview from "./Preview/Preview";

export default function Prepare() {
  // const { experimentId } = useParams();
  return (
    <>
      {/* <div>{experimentId}</div> */}
      <Routes>
        <Route path="/*" element={<DataSource />} />
        <Route path="feature/*" element={<Features />} />
        <Route path="Preview" element={<Preview />} />
      </Routes>
    </>
  );
}
