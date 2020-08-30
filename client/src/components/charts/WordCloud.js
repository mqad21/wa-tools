import React from "react";
import ReactWordcloud from "react-wordcloud";
import { Grid } from "@material-ui/core";

const EXCLUDED_WORDS = [
  "di",
  "ya",
  "nya",
  "yg",
  "yang",
  "atau",
  "ke",
  "dan",
  "dn",
  "dari",
  "kalau",
  "kalo",
  "ga",
  "ngga",
  "klo",
  "tapi",
  "nah",
  "nih",
  "lah",
  "si",
  "kan",
  "eh",
  "tpi",
  "tp",
  "gak",
  "iya",
  "iyaa",
  "yaa",
  "iyaaa",
  "yaaa",
  "juga",
  "jg",
  "dengan",
  "dgn",
  "ini",
  "itu",
  "tuh",
];

const compare = (a, b) => {
  const valueA = a.value;
  const valueB = b.value;

  let comparison = 0;
  if (valueA < valueB) {
    comparison = 1;
  } else if (valueA > valueB) {
    comparison = -1;
  }
  return comparison;
};

const getFrecuency = (arr) => {
  const wordObj = arr.reduce((obj, item) => {
    obj[item] = (obj[item] || 0) + 1;
    return obj;
  }, {});
  const wordObjKey = Object.keys(wordObj);
  return wordObjKey.map((key) => {
    return {
      text: key,
      value: wordObj[key],
    };
  });
};

const getWordCloudData = (data) => {
  const longString = data
    .map((dt) => dt.body)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, "");
  const wordArray = longString
    .split(" ")
    .filter(
      (word) => word !== "" && !EXCLUDED_WORDS.includes(word) && word.length > 1
    );
  const maxWords = 100;
  const result = getFrecuency(wordArray).sort(compare).slice(0, maxWords);
  return result;
};

export default function WordCloud(props) {
  const { data } = props;
  const [words, setWords] = React.useState();

  React.useEffect(() => {
    const wordCloudData = getWordCloudData(data);
    setWords(wordCloudData);
  }, []);

  if (!words) return null;
  return (
    <Grid item container justify="center">
      <ReactWordcloud
        style={{ maxWidth: "100% !important" }}
        options={{
          rotations: 1,
          rotationAngles: [0, 0],
        }}
        size={[600, 300]}
        words={words}
      />
    </Grid>
  );
}
