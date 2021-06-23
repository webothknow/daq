import "./App.css";
import React, { useState, useEffect } from "react";
import PuiMultiLineGraphDisplayComponent from "./js/PuiMultiLineGraphDisplayComponent"; //gragh
import WebSocketClient from "./js/ws/WebSocketClient"; //wepsocket
import { observer } from "mobx-react";
import { toJS } from "mobx";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const wsc = new WebSocketClient("ws://iotace.cafe24.com", 8700, "/ws", 100);
  useEffect(() => {
    wsc.openConn(); //wepsocket

  }, []);

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
    if (d % 5 == 0) {
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
  modearray.push('HOUR');
  modearray.push('MINUTE');

  const modeArray = [];
  const modeData = modearray;
  for (let i = 0; i < modeData.length; i++) {
    modeArray.push(<option>{modeData[i]}</option>);
  }
  setInterval(() => {
    send_cmd('daq', 'data');

  }, 1000);

  const send_cmd = (target, cmd) => {
    let obj = {};
    obj['target'] = 'daq';
    obj['cmd'] = 'data';
    if( cmd == 'click' ){
     let year = document.getElementById("id_year");
     let month = document.getElementById("id_month");
     let day = document.getElementById("id_day");
     let hour = document.getElementById("id_hour");
     let minute = document.getElementById("id_minute");
     let mode = document.getElementById("id_mode");
     obj['cmd'] = 'request';
     obj['query'] = [year.value, month.value, day.value, hour.value, minute.value];
     obj['mode'] = mode.selectedIndex;

     console.log(obj);
    }
    wsc.sendMsg(JSON.stringify(obj));
  }

  const [show, setShow] = useState(false);

  const TopObserver = observer(({ store, group }) => {
    let MAX_LEN = 2;
    let msg = Array();
    let m = store.getAllMsg;
    let len = store.getBuffLen;

	  const da = toJS(m[0])
	  console.log('-----1 1 1---------', len);
	  console.log('-----1 1 2---------', group);
	  console.log(da);
  if (!(group in m)) {
	  console.log(">>>>>>>>>>> TOP EM >>>>>>>>>>>>>");
            //return <div></div>;
  }

    for (let i = 0; i < 1; i++) {
      let idx = len - 1 + i * -1;
      if (idx < 0) {
        msg.push(<>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </>);
      } else {
        msg.push(<>
          <tr width='100%'>
            <td width='50%'>{m[idx][group][0]["d1"].toFixed(1)} &#8451;</td>
            <td width='50%'>{m[idx][group][0]["d2"].toFixed(1)} &#8451;</td>
          </tr>
          <tr width='100%'>
            <td width='50%'>{m[idx][group][0]["d3"].toFixed(1)} pH</td>
            <td width='50%'>{m[idx][group][0]["d4"].toFixed(1)} pH</td>
          </tr>
        </>);
      }
    }
    return (
      <table>
        <thead>
          <tr width='100%'>
            <th width='50%' className="title1">In</th>
            <th width='50%' className="title1">Out</th>
          </tr>
        </thead>
        <tbody width='100%'>{msg}</tbody>
        <tfoot></tfoot>
      </table>
    );
  });

  const BottomObserver = observer(({ store, group }) => {
    let MAX_LEN = 100;
    let msg = Array();
    let m = store.getAllMsg;
    let len = store.getBuffLen;

	  if (!(group in m)) {
	    console.log('>>>>>>>>> not B>>>>>>>>>>>>');
            return <div></div>;
	  }
	  if (!(group in m[0])) {
	    console.log('>>>>>>>>> not A>>>>>>>>>>>>');
            return <div></div>;
	  }

	  const da = toJS(m[0][group])
	  console.log('-----1---------', len);
	  console.log(da);
	  console.log(len)
	  console.log('-----2-------', group);
    let d = m[len-1][group];
		  console.log(d);
	  console.log('-----3-------', group);

    for (let i = 0; i < len; i++) {
      let idx = len - 1 + i * -1;
      let ser = "";
      let res = "";
      if (idx < 0) {
        continue;

        msg.push(
          <tr>
            <td>{"N/A"}</td>
            <td>{"N/A"}</td>
            <td>{"N/A"}</td>
            <td>{"N/A"}</td>
            <td>{"N/A"}</td>
            <td>{"N/A"}</td>
          </tr>
        );
      } else {
	      let str = ''
        try {
		console.log('ID = ', i)
		console.log(d[i])
		continue
        } catch (e) {
          console.log("received msg error", m, e);
          continue;
        }
        msg.push(
          <tr>
            <td>{d[i]['d1']}</td>
            <td>{d[i]['d1']}</td>
            <td>{d[i]['d1']}</td>
            <td>{d[i]['d2']}</td>
            <td>{d[i]['d3']}</td>
            <td>{d[i]['d4']}</td>
          </tr>
        );
      }
    }
    return (<>
      <table>
        <thead>
          <tr>
            <th className="title1">Date</th>
            <th className="title1">Time</th>
            <th className="title2">Temp(in)</th>
            <th className="title2">Temp(out)</th>
            <th className="title2">pH(in)</th>
            <th className="title2">pH(out)</th>
          </tr>
        </thead>
        <tbody>{msg}</tbody>
        <tfoot></tfoot>
      </table>
        <div className="chart_wrap">
          <PuiMultiLineGraphDisplayComponent
            title=""
            subtitle="sub"
            data={wsc.store.getLastMsg}
            datagroup="top"
            width={500}
            height={269}
            maxdatapoints={50}
            xformat=" >-.0f"
            yformat=">-.0f"
            graphs={{ d1: "#f00", d2: "#a00", d3: "#0f0", d4: "#0a0" }}
            useinternalcolors={null}
            usedataplaceholder={false}
            margin={{ top: 5, bottom: 20, left: 30 }}
          />
        </div>
    </>);
  });

  return (
    <div className="App">
      <div className="wrapper">
        <div className="fix_wrapper">
          <div className="title_table">
            <div className="title">
              <h1>NEOECO MONITORING SYSTEM</h1>
            </div>
            <div className="table_wrpper">
              <TopObserver store={wsc.store} group="top" />
            </div>
          </div>
        </div>
        {show ? (
          <div className="video_wrapper">
            <iframe
              src="https://www.youtube.com/embed/lh4JdZTJe7k"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        ) : null}
        {/* checkbox */}
        <div className="check_wrapper">
          <div>
            <label>
              <input type="checkbox" />
              Data
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" onChange={() => setShow(!show)} />
              동영상
            </label>
          </div>
        </div>
        <div className="date_wrapper">
          <div>
            <span>
              <select id="id_year" defaultValue="2021">{yearArray}</select>
              <span>Year</span>
            </span>
            <span>
              <select id="id_month" defaultValue="01">{monthArray}</select>
              <span>Month</span>
            </span>
            <span>
              <select id="id_day" defaultValue="01">{dayArray}</select>
              <span>Day</span>
            </span>
	  </div>
	  <div>
            <span>
              <select id="id_hour" defaultValue="01">{hourArray}</select>
              <span>Hour</span>
            </span>
            <span>
              <select id="id_minute" defaultValue="0">{minuteArray}</select>
              <span>Minutes</span>
            </span>
            <span>
              <select id="id_mode" defaultValue="MINUTE">{modeArray}</select>
              <span>Type</span>
            </span>
          </div>
        </div>
        <div className="retrieve_wrapper">
          <button onClick={() => send_cmd("view", "click")}>View</button>
        </div>
        {/* sensor table */}
        <div className="result_wrap">
          <table>
            <tr>
              <BottomObserver store={wsc.store} group="bottom" />
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
