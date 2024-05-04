import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./Routes/App";
import Clan from "./Routes/Clan";
import Member from "./Routes/Member";
import YearlyIncome from "./Routes/YearlyIncome";
import Payment from "./Routes/Payment";
import Report from "./Routes/Report";
import Expenses from "./Routes/Expenses";
import Income from "./Routes/Income";
import "./Assets/css/App.css";
import "./Assets/css/Sidebar.css";

const RootComponent = () => (
  <HashRouter>
    <App />
    <Member />
    <Clan />
    <Expenses />
    <Income />
    <Payment />
    <YearlyIncome />
    <Report />
  </HashRouter>
);

ReactDOM.render(<RootComponent />, document.getElementById("root"));
console.log("hi....");
