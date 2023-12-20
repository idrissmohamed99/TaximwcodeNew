import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import CircularLoading from "components/CircularLoading";
import { colors } from "components/Theme/WebTheme";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
import { makeStyles } from "@mui/styles";
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
  rootRtl: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 20,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 20,
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
      right: 15,
      left: "auto",
      paddingRight: 25,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
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
  rootRtl_2: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 17,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
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
      right: 10,
      left: "auto",
      paddingRight: 12,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
    },
  },

  right: {
    textAlign: "right",
    right: 0,
    left: "auto",
    paddingRight: 30,
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },

}));
const AddFleetAdmin = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addUser, checkUserExists, fetchUsersOnce } = api;
  const [approved, setApproved] = useState(true);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const [loding, setLoding] = useState(false);
  const classes = useStyles();
  const [data, setData] = useState({
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    approved: true,
    walletBalance:0
  });
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleChangeApproved = (event) => {
    setApproved(event.target.value);
    setData({ ...data, approved: event.target.value });
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handelSubmit = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!(data.lastName && data.firstName)) {
      setCommonAlert({ open: true, msg: t("proper_input_name") });
    } else if (!re.test(data.email)) {
      setCommonAlert({ open: true, msg: t("proper_email") });
    } else if (data.approved === "") {
      setCommonAlert({ open: true, msg: t("check approve status") });
    } else {
      new Promise((resolve, reject) => {
        setLoding(true);
        setTimeout(() => {
          checkUserExists(data)
            .then((res) => {
              if (res.users && res.users.length > 0) {
                setCommonAlert({ open: true, msg: t("user_exists") });
                reject(new Error("User already exists"));
              } else if (res.error) {
                setCommonAlert({ open: true, msg: t("email_or_mobile_issue") });
                reject(new Error("Email or mobile issue"));
              } else {
                data["usertype"] = "fleetadmin";
                data["createdAt"] = new Date().getTime();
                dispatch(addUser(data));
                dispatch(fetchUsersOnce());
                navigate("/users");
                resolve();
              }
            })
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
          backgroundColor: "#fff",
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
          {t("add_fleetadmin_title")}
        </Typography>
        <div dir={isRTL === "rtl" ? "rtl" : "ltr"}>
          <Button
            variant="text"
            onClick={() => {
              navigate("/users");
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
          sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr", gridTemplateColumns: "50%", }}>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("firstname")}
              id="firstName"
              value={data.firstName}
              fullWidth
              onChange={handleInputChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("last_name")}
              id="lastName"
              value={data.lastName}
              fullWidth
              onChange={handleInputChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("mobile")}
              id="mobile"
              value={data.mobile}
              fullWidth
              onChange={handleInputChange}
              className={
                isRTL === "rtl" ? classes.rootRtl_2 : classes.textField
              }
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
            <TextField
              label={t("email")}
              id="email"
              value={data.email}
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
              style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }} >
              <InputLabel
                id="status-select"
                sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                className={isRTL === "rtl" ? classes.right : ""}
              >
                {t("approve_status")}
              </InputLabel>
              <Select
                labelId="status-select"
                id="status-select"
                value={approved}
                label={t("approve_status")}
                onChange={handleChangeApproved}
                className={
                  isRTL === "rtl"
                    ? classes.selectField_rtl
                    : classes.selectField
                }
              >
                <MenuItem
                  value={true}
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("approved")}
                </MenuItem>
                <MenuItem
                  value={false}
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  {t("not_approved")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <Button
              style={{
                borderRadius: "19px",
                backgroundColor: MAIN_COLOR,
                minHeight: 50,
                minWidth: "100%",
                textAlign: "center",
              }}
              onClick={handelSubmit}
              variant="contained"
            >
              <Typography
                style={{
                  color: colors.WHITE,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
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

export default AddFleetAdmin;
