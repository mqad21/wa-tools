import React from "react";
import { Grid } from "@material-ui/core";
import { PieChart, Pie, Cell, Sector } from "recharts";
import Loading from "../Loading";
import collect from "collect.js";

const COLORS = [
  "#905149",
  "#FE5F55",
  "#777DA7",
  "#94C9A9",
  "#C6ECAE",
  "#C1C1C1",
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} chat`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function ChatContents(props) {
  const { data } = props;

  const [pieChartData, setPieChartData] = React.useState();
  const [activeIndex, setActiveIndex] = React.useState();
  const handleMouseEnter = (data, index) => {
    setActiveIndex(index);
  };

  React.useEffect(() => {
    const messages = data.map((data) => {
      return {
        teks: data.type === "chat" ? 1 : 0,
        gambar: data.type === "image" ? 1 : 0,
        video: data.type === "video" ? 1 : 0,
        audio: data.type === "audio" ? 1 : 0,
        stiker: data.type === "sticker" ? 1 : 0,
        lainnya: !["chat", "image", "video", "audio", "sticker"].includes(
          data.type
        )
          ? 1
          : 0,
      };
    });
    const objKeys = Object.keys(messages[0]);
    const summary = collect(objKeys.map((key) => {
      return {
        name: key,
        value: collect(messages).sum(key),
      };
    })).sortByDesc('value').toArray();  
    setPieChartData(summary);
  }, []);

  if (!pieChartData)
    return <Loading loadingMessage={{ primary: "Sedang memuat.." }} />;
  return (
    <Grid item container justify="center">
      <PieChart width={800} height={300}>
        <Pie
          data={pieChartData}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={handleMouseEnter}
          cx={400}
          cy={150}
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((data, index) => (
            <Cell fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Grid>
  );
}
