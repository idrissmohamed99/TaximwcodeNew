import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
      right: 0,
      left: "auto",
      paddingRight: 20
    },
    "& legend": {
      textAlign: "right",
      marginRight: 37
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
      right: 17,
      left: "auto",
      paddingRight: 12
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25
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
  selectField_rtl_2: {
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
      marginRight: 20,
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
      marginRight: 25,
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
      marginRight: 15,
    },
  },

  right: {
    textAlign: "right",
    right: 0,
    left: "auto",
    paddingRight: 40,
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
}));

const AddCar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector((state) => state.settingsdata.settings);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editCar } = api;
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const [driversObj, setDriversObj] = useState("");
  const [role, setRole] = useState(null);
  const userdata = useSelector((state) => state.usersdata);
  const [drivers, setDrivers] = useState([]);
  const cartypes = useSelector((state) => state.cartypes);
  const [driverData, setDriverData] = useState(null);
  const [approved, setApproved] = useState(false);
  const [loding, setLoding] = useState(false);
  const classes = useStyles();
  const [data, setData] = useState({
    createdAt: new Date().getTime(),
    car_image:
      "https://cdn.pixabay.com/photo/2012/04/13/20/37/car-33556__480.png",
    vehicleNumber: "",
    vehicleMake: "",
    carType: "",
    driver: "",
    vehicleModel: "",
    other_info: "",
    active: false,
  });

  useEffect(() => {
    if (role !== "driver" && userdata.users) {
      let arr = userdata.users.filter(
        (user) =>
          user.usertype === "driver" &&
          ((role === "fleetadmin" &&
            user.fleetadmin &&
            user.fleetadmin === auth.profile.uid) ||
            role === "admin")
      );
      let obj = {};
      let obj2 = {};
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        let user = arr[i];
        arr2.push({
          id: user.id,
          desc:
            user.firstName +
            " " +
            user.lastName +
            " (" +
            (settings.AllowCriticalEditsAdmin
              ? user.mobile
              : t("hidden_demo")) +
            ") " +
            (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo")),
        });
        obj[user.id] =
          user.firstName +
          " " +
          user.lastName +
          " (" +
          (settings.AllowCriticalEditsAdmin ? user.mobile : t("hidden_demo")) +
          ") " +
          (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo"));
        obj2[user.id] = user.fleetadmin ? user.fleetadmin : null;
      }
      setDrivers(arr2);
      setDriversObj(obj);
    }
  }, [
    userdata.users,
    settings.AllowCriticalEditsAdmin,
    role,
    auth.profile.uid,
    t,
  ]);

  useEffect(() => {
    setDriverData(
      auth.profile.firstName +
        " " +
        auth.profile.lastName +
        " (" +
        (settings.AllowCriticalEditsAdmin
          ? auth.profile.mobile
          : t("hidden_demo")) +
        ") " +
        (settings.AllowCriticalEditsAdmin
          ? auth.profile.email
          : t("hidden_demo"))
    );
  }, [
    auth.profile.lastName,
    auth.profile.mobile,
    auth.profile.email,
    settings.AllowCriticalEditsAdmin,
    auth.profile.firstName,
    t,
  ]);

  useEffect(() => {
    if (auth.profile && auth.profile.usertype) {
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

  const handleChangeApproved = (event) => {
    setApproved(event.target.value);
    setData({ ...data, approved: event.target.value });
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };

  const handelChangeDriver = (event) => {
    setData({ ...data, driver: getKeyByValue(driversObj, event.target.value) });
  };
  const handelChangeCarType = (event) => {
    setData({ ...data, carType: event.target.value });
  };
  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handelSubmit = () => {
    if (!data.vehicleNumber) {
      setCommonAlert({ open: true, msg: t("car_no_not_found") });
    } else if (!data.vehicleMake) {
      setCommonAlert({ open: true, msg: t("vehicleMake_required") });
    } else if (!data.vehicleModel) {
      setCommonAlert({ open: true, msg: t("vehicleModel_required") });
    } else if (!data.driver) {
      setCommonAlert({ open: true, msg: t("driver_required") });
    } else if (!data.carType) {
      setCommonAlert({ open: true, msg: t("carType_required") });
    } else {
      setLoding(true);
      setTimeout(() => {
        dispatch(editCar(data, "Add"));
        navigate("/cars");
        setLoding(false);
      }, 600);
    }
  };

  return loding ? (
    <CircularLoading />
  ) : (
    <div>
      <Card
        style={{
          borderRadius: "19px",
          backgroundColor: colors.WHITE,
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
          {t("add_car_title")}
        </Typography>
        <div
          dir={isRTL === "rtl" ? "rtl" : "ltr"}
        >
          <Button
            variant="text"
            onClick={() => {
              navigate("/cars");
            }}
          >
            <Typography
              style={{
                marginBottom: 10,
                textAlign: isRTL === "rtl" ? "right" : "left",
                fontWeight: "bold",
                color:MAIN_COLOR
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
            direction:isRTL === "rtl" ? "rtl" : "ltr",
            gridTemplateColumns: "50%",
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("vehicle_reg_no")}
              id={"vehicleNumber"}
              value={data?.vehicleNumber}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("vehicle_model_name")}
              id={"vehicleMake"}
              value={data?.vehicleMake}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("vehicle_model_no")}
              id={"vehicleModel"}
              value={data?.vehicleModel}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("other_info")}
              id={"other_info"}
              value={data?.other_info}
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
            <FormControl fullWidth style={{direction:isRTL==="rtl"?"rtl":'ltr'}}>
              <InputLabel id="demo-simple-select-label" className={isRTL==="rtl"?classes.right:""} sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}>
                {t("driver")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={
                  role === "fleetadmin"
                    ? driversObj[data?.driver] || ""
                    : role === "driver"
                    ? auth.profile.id
                    : role === "admin"
                    ? driversObj[data?.driver] || ""
                    : ""
                }
                disabled={role === "driver" ? true : false}
                label={t("driver")}
                onChange={handelChangeDriver}
                className={isRTL==="rtl"?classes.selectField_rtl:classes.selectField}
              >
                {role === "admin" ? (
                  drivers ? (
                    drivers.map((e) => (
                      <MenuItem key={e.id} value={driversObj[e.id]} style={{direction:isRTL==='rtl'?'rtl':'ltr'}}>
                        {e.desc}
                      </MenuItem>
                    ))
                  ) : null
                ) : role === "driver" ? (
                  <MenuItem  style={{direction:isRTL==='rtl'?'rtl':'ltr'}} value={auth.profile.id}>{driverData}</MenuItem>
                ) : role === "fleetadmin" ? (
                  drivers ? (
                    drivers.map((e) => (
                      <MenuItem style={{direction:isRTL==='rtl'?'rtl':'ltr'}} key={e.id} value={driversObj[e.id]}>
                        {e.desc}
                      </MenuItem>
                    ))
                  ) : null
                ) : null}
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
            <FormControl fullWidth style={{direction:isRTL==="rtl"?"rtl":'ltr'}}>
              <InputLabel id="demo-simple-select-label" className={isRTL==="rtl"?classes.right:""}sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}>
                {t("car_type")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data?.carType || ""}
                label={t("car_type")}
                onChange={handelChangeCarType}
                className={isRTL==="rtl"?classes.selectField_rtl_1:classes.selectField}
              >
                {cartypes.cars
                  ? cartypes.cars.map((e) => (
                      <MenuItem key={e.id} value={e.name} style={{direction:isRTL==='rtl'?'rtl':'ltr'}}>
                        {e.name}
                      </MenuItem>
                    ))
                  : null}
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
            <FormControl fullWidth style={{direction:isRTL==="rtl"?"rtl":'ltr'}}>
              <InputLabel id="demo-simple-select-label"  className={isRTL==="rtl"?classes.right:""}sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}>
                {t("approved")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={approved}
                label={t("approved")}
                onChange={handleChangeApproved}
                className={isRTL==="rtl"?classes.selectField_rtl_2:classes.selectField}
              >
                <MenuItem value={true} style={{direction:isRTL==='rtl'?'rtl':'ltr'}}>{t("approved")}</MenuItem>
                <MenuItem value={false} style={{direction:isRTL==='rtl'?'rtl':'ltr'}}>{t("not_approved")}</MenuItem>
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
                textAlign:"center"
              }}
              onClick={handelSubmit}
              variant="contained"
            >
              <Typography
                style={{
                  color: colors.WHITE,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight:"bold"
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

export default AddCar;
