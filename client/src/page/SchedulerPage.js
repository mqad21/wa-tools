import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { SentimentSatisfiedAlt } from "@material-ui/icons";
import Loading from "../components/Loading";
import { useGlobal } from "reactn";
import { DropzoneArea } from "material-ui-dropzone";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { socket } from "../shared/socketConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root, .MuiDropzoneArea-root, .MuiButton-root": {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    "& .MuiDropzoneArea-root": {
      background: "transparent",
    },
    width: "100%",
    padding: theme.spacing(5),
  },
  table: {
    width: "100%",
    marginTop: "2em",
  },
}));

export default function SchedulerPage(props) {
  const classes = useStyles();
  const [contacts, setContacts] = React.useState([]);
  const [contactStatus] = React.useState("Memuat kontak...");
  const [loadingMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(null);
  const [showEmoji, setShowEmoji] = React.useState(false);
  const messageInput = React.useRef(null);

  const getDate = () => {
    let date = new Date();
    const zeroPad = (number) => {
      if (number < 10) {
        return "0" + number;
      }
      return number;
    };
    let dateString = `${date.getFullYear()}-${zeroPad(
      date.getMonth() + 1
    )}-${zeroPad(date.getDate())}T${zeroPad(date.getHours())}:${zeroPad(
      date.getMinutes()
    )}`;
    return dateString;
  };

  const [data, setData] = React.useState({
    contacts: [],
    time: getDate(),
    message: "",
    files: [],
  });

  const [log, setLog] = useGlobal("log");

  const handleSubmit = async () => {
    const base64Files = [];
    if (data.files.length !== 0) {
      await new Promise((resolve, reject) => {
        data.files.forEach(async (file) => {
          let base64File = await toBase64(file);
          base64File = base64File.replace(
            /^data:image\/(png|jpeg|jpg);base64,/,
            ""
          );
          base64Files.push(base64File);
          if (base64Files.length === data.files.length) resolve(true);
        });
      });
    }

    const id = log.length;

    const newLog = log;
    newLog.push({
      no: id + 1,
      contacts: data.contacts.map((contact) => contact.name).join(", "),
      time: new Date(data.time).toLocaleString(),
      message: data.message,
      status: "Belum terkirim",
    });
    setLog(newLog);

    socket.emit(
      "request",
      {
        requestType: "SEND_DELAYED_MESSAGE",
        payload: { ...data, files: base64Files, id: id },
      },
      (id) => {
        const newLog = log;
        newLog[id] = {
          ...log[id],
          status: "Sudah terkirim",
        };
        setLog(newLog);
      }
    );
  };

  const getContacts = () => {
    socket.emit(
      "request",
      {
        requestType: "GET_CONTACTS",
      },
      (resp, err) => {
        if (err) {
          setIsError(true);
          console.log(err);
        } else {
          const myContacts = resp
            .filter((contact) => {
              return contact.isMyContact;
            })
            .map((contact) => {
              return { id: contact.id._serialized, name: contact.name };
            });
          setContacts(myContacts);
        }
      }
    );
  };

  React.useEffect(() => {
    setTimeout(() => {
      getContacts();
    }, 200);
  }, []);

  React.useState(() => {
    if (isError) getContacts();
  }, [isError]);

  const handleContact = (e, val) => {
    console.log(val);
    setData({
      ...data,
      contacts: val,
    });
  };

  const handleTime = (e) => {
    setData({
      ...data,
      time: e.target.value,
    });
  };

  const handleMessage = (e) => {
    setData({
      ...data,
      message: e.target.value,
    });
  };

  const handleChangeFiles = (files) => {
    setData({
      ...data,
      files: files,
    });
  };

  const toggleEmoji = () => {
    setShowEmoji(!showEmoji);
    const textInput = messageInput.current.lastElementChild.firstChild;
    textInput.focus();
  };

  const handleEmoji = (emoji) => {
    const textInput = messageInput.current.lastElementChild.firstChild;
    textInput.focus();
    textInput.value += emoji.native;
    setData({
      ...data,
      message: textInput.value,
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <React.Fragment>
      <div className={classes.root}>
        <form>
          <Autocomplete
            multiple
            filterSelectedOptions
            id="contacts"
            options={contacts}
            disabled={contacts.length === 0}
            onChange={handleContact}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={
                  contacts.length === 0
                    ? contactStatus
                    : "Ketik nama kontak di sini"
                }
                label="Kontak"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        {contacts.length === 0 ? (
                          <CircularProgress size={25} />
                        ) : null}
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            id="datetime-local"
            onChange={handleTime}
            label="Waktu Pengiriman"
            type="datetime-local"
            variant="outlined"
            defaultValue={data.time}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Note: Pengiriman pesan terjadwal akan gagal apabila halaman ini ditutup pada saat rentang waktu pengiriman."
          />
          <TextField
            id="outlined-multiline-static"
            onKeyUp={handleMessage}
            label="Isi Pesan"
            multiline
            rows={7}
            variant="outlined"
            ref={messageInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleEmoji}
                    style={{ position: "absolute", bottom: 0, right: ".5em" }}
                    edge="end"
                  >
                    <SentimentSatisfiedAlt />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {showEmoji ? (
            <Grid container justify="center">
              <Grid item>
                <Picker showPreview={false} onSelect={handleEmoji} />
              </Grid>
            </Grid>
          ) : null}

          <DropzoneArea
            dropzoneText={"Klik atau tarik gambar ke sini"}
            onChange={handleChangeFiles}
            filesLimit={3}
            acceptedFiles={["image/jpeg", "image/png", "image/jpg"]}
            showPreviewsInDropzone
            maxFileSize={16 * 1000 * 1000}
            previewGridProps={{ lg: 3 }}
          />

          <Button
            variant="contained"
            size="large"
            style={{ marginTop: "2em" }}
            disabled={data.message === "" || data.contacts.length === 0}
            color="primary"
            onClick={handleSubmit}
          >
            Kirim
          </Button>
          <Loading loadingMessage={loadingMessage} />
        </form>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell>Kontak</TableCell>
              <TableCell align="center">Waktu</TableCell>
              <TableCell align="center">Pesan</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {log.map((l, index) => (
              <TableRow key={l.no}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {l.contacts}
                </TableCell>
                <TableCell align="center">{l.time}</TableCell>
                <TableCell align="center">{l.message}</TableCell>
                <TableCell align="center">{l.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}
