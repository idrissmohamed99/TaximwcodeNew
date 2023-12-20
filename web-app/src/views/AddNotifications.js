import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card
} from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import CircularLoading from "components/CircularLoading";
import { makeStyles } from "@mui/styles";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
const useStyles = makeStyles((theme) => ({
  textField: {
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
  rootRtl: {
    "& label": {
      right: 25,
      left: "auto",
      paddingRight: 12,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 15,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  rootRtl_1: {
    "& label": {
      right: 25,
      left: "auto",
      paddingRight: 12,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 18,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  selectField_rtl: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
    "& label": {
      right: 50,
      left: "auto",
      paddingRight: 12,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
    },
  },
  selectField_rtl_1: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
    "& label": {
      right: 50,
      left: "auto",
      paddingRight: 12,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 27,
    },
  },

  right: {
    textAlign: "right",
    right: 0,
    left: "auto",
    paddingRight: 40,
  },
}));
const AddNotifications = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendNotification, editNotifications } = api;
  const [deviceType, setDeviceType] = useState("");
  const [userType, setUserType] = useState("");
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const [loding, setLoding] = useState(false);
  const classes = useStyles();
  const [data, setData] = useState({
    createdAt: new Date().getTime(),
    body: "",
    devicetype: "",
    title: "",
    usertype: "",
  });
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };

  const handelChangeDeviceType = (event) => {
    setDeviceType(event.target.value);
    setData({ ...data, devicetype: event.target.value });
  };
  const handelChangeUserType = (event) => {
    setUserType(event.target.value);
    setData({ ...data, usertype: event.target.value });
  };
  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handelSubmit = () => {
    if (!data.body && !data.title && !data.usertype && !data.devicetype) {
      setCommonAlert({ open: true, msg: t("no_details_error") });
    } else {
      new Promise((resolve, reject) => {
        setLoding(true);
        setTimeout(() => {
          if (settings.AllowCriticalEditsAdmin) {
            if (data.body && data.title && data.usertype && data.devicetype) {
              dispatch(sendNotification(data));
              dispatch(editNotifications(data, "Add"));
              navigate("/notifications");
              resolve();
            } else {
              setCommonAlert({ open: true, msg: t("no_details_error") });
              reject(new Error("Please fill up all the details properly."));
            }
          } else {
            setCommonAlert({ open: true, msg: t("demo_mode") });
            reject(new Error("demo mode"));
          }
        }, 600);
      }).catch((e) => {
        // console.error("caught an error:",e)
      }).finally(() => {
        setLoding(false);
      });
    }
  };
  return loding ? (
    <CircularLoading />
  ) : (
    <div>
      <Card
        style={{
          borderRadius: "19px",
          backgroundColor: '#fff',
          minHeight: 100,
          maxWidth: "75vw",
          marginTop: 20,
          marginBottom: 20,
          padding: 25,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        }}
      >
        <Typography
          variant="h5"
          style={{
            marginTop: -15,
            textAlign: isRTL === "rtl" ? "right" : "left",
          }}
        >
          {t("add_notification_title")}
        </Typography>
        <div
          dir={isRTL === "rtl" ? "rtl" : "ltr"}
        >
          <Button
            variant="text"
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <Typography
              style={{
                marginBottom: 10,
                textAlign: isRTL === "rtl" ? "right" : "left",
                fontWeight: "bold",
                color: MAIN_COLOR,
              }}
            >
              {`<<- ${t("go_back")}`}
            </Typography>
          </Button>
        </div>
        <Grid
          container
          spacing={2}
          sx={{
            direction: isRTL === "rtl" ? "rtl" : "ltr", gridTemplateColumns: "50%",
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("title")}
              id="title"
              value={data.title}
              fullWidth
              onChange={handleInputChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("body")}
              id="body"
              value={data.body}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              fullWidth
              style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
            >
              <InputLabel
                id="device_type_select"
                sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                className={isRTL === "rtl" ? classes.right : ""}
              >
                {t("device_type")}
              </InputLabel>
              <Select
                labelId="device_type_select"
                id="device_type_select"
                value={deviceType}
                label={t("device_type")}
                onChange={handelChangeDeviceType}
                className={
                  isRTL === "rtl"
                    ? classes.selectField_rtl
                    : classes.selectField
                }
              >
                <MenuItem
                  value="All"
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("all")}
                </MenuItem>
                <MenuItem
                  value="ANDROID"
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("android")}
                </MenuItem>
                <MenuItem
                  value="IOS"
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("ios")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              fullWidth
              style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
            >
              <InputLabel
                id="select_userType"
                sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                className={isRTL === "rtl" ? classes.right : ""}
              >
                {t("user_type")}
              </InputLabel>
              <Select
                labelId="select_userType"
                id="select_userType"
                value={userType}
                label={t("user_type")}
                onChange={handelChangeUserType}
                className={
                  isRTL === "rtl"
                    ? classes.selectField_rtl_1
                    : classes.selectField
                }
              >
                <MenuItem
                  value="driver"
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("driver")}
                </MenuItem>
                <MenuItem
                  value="customer"
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("customer")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={3}
          >
            <Button
              style={{
                borderRadius: "19px",
                backgroundColor: MAIN_COLOR,
                minHeight: 50,
                marginBottom: 20,
                textAlign: "center",
                width: "50%",
              }}
              onClick={handelSubmit}
              variant="contained"
            >
              <Typography
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {t("submit")}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Card>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
};

export default AddNotifications;
