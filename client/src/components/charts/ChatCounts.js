import React from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import collect from "collect.js";
import Loading from "../Loading";
const HOURLY = "jam";
const DAILY = "harian";
const MONTHLY = "bulanan";
const YEARLY = "tahunan";
const HOURS = [...Array(24).keys()];
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function ChatCounts(props) {
  const { data } = props;
  const [lineChartData, setLineChartData] = React.useState();
  const [type, setType] = React.useState(HOURLY);

  const handleRadio = (e) => {
    const type = e.target.value;
    setType(type);
    generateLineChartData(data, type);
  };

  const generateLineChartData = (data, type) => {
    let timeArray;
    const times = collect(
      data.map((data) => {
        const date = new Date(data.timestamp * 1000);
        switch (type) {
          case HOURLY:
            timeArray = HOURS;
            return date.getHours();
          case DAILY:
            timeArray = DAYS;
            return DAYS[date.getDay()];
          case MONTHLY:
            timeArray = MONTHS;
            return MONTHS[date.getMonth()];
          case YEARLY:
            return date.getFullYear();
          default:
            return null;
        }
      })
    ).countBy();
    if (type === YEARLY) timeArray = times.keys().toArray();

    const summary = timeArray.map((time) => {
      return {
        time: time,
        chat: times.get(time) || 0,
      };
    });
    setLineChartData(summary);
  };

  React.useEffect(() => {
    generateLineChartData(data, type);
  }, []);

  if (!lineChartData)
    return <Loading loadingMessage={{ primary: "Sedang memuat.." }} />;
  return (
    <Grid item container justify="center" spacing={3}>
      <FormControl style={{ marginTop: "2em" }}>
        <FormLabel component="legend">Rentang Waktu</FormLabel>
        <RadioGroup row name="type" value={type} onChange={handleRadio}>
          <FormControlLabel
            value={HOURLY}
            control={<Radio color="primary" />}
            label={HOURLY}
          />
          <FormControlLabel
            value={DAILY}
            control={<Radio color="primary" />}
            label={DAILY}
          />
          <FormControlLabel
            value={MONTHLY}
            control={<Radio color="primary" />}
            label={MONTHLY}
          />
          <FormControlLabel
            value={YEARLY}
            control={<Radio color="primary" />}
            label={YEARLY}
          />
        </RadioGroup>
      </FormControl>
      <LineChart
        width={700}
        height={300}
        data={lineChartData}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="chat"
          stroke="#303f9f"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </Grid>
  );
}
