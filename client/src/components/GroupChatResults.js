import React from "react";
import { CSVLink } from "react-csv";
import { Button, Grid } from "@material-ui/core";
import WordCloud from "./charts/WordCloud";
import MetaData from "./charts/MetaData";
import ChartCard from "./ChartCard";
import MostActiveUsers from "./charts/MostActiveUsers";
import ChatContents from "./charts/ChatContents";
import ChatCounts from "./charts/ChatCounts";

export default function GroupChatResults(props) {
  const { data } = props;

  return (
    <Grid
      item
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}
      style={{ marginTop: "5em" }}
    >
      <Grid item>
        <CSVLink data={data} style={{ textDecoration: "none" }}>
          <Button variant="outlined">Download Data</Button>
        </CSVLink>
      </Grid>
      <ChartCard title="Metadata">
        <MetaData data={data} />
      </ChartCard>
      <ChartCard title="Word Cloud">
        <WordCloud data={data} />
      </ChartCard>
      <ChartCard title="Konten Chat">
        <ChatContents data={data} />
      </ChartCard>
      <ChartCard title="Anggota Paling Aktif">
        <MostActiveUsers data={data} />
      </ChartCard>
      <ChartCard title="Jumlah Chat">
        <ChatCounts data={data} />
      </ChartCard>
    </Grid>
  );
}
