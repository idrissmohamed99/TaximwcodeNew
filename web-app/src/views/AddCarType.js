import React, { useState } from "react";
import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { Typography, TextField, Button, Grid, Card } from "@mui/material";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
  rootRtl_3: {
    "& label": {
      right: 17,
      left: "auto",
      paddingRight: 12
    },
    "& legend": {
      textAlign: "right",
      marginRight: 20
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
  rootRtl: {
    "& label": {
      right: 20,
      left: "auto",
      paddingRight: 20
    },
    "& legend": {
      textAlign: "right",
      marginRight: 15
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
      right: 0,
      left: "auto",
      paddingRight: 20
    },
    "& legend": {
      textAlign: "right",
      marginRight: 30
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
  rootRtl_4: {
    "& label": {
      right: 17,
      left: "auto",
      paddingRight: 12
    },
    "& legend": {
      textAlign: "right",
      marginRight: 15
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
      right: 0,
      left: "auto",
    },
    "& legend": {
      textAlign: "right",
      marginRight: 35,
    },
  },

  right: {
    textAlign: "right",
    right: 0,
    left: "auto",
    paddingRight: 40,
  },
}));

const AddCarType = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loding, setLoding] = useState(false);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const { editCarType } = api;
  const classes = useStyles();
  const [data, setData] = useState({
    name: "",
    base_fare: 0,
    convenience_fee_type: "",
    pos: "",
    convenience_fees: 0,
    rate_per_hour: 0,
    extra_info: "",
    min_fare: 0,
    rate_per_unit_distance: 0,
    fleet_admin_fee: 0,
    image: "https://cdn.pixabay.com/photo/2012/04/15/22/09/car-35502__480.png",
  });
  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleInputToNumberChange = (e) => {
    setData({ ...data, [e.target.id]: Number(e.target.value) });
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleChangeConvenienceFeeType = (e) => {
    setData({ ...data, convenience_fee_type: e.target.value });
  };
  const handelSubmit = () => {
    if (
      !(
        data &&
        data.name &&
        data.pos &&
        data.convenience_fee_type &&
        data.base_fare &&
        data.convenience_fees &&
        data.min_fare &&
        data.rate_per_hour &&
        data.rate_per_unit_distance &&
        data.fleet_admin_fee
      )
    ) {
      if (!(data && data.name)) {
        setCommonAlert({ open: true, msg: t("proper_input_name") });
      } else if (!data.pos) {
        setCommonAlert({ open: true, msg: t("position_required") });
      } else if (!data.base_fare) {
        setCommonAlert({ open: true, msg: t("base_fare_required") });
      } else if (!data.convenience_fees) {
        setCommonAlert({ open: true, msg: t("convenience_fee_required") });
      } else if (!data.min_fare) {
        setCommonAlert({ open: true, msg: t("min_fare_required") });
      } else if (!data.rate_per_hour) {
        setCommonAlert({ open: true, msg: t("rate_per_hour_required") });
      } else if (!data.fleet_admin_fee) {
        setCommonAlert({ open: true, msg: t("fleet_admin_fee_required") });
      } else if (!data.rate_per_unit_distance) {
        setCommonAlert({
          open: true,
          msg: t("rate_per_unit_distance_required"),
        });
      } else if (!data.convenience_fee_type) {
        setCommonAlert({ open: true, msg: t("convenience_fee_type_required") });
      }
    } else {
      settings.AllowCriticalEditsAdmin
        ? new Promise((resolve, reject) => {
          setLoding(true);
          setTimeout(() => {
            if (data && data.name) {
              data["createdAt"] = new Date().getTime();
              dispatch(editCarType(data, "Add"));
              resolve();
              setLoding(false);
              navigate("/cartypes");
            } else {
              setCommonAlert({ open: true, msg: t("proper_input_name") });
              reject(new Error("Enter proper name"));
              setLoding(false);
            }
          }, 600);
        })
        : new Promise((resolve) => {
          setTimeout(() => {
            resolve();
            setCommonAlert({ open: true, msg: t("demo_mode") });
          }, 600);
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
          {t("add_cartype_title")}
        </Typography>
        <div
          dir={isRTL === "rtl" ? "rtl" : "ltr"}
          >
          <Button
            variant="text"
            onClick={() => {
              navigate("/cartypes");
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
            gridTemplateColumns: "50%",
            direction:isRTL==='rtl'?'rtl':'ltr'
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("name")}
              id="name"
              value={data.name}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("base_fare")}
              id="base_fare"
              value={data.base_fare}
              fullWidth
              type="number"
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_3 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("extra_info")}
              id="extra_info"
              value={data.extra_info || ""}
              fullWidth
              onChange={handleInputChange}
              className={isRTL === "rtl" ? classes.rootRtl_3: classes.textField}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("convenience_fee")}
              id="convenience_fees"
              value={data.convenience_fees}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_4: classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("rate_per_hour")}
              id="rate_per_hour"
              value={data.rate_per_hour}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_3 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("min_fare")}
              id="min_fare"
              value={data.min_fare}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("rate_per_unit_distance")}
              id="rate_per_unit_distance"
              value={data.rate_per_unit_distance}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_1 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("position")}
              id="pos"
              value={data.pos}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_4 : classes.textField}
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
                id="demo-simple-select-label"
                className={isRTL === "rtl" ? classes.right : ""}
                sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
              >
                {t("convenience_fee_type")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="convenience_fee_type"
                value={data.convenience_fee_type || ""}
                label={t("convenience_fee_type")}
                onChange={handleChangeConvenienceFeeType}
                className={
                  isRTL === "rtl"
                    ? classes.selectField_rtl
                    : classes.selectField
                }
              >
                <MenuItem
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                  value={"percentage"}
                >
                  {t("percentage")}
                </MenuItem>
                <MenuItem
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                  value={"flat"}
                >
                  {t("flat")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <TextField
              label={t("fleet_admin_fee")}
              id="fleet_admin_fee"
              value={data.fleet_admin_fee}
              type="number"
              fullWidth
              onChange={handleInputToNumberChange}
              className={isRTL === "rtl" ? classes.rootRtl_2 : classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button
              style={{
                borderRadius: "19px",
                backgroundColor: MAIN_COLOR,
                minHeight: 50,
                minWidth: "50%",
                textAlign:"center",
                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
              }}
              onClick={handelSubmit}
              variant="contained"
            >
              <Typography
                style={{
                  color: colors.WHITE,
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

export default AddCarType;
