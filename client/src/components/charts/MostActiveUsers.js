import React from "react";
import Loading from "../Loading";
import {
  Grid,
  FormControl,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { collect } from "collect.js";
import { socket } from "../../shared/socketConfig";

const MAX_ACTIVE_USERS = 10;

export default function MostActiveUsers(props) {
  const { data } = props;
  const [mostActiveUsers, setMostActiveUsers] = React.useState();
  const [barChartData, setBarChartData] = React.useState();
  const [filterArr, setFilterArr] = React.useState([
    "teks",
    "gambar",
    "video",
    "audio",
    "stiker",
    "lainnya",
  ]);
  const [limit, setLimit] = React.useState(MAX_ACTIVE_USERS);
  const [contactUnique, setContactUnique] = React.useState(0);

  const getContacts = () =>
    new Promise((resolve, reject) => {
      socket.emit(
        "request",
        {
          requestType: "GET_CONTACTS",
        },
        (response, error) => {
          if (error) {
            reject(error);
          } else {
            const result = {};
            response
              .filter((response) => response.isWAContact)
              .forEach((contact) => {
                result[contact.id._serialized] =
                  contact.name || contact.pushname || contact.number;
              });
            resolve(result);
          }
        }
      );
    });

  const handleCheckbox = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    const targetIndex = filterArr.indexOf(name);
    const newArr = filterArr;
    if (checked) {
      if (targetIndex === -1) {
        newArr.push(name);
        setFilterArr(newArr);
      }
    } else {
      if (targetIndex > -1) {
        newArr.splice(targetIndex, 1);
        setFilterArr(newArr);
      }
    }
    renderFilter(mostActiveUsers, limit);
  };

  const renderFilter = (summary, limit) => {
    if (filterArr.length === 6) {
      setBarChartData(summary.sortByDesc("total").take(limit).toArray());
    } else {
      summary = summary.sortByDesc((sum) => {
        let total = 0;
        filterArr.forEach((filter) => {
          total += sum[filter];
        });
        return total;
      });
      setBarChartData(summary.take(limit).toArray());
    }
  };

  React.useState(async () => {
    try {
      const contacts = await getContacts();
      const chats = collect(
        data.map((data) => {
          let contact = contacts[data.author];
          if (data.fromMe) {
            contact = "Anda";
          }
          return {
            name: contact,
            teks: data.type === "chat",
            gambar: data.type === "image",
            video: data.type === "video",
            audio: data.type === "audio",
            stiker: data.type === "sticker",
            lainnya: !["chat", "image", "video", "audio", "sticker"].includes(
              data.type
            ),
          };
        })
      );
      const chatContacts = chats.unique("name").flatMap((val) => val.name);
      setContactUnique(chatContacts.length);
      const summary = chatContacts.map((contact) => {
        const result = { name: contact };
        const specificChat = chats.where("name", contact);
        for (const key in chats.toArray()[0]) {
          if (key !== "name") {
            result[key] = specificChat.sum((chat) => (chat[key] ? 1 : 0));
            result.total = specificChat.count();
          }
        }
        return result;
      });
      setMostActiveUsers(summary);
      renderFilter(summary, limit);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLimit = (e) => {
    setLimit(e.target.value);
    renderFilter(mostActiveUsers, e.target.value);
  };

  if (!barChartData)
    return <Loading loadingMessage={{ primary: "Sedang memuat.." }} />;
  return (
    <Grid item container justify="center">
      <FormGroup row>
        <FormControl style={{ margin: "1em" }}>
          <FormLabel component="legend">Filter</FormLabel>
          <FormGroup row>
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="teks" />}
              label="Teks"
              checked={filterArr.includes("teks")}
            />
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="gambar" />}
              label="Gambar"
              checked={filterArr.includes("gambar")}
            />
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="video" />}
              label="Video"
              checked={filterArr.includes("video")}
            />
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="audio" />}
              label="Audio"
              checked={filterArr.includes("audio")}
            />
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="stiker" />}
              label="Stiker"
              checked={filterArr.includes("stiker")}
            />
            <FormControlLabel
              onChange={handleCheckbox}
              control={<Checkbox color="primary" name="lainnya" />}
              label="Lainnya"
              checked={filterArr.includes("lainnya")}
            />
          </FormGroup>
        </FormControl>
        <FormControl style={{ margin: "1em" }}>
          <FormLabel>Tampilkan Sebanyak</FormLabel>
          <TextField
            style={{ width: "200px" }}
            variant="outlined"
            type="number"
            InputProps={{
              inputProps: {
                max: contactUnique,
                min: 1,
              },
            }}
            defaultValue={limit}
            onChange={handleLimit}
          />
        </FormControl>
      </FormGroup>

      <BarChart
        layout="vertical"
        width={700}
        height={600 + (limit - 10) * 50}
        data={barChartData}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="category" dataKey="name" />
        <XAxis type="number" />
        <Tooltip />
        <Legend />
        {filterArr.includes("teks") ? (
          <Bar dataKey="teks" fill="#905149" stackId="a" />
        ) : null}
        {filterArr.includes("gambar") ? (
          <Bar dataKey="gambar" fill="#FE5F55" stackId="a" />
        ) : null}
        {filterArr.includes("video") ? (
          <Bar dataKey="video" fill="#777DA7" stackId="a" />
        ) : null}
        {filterArr.includes("stiker") ? (
          <Bar dataKey="stiker" fill="#94C9A9" stackId="a" />
        ) : null}
        {filterArr.includes("audio") ? (
          <Bar dataKey="audio" fill="#C6ECAE" stackId="a" />
        ) : null}
        {filterArr.includes("lainnya") ? (
          <Bar dataKey="lainnya" fill="#C1C1C1" stackId="a" />
        ) : null}
      </BarChart>
    </Grid>
  );
}
