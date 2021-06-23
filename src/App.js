import "./App.css";
import React, { useState, useEffect } from "react";
//import PuiMultiLineGraphDisplayComponent from "./js/PuiMultiLineGraphDisplayComponent"; //gragh
import PuiMultiLineGraphDisplayComponent2 from "./js/PuiMultiLineGraphDisplayComponent2"; //gragh
import WebSocketClient from "./js/ws/WebSocketClient"; //wepsocket
import { observer } from "mobx-react";
import { toJS } from "mobx";
//import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import DownloadBtn from "./js/DownloadBtn";

function App() {
  const wsc = new WebSocketClient("ws://iotace.cafe24.com", 8700, "/ws", 100);

  useEffect(() => {
    wsc.openConn();
  }, []); //wepsocket

  let thisDate = new Date();
  let thisYear = thisDate.getFullYear();

  let yearTotal = thisYear;
  let yeararray = [];
  for (let a = 2021; a <= yearTotal; a++) {
    yeararray.push(a);
  }

  let monthTotal = 12;
  let montharray = [];
  for (let a = 1; a <= monthTotal; a++) {
    montharray.push(a);
  }

  let dayTotal = 31;
  let dayarray = [];
  for (let b = 1; b <= dayTotal; b++) {
    dayarray.push(b);
  }

  let hourTotal = 24;
  let hourarray = [];
  for (let c = 1; c <= hourTotal; c++) {
    hourarray.push(c);
  }

  let minuteTotal = 55;
  let minutearray = [];
  for (let d = 1; d <= minuteTotal; d++) {
    if (d % 5 === 0) {
      minutearray.push(d);
    }
  }

  const yearArray = [];
  const yearData = yeararray;
  for (let i = 0; i < yearData.length; i++) {
    yearArray.push(<option>{yearData[i]}</option>);
  }

  const monthArray = [];
  const monthData = montharray;
  for (let i = 0; i < monthData.length; i++) {
    monthArray.push(<option>{monthData[i]}</option>);
  }

  const dayArray = [];
  const dayData = dayarray;
  for (let i = 0; i < dayData.length; i++) {
    dayArray.push(<option>{dayData[i]}</option>);
  }

  const hourArray = [];
  const hourData = hourarray;
  for (let i = 0; i < hourData.length; i++) {
    hourArray.push(<option>{hourData[i]}</option>);
  }

  const minuteArray = [];
  const minuteData = minutearray;
  for (let i = 0; i < minuteData.length; i++) {
    minuteArray.push(<option>{minuteData[i]}</option>);
  }

  let modearray = [];
  modearray.push("SECONDS");
  modearray.push("MINUTE");
  modearray.push("HOUR");

  const modeArray = [];
  const modeData = modearray;
  for (let i = 0; i < modeData.length; i++) {
    modeArray.push(<option>{modeData[i]}</option>);
  }
  setInterval(() => {
    send_cmd("daq", "data");
  }, 1000);

  const send_cmd = (target, cmd) => {
    let obj = {};
    obj["target"] = "daq";
    obj["cmd"] = "data";
    //if( cmd ){
    let year = document.getElementById("id_year");
    let month = document.getElementById("id_month");
    let day = document.getElementById("id_day");
    let hour = document.getElementById("id_hour");
    let minute = document.getElementById("id_minute");
    let mode = document.getElementById("id_mode");
    obj["cmd"] = "request";
    obj["query"] = [
      year.value,
      month.value,
      day.value,
      hour.value,
      minute.value,
    ];
    obj["mode"] = mode.selectedIndex;

    console.log(obj);
    //}
    wsc.sendMsg(JSON.stringify(obj));
  };

  const [show, setShow] = useState(false);

  //maintableobserver
  const MainTableObserver = observer(({ store, group }) => {
    let MAX_LEN = 2;
    let msg = Array();
    let m = store.getAllMsg;
    let len = store.getBuffLen;

    const da = toJS(m[0]);
    console.log("-----1 1 1---------", len);
    console.log("-----1 1 2---------", group);
    console.log(da);
    if (!(group in m)) {
      console.log(">>>>>>>>>>> TOP EM >>>>>>>>>>>>>");
    }

    for (let i = 0; i < 1; i++) {
      let idx = len - 1 + i * -1;
      if (idx < 0) {
        msg.push(
          <>
            <tr>
              <td>Indoor</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>Outdoor</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>N/A</td>
            </tr>
          </>
        );
      } else {
        msg.push(
          <>
            <tr width="100%">
              <td></td>
              <td width="14.28%">
                {m[idx][group][0]["d1"].toFixed(1)} &#8451;
              </td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)} %</td>
              <td width="14.28%">{m[idx][group][0]["d3"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
            </tr>
            <tr width="100%">
              <td></td>
              <td width="14.28%">
                {m[idx][group][0]["d1"].toFixed(1)} &#8451;
              </td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)} %</td>
              <td width="14.28%">{m[idx][group][0]["d3"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
              <td width="14.28%">{m[idx][group][0]["d4"].toFixed(1)} </td>
            </tr>
          </>
        );
      }
    }
    return (
      <table>
        <thead>
          <tr width="100%">
            <th width="14.28%" className="title1"></th>
            <th width="14.28%" className="title1">
              Temp
            </th>
            <th width="14.28%" className="title1">
              Humidity
            </th>
            <th width="14.28%" className="title1">
              PM2.5
            </th>
            <th width="14.28%" className="title1">
              PM10
            </th>
            <th width="14.28%" className="title1">
              TVOC
            </th>
            <th width="14.28%" className="title1">
              CO
            </th>
          </tr>
        </thead>
        <tbody width="100%">{msg}</tbody>
        <tfoot></tfoot>
      </table>
    );
  });

  //BodyObserver chart
  const BodyObserver = observer(
    ({ store, title, primarykey, secondarykey, yaxis, graphs }) => {
      let d = store.getLastMsg;
      console.log("chartweatherdata??? " + d);
      let data = null;
      if (d && d["d_gfs"]) {
        if (d["d_gfs"]["graph_init"]) {
          data = d["d_gfs"]["graph_init"];
        } else if (d["d_gfs"]["graph_data"]) {
          data = d["d_gfs"]["graph_data"];
        }
      }
      return (
        <PuiMultiLineGraphDisplayComponent2
          title={title}
          data={data}
          primarykey={primarykey}
          secondarykey={secondarykey}
          width={800}
          height={800}
          maxdatapoints={50}
          xaxis={{ key: "time", ticks: 5, format: "mm:ss" }}
          yaxis={yaxis}
          graphs={graphs}
          textcolor="#ffffff"
          gridcolor="#888"
        />
      );
    }
  );

  //datateble index
  let number = 1;
  const numberhangle = () => {
    for (let num = 1; num < 61; num++) {
      number = num;
    }
  };

  //datateble
  const DataTableObserver = observer(({ store, group }) => {
    let MAX_LEN = 60;
    let msg = Array();
    let m = store.getAllMsg;
    let len = store.getBuffLen;

    const da = toJS(m[0]);
    console.log("-----1 1 1---------", len);
    console.log("-----1 1 2---------", group);
    console.log(da);

    if (!(group in m)) {
      console.log(">>>>>>>>>>> TOP EM >>>>>>>>>>>>>");
    }

    for (let i = 0; i < 1; i++) {
      let idx = len - 1 + i * -1;
      if (idx < 0) {
        msg.push(
          <>
            <tr width="100%">
              <td rowspan="2">{number}</td>
              <td width="14.28%">Indoor</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
            </tr>
            <tr width="100%">
              <td width="14.28%">Outdoor</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
              <td width="14.28%">N/A</td>
            </tr>
          </>
        );
      } else {
        msg.push(
          <>
            <tr width="100%">
              <td rowspan="2">{number}</td>
              <td width="14.28%">Indoor</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
            </tr>
            <tr width="100%">
              <td width="14.28%">Outdoor</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
              <td width="14.28%">{m[idx][group][0]["d2"].toFixed(1)}</td>
            </tr>
          </>
        );
      }
    }
    return (
      <table>
        <thead></thead>
        <tbody width="100%">{msg}</tbody>
        <tfoot></tfoot>
      </table>
    );
  });

  return (
    <div className="App">
      <div className="wrapper">
        <div className="fix_wrapper">
          <div className="title_table">
            <div className="title">
              <h1>MONITORING SYSTEM</h1>
            </div>
            <div className="table_wrpper">
              <MainTableObserver store={wsc.store} group="top" />
            </div>
          </div>
        </div>
        {/* chart gragh */}
        <div className="chart_wrap">
          <BodyObserver
            title="Temp/Humidity"
            store={wsc.store}
            primarykey="data"
            secondarykey="temp"
            yaxis={[
              { pos: "left", min: -20, max: 20, ticks: 5 },
              { pos: "right", min: 0, max: 40, ticks: 5 },
            ]}
            graphs={[
              { key: "temp", axis: "left", color: "#ff0000" },
              { key: "humid", axis: "right", color: "#ffff00" },
            ]}
          />
        </div>
        <div className="chart_wrap">
          <BodyObserver
            title="PM2.5/10"
            store={wsc.store}
            primarykey="data"
            secondarykey="wind"
            yaxis={[
              { pos: "left", min: -20, max: 20, ticks: 5 },
              { pos: "right", min: 0, max: 40, ticks: 5 },
            ]}
            graphs={[
              { key: "wind_spd", axis: "left", color: "#ff0000" },
              { key: "wind_dir", axis: "right", color: "#ffff00" },
            ]}
          />
        </div>
        <div className="chart_wrap">
          <BodyObserver
            title="TVOC/CO"
            store={wsc.store}
            primarykey="data"
            secondarykey="wind"
            yaxis={[
              { pos: "left", min: -20, max: 20, ticks: 5 },
              { pos: "right", min: 0, max: 40, ticks: 5 },
            ]}
            graphs={[
              { key: "wind_spd", axis: "left", color: "#ff0000" },
              { key: "wind_dir", axis: "right", color: "#ffff00" },
            ]}
          />
        </div>
        {/* checkbox */}
        <div className="date_wrapper">
          <div className="date_margin">
            <span>
              <select id="id_year" defaultValue="2021">
                {yearArray}
              </select>
              <span>Year</span>
            </span>
            <span>
              <select id="id_month" defaultValue="01">
                {monthArray}
              </select>
              <span>Month</span>
            </span>
            <span>
              <select id="id_day" defaultValue="01">
                {dayArray}
              </select>
              <span>Day</span>
            </span>
          </div>
          <div className="date_margin">
            <span>
              <select id="id_hour" defaultValue="01">
                {hourArray}
              </select>
              <span>Hour</span>
            </span>
            <span>
              <select id="id_minute" defaultValue="0">
                {minuteArray}
              </select>
              <span>Minutes</span>
            </span>
          </div>
          <div>
            <span>
              <select id="id_mode" defaultValue="MINUTE">
                {modeArray}
              </select>
              <span>Type</span>
            </span>
            <span>
              <DownloadBtn />
            </span>
          </div>
        </div>
        <div className="download_btn_wrap"></div>
        <div className="table_wrpper2">
          <DataTableObserver store={wsc.store} group="top" />
        </div>
      </div>
    </div>
  );
}

export default App;
