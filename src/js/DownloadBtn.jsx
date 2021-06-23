import React from "react";
import { Component } from "react";
import "./DownloadBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";

function getTimeStamp(dd) {
  var d = new Date(dd);
  var s =
    leadingZeros(d.getFullYear(), 4) +
    "-" +
    leadingZeros(d.getMonth() + 1, 2) +
    "-" +
    leadingZeros(d.getDate(), 2) +
    " " +
    leadingZeros(d.getHours(), 2) +
    ":" +
    leadingZeros(d.getMinutes(), 2) +
    ":" +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = "";
  n = n.toString();

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++) zero += "0";
  }
  return zero + n;
}

const timeout = (time, promise) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(new Error("Request timed out."));
    }, time);
    promise.then(resolve, reject);
  });
};

class CbFilelist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: true,
    };
    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(e) {
    this.setState({ isChecked: e.target.checked });
    this.props.cbCallback(e.target.checked, e.target.name);
  }
  render() {
    return (
      <ul>
        <div
          className="checkboxbg"
          name={this.props.name}
          size="small"
          color="default"
          onChange={this.handleEvent}
          defaultChecked={this.state.isChecked}
        />
        {this.props.name}
      </ul>
    );
  }
}

class EXportComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sdate: new Date(),
      edate: new Date(),
      conf_list: <ul></ul>,
      history: <ul></ul>,
      cblist: [],
      open: false,
      history_selected: 0,
    };
    this.request_sensor_data = this.request_sensor_data.bind(this);
  }

  cbSetState(c, f) {
    let arr = this.state.cblist;
    if (c === false) {
      let idx = arr.indexOf(f);
      if (idx === -1) {
        return;
      }
      arr.splice(idx, 1);
      this.setState({ cblist: arr });
    } else {
      arr = arr.concat(f);
      this.setState({ cblist: arr });
    }
  }

  componentDidMount() {
    const u = new URL(window.location.href).hostname;
    let url = "http://" + u + ":4000/sensor/config/list";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data.length === 0) return;
        const list = result.data.map((file) => (
          <CbFilelist name={file} cbCallback={this.cbSetState} />
        ));
        this.setState({ cblist: result.data });
        this.setState({ conf_list: list });
      });

    url = "http://" + u + ":4000/sensor/history";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.start.length === 0) return;
        const list = result.start.map((s, idx) => (
          <option s={s} e={result.end[idx]}>
            {s}
          </option>
        ));
        this.setState({ history: list });
      });
  }

  backdrop_close() {
    this.setState({ open: false });
  }

  backdrop_open() {
    this.setState({ open: true });
  }

  request_sensor_data() {
    const s = new Date(this.state.sdate);
    const e = new Date(this.state.edate);
    const cblist = this.state.cblist;
    const history = this.state.history_selected;
    let diff = Math.floor(e.getTime() / 1000) - Math.floor(s.getTime() / 1000);

    if (cblist.length === 0) {
      alert("Select config file");
      return;
    }

    if (diff > 7200 || diff < 0) {
      alert("Check date and time");
      return;
    }

    this.backdrop_open();

    const u = new URL(window.location.href).hostname;
    const furl = "http://" + u + ":4000/sensor/data";
    timeout(
      10 * 60 * 1000,
      fetch(furl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s: getTimeStamp(s),
          e: getTimeStamp(e),
          h: history,
          conf: cblist,
        }),
      })
    )
      .then((response) => {
        this.backdrop_close();
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "sensor_data.zip";
            a.click();
          });
        } else {
          this.backdrop_close();
          response.json().then((result) => {
            alert(result.error);
          });
        }
      })
      .catch((error) => {
        this.backdrop_close();
        alert(error);
      });
  }

  setSensorDate(e) {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index];
    var s = optionElement.getAttribute("s");
    var ee = optionElement.getAttribute("e");

    this.setState({
      sdate: s === "None" ? new Date() : new Date(s),
      edate: ee === "None" ? new Date() : new Date(ee),
      history_selected: s === "None" ? 0 : 1,
    });
  }

  render() {
    return (
      <>
        <button
          variant="contained"
          size="small"
          onClick={this.request_sensor_data}
        >
          Download
        </button>
      </>
    );
  }
}

export default EXportComponent;
