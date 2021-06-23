import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ResponsiveLineCanvas } from "@nivo/line";
import { Card, Container } from "react-bootstrap";

const PuiMultiLineGraphDisplayComponent = ({
  title,
  height,
  width,
  range,
  margin,
  data,
  datagroup,
  maxdatapoints,
  graphs,
  xformat,
  yformat,
  useinternalcolors,
  ticks,
  textcolor,
  gridcolor,
}) => {
  // Internal data & axis state
  const [state, setState] = useState({});
  const [xrange, setXRange] = useState(["auto", "auto"]);

  // Initialize graphs to render & data on mounting (one-time)
  useEffect(() => {
    let initState = {};
    try {
      for (let g in graphs) {
        initState[g] = {
          id: g,
          color: graphs[g],
          data: [],
        };
      }
      setState(initState);
    } catch {
      throw Error("An error occured during parsing graph settings object.");
    }
  }, [null]);

  // Parses data in order to transform into Nivo-recognizable array of objects
  // Data message structure: {time: value, y1: val_y1, y2: val_y2...}
  // Nivo data structure: [{id: y1, color: y1_color, data: [val_y1...]}
  //                       {id: y2, color: y2_color, data: [val_y2...]}]
  useEffect(() => {
    let newState = {};

    if (data && data.data[datagroup]) {
      newState = state;

      let x = data.data[datagroup].time;
      let y = 0;

      for (let g in state) {
        y = data.data[datagroup][g];
        if (newState[g].data.length >= maxdatapoints) {
          newState[g].data.shift();
        }
        newState[g].data.push({ x: x, y: y });
      }
      setState(newState);
    }
  }, [data]);

  // Sets color of graph if the user chooses not to use internal color scheme
  let colorarray = [];
  for (let g in state) {
    colorarray.push(state[g].color);
  }

  // Adds persistent X,Y axis
  const PersistentAxis = (ctx) => {
    if (ctx) {
      ctx.ctx.strokeStyle = gridcolor;
      ctx.ctx.save();
      ctx.ctx.beginPath();
      ctx.ctx.moveTo(0, ctx.innerHeight);
      ctx.ctx.lineTo(0, 0);
      ctx.ctx.moveTo(0, ctx.innerHeight);
      ctx.ctx.lineTo(ctx.innerWidth, ctx.innerHeight);
      ctx.ctx.stroke();
    }
  };

  return (
    <Container fluid="xl">
      <Card>
        <Card.Title>{title}</Card.Title>
        {/*<Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>*/}
        <div
          className="line-graph-display-container"
          style={{ height: height, width: width }}
        >
          <ResponsiveLineCanvas
            data={Object.values(state)}
            margin={margin}
            xScale={{
              type: "time",
              format: "%Y-%m-%d %H:%M:%S",
              precision: "millisecond",
            }}
            xFormat="time:%S"
            axisBottom={{ tickValues: ticks, format: "%S" }}
            gridXValues={ticks}
            yScale={{
              type: "linear",
              format: { yformat },
              min: range[0],
              max: range[1],
            }}
            axisLeft={{ tickValues: ticks }}
            gridYValues={ticks}
            curve="linear"
            animate={false}
            enablePoints={false}
            colors={useinternalcolors ? useinternalcolors : colorarray}
            lineWidth={1}
            isInteractive={false}
            legends={[
              {
                anchor: "top",
                direction: "row",
                justify: false,
                itemsSpacing: 2,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 12,
                itemOpacity: 0.75,
              },
            ]}
            theme={{
              textColor: textcolor,
              grid: {
                line: {
                  stroke: gridcolor,
                },
              },
            }}
            layers={["grid", "axes", "lines", PersistentAxis]}
          />
        </div>
      </Card>
    </Container>
  );
};

PuiMultiLineGraphDisplayComponent.defaultProps = {
  title: "Sample Title",
  height: 500,
  width: 500,
  range: ["auto", "auto"],
  maxdatapoints: 100,
  datagroup: "gps",
  xformat: " >-.0f",
  yformat: " >-.0f",
  useinternalcolors: { scheme: "spectral" },
  margin: { top: 25, bottom: 50, left: 50 },
  ticks: 5,
  textcolor: "#ffffff",
  gridcolor: "#888",
};

PuiMultiLineGraphDisplayComponent.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.object,
  datagroup: PropTypes.string,
  maxdatapoints: PropTypes.number,
  range: PropTypes.array,
  graphs: PropTypes.object.isRequired,
  xformat: PropTypes.string,
  yformat: PropTypes.string,
  useinternalcolors: PropTypes.object,
  margin: PropTypes.object,
  ticks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textcolor: PropTypes.string,
  gridcolor: PropTypes.string,
};

export default React.memo(PuiMultiLineGraphDisplayComponent);
