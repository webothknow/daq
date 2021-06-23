import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, defaults } from 'react-chartjs-2';
import { Card, Container } from 'react-bootstrap';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';

const PuiMultiLineGraphDisplayComponent2 = ({
  title,
  height,
  width,
  margin,
  data,
  primarykey,
  secondarykey,
  graphs,
  maxdatapoints,
  xaxis,
  yaxis,
  textcolor,
  gridcolor,
}) => {
  // Internal data & axis state
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [option, setOption] = useState({
    scales: {},
  });
  // Default settings
  defaults.global.animation = false;
  defaults.global.maintainAspectRatio = false;
  defaults.global.elements.line.tension = false;
  defaults.global.elements.point.radius = 0;

  // Graph initialization section
  useEffect(() => {
    try {
      initOption();
      initGraphs();
    } catch {
      throw Error('Fatal error @ graph init stage');
    }
  }, []);

  // Graph data update section
  useEffect(() => {
    if (data && data.hasOwnProperty(primarykey)) {
      let d = null;
      secondarykey ? (d = data[primarykey][secondarykey]) : (d = data[primarykey]);

      let x = d[xaxis['key']];

      // Change behavior based on received data type
      switch (typeof x) {
        case 'number':
        case 'string':
          appendGraphData(d);
          break;

        default:
          if (Array.isArray(x)) {
            initGraphData(d);
          }
          break;
      }
    }
  }, [data]);

  const initOption = () => {
    setOption({
      ...option,
      scales: {
        xAxes: [
          {
            gridLines: {
              color: gridcolor,
            },
            ticks: {
              type: 'linear',
              maxRotation: 0,
              maxTicksLimit: xaxis['ticks'],
              fontColor: textcolor,
              callback: formatXAxis,
            },
          },
        ],
        yAxes: yaxis.map((a) => {
          if (['left', 'right'].includes(a.pos)) {
            return {
              type: 'linear',
              display: true,
              position: a.pos,
              gridLines: { drawOnArea: true, color: gridcolor },
              id: a.pos,
              ticks: {
                min: a.min,
                max: a.max,
                maxTicksLimit: a.ticks,
                fontColor: textcolor,
              },
            };
          }
        }),
      },
      // 차트범례
      legend: {
        labels: {
          boxWidth: 7,
        },
      },
    });
  };

  const initGraphs = () => {
    setGraphData({
      ...graphData,
      labels: [],
      datasets: graphs.map((a) => {
        return {
          label: a.key,
          data: [],
          fill: false,
          borderColor: a.color,
          yAxisID: a.axis,
        };
      }),
    });
  };

  // Point update of graph data
  const appendGraphData = (d) => {
    if (graphData.labels) {
      let cond = null;
      graphData.labels.length >= maxdatapoints ? (cond = true) : (cond = false);
      setGraphData({
        ...graphData,
        labels: cond
          ? graphData.labels.slice(1).concat(d[xaxis['key']])
          : graphData.labels.concat(d[xaxis['key']]),
        datasets: graphData.datasets.map((a) => {
          return {
            ...a,
            data: cond ? a.data.slice(1).concat(d[a.label]) : a.data.concat(d[a.label]),
          };
        }),
      });
    }
  };

  // Bulk update of graph data
  const initGraphData = (d) => {
    setGraphData({
      ...graphData,
      labels: d[xaxis['key']],
      datasets: graphData.datasets.map((a) => {
        return { ...a, data: d[a.label] };
      }),
    });
  };

  // Parse date-like string
  const formatXAxis = (value, index, values) => {
    return moment(value).isValid() ? moment(value).format(xaxis['format']) : value;
  };

  return (
    <Container fluid="xl">
      <Card>
        <Card.Title>{title}</Card.Title>
        {/*<Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>*/}
        <div className="line-graph-display-container" style={{ height: height, width: width }}>
          <Line data={graphData} options={option} />
        </div>
      </Card>
    </Container>
  );
};

/*
<EXAMPLE USAGE>
<PuiMultiLineGraphDisplayComponent2
  title="TEST"
  data={store.getLastMsg}
  primarykey="data"
  secondarykey="acc"
  width={800}
  height={800}
  maxdatapoints={50}
  xaxis={{key: 'time', ticks: 5, format: 'mm:ss'}}
  yaxis={[
    {pos: 'left', min: -20, max: 20, ticks: 5 },
    {pos: 'right', min: 0, max: 40, ticks: 5 },
  ]}
  graphs={[
    {key: 'acc_x', axis: "left", color: "#ff0000" },
    {key: 'acc_y', axis: "right", color: "#ffff00" },
  ]}
  textcolor="#ffffff"
  gridcolor="#888"
  />
*/

PuiMultiLineGraphDisplayComponent2.defaultProps = {
  title: 'Sample Title',
  height: 500,
  width: 500,
  maxdatapoints: 100,
  primarykey: 'data',
  secondarykey: 'gps',
  margin: { top: 25, bottom: 50, left: 50 },
  ticks: 5,
  textcolor: '#ffffff',
  gridcolor: '#888',
};

PuiMultiLineGraphDisplayComponent2.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  xaxis: PropTypes.shape({
    key: PropTypes.string.isRequired,
    ticks: PropTypes.number.isRequired,
    format: PropTypes.string.isRequired,
  }).isRequired,
  yaxis: PropTypes.arrayOf(
    PropTypes.shape({
      pos: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      ticks: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  data: PropTypes.object.isRequired,
  primarykey: PropTypes.string.isRequired,
  secondarykey: PropTypes.string,
  graphs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      axis: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  maxdatapoints: PropTypes.number,
  margin: PropTypes.object,
  textcolor: PropTypes.string,
  gridcolor: PropTypes.string,
};

export default React.memo(PuiMultiLineGraphDisplayComponent2);
