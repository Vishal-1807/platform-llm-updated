import { Routes, Route } from "react-router-dom";
import Database from "./Database/Database";
import DatabaseConfig from "./DatabaseConfig/DatabaseConfig";
import Selector from "./Selector/Selector";
export default function DataSource(){
    return (
        <Routes>
            <Route path="Databases" element={<Database/>}/>
            <Route path="Databases/:databaseName" element={<DatabaseConfig/>}/>
            <Route path="Storage"  element={<div>Storage</div>}/>
            <Route path="" element={<Selector/>}/>
        </Routes>
    )
}