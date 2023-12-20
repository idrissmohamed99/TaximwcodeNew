import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Avatar,
} from "@mui/material";
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
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
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
    paddingRight: 35,
  },
}));
const UpdateFleetAdmin = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const loaded = useRef(false);
  const { fetchUsersOnce, updateCustomerProfileImage, editUser } = api;
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const [data, setData] = useState(null);
  const [oldData, setOldData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    if (staticusers) {
      const user = staticusers.filter(
        (user) => user.id === id.toString() && user.usertype === "fleetadmin"
      )[0];
      if (!user) {
        navigate("/404");
      }
      setData(user);
      setOldData(user);
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers, id, navigate]);

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleChangeApproved = (event) => {
    setData({ ...data, approved: event.target.value });
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const profileImageChange = async (e) => {
    setProfileImage(e.target.files[0]);
  };
  const handleUpdate = () => {
    if (data === oldData && profileImage === null) {
      setCommonAlert({ open: true, msg: t("make_changes_to_update") });
    } else {
      setLoading(true);
      if (profileImage) {
        updateCustomerProfileImage(profileImage, data.id).then(() => {
          dispatch(fetchUsersOnce());
        });
      }

      dispatch(editUser(data.id, { ...data }));
      setTimeout(() => {
        setProfileImage(null);
        navigate("/users");
        setLoading(false);
      }, 1000);
    }
    loaded.current = true;
  };
  return loading ? (
    <CircularLoading />
  ) : (
    <div>
      <Card
        style={{
          borderRadius: "19px",
          backgroundColor: "#fff",
          minHeight: 400,
          maxWidth: "75vw",
          marginTop: 20,
          marginBottom: 20,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        }}
      >
        <Typography
          variant="h5"
          style={{
            margin: "10px 10px 0 5px",
            textAlign: isRTL === "rtl" ? "right" : "left",
          }}
        >
          {t("update_fleetAdmin_title")}
        </Typography>
        <div
         dir={isRTL === "rtl" ? "rtl" : "ltr"}
        >
          <Button
            variant="text"
            onClick={() => {
              navigate("/users");
            }}
          >
            <Typography
              style={{
                margin: "10px 10px 0 5px",
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
          spacing={5}
          sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <div style={{ width: 200, height: 250 }}>
              {profileImage ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    style={{
                      width: 200,
                      height: 250,
                      borderRadius: "19px",
                    }}
                  />
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 200,
                      height: 250,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: 3,
                      border: "2px dashed #B5B5B0",
                      fontSize: 16,
                      background: "none",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                    variant="square"
                  >
                    <FileUploadIcon
                      sx={{
                        fontSize: 100,
                        marginBottom: 3,
                        color: "grey",
                      }}
                    />
                    {t("upload_profile_image")}
                  </Avatar>
                </div>
              )}
              <input
                onChange={(event) => profileImageChange(event)}
                multiple={false}
                ref={fileInputRef}
                type="file"
                hidden
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                gridTemplateColumns: "50%",
                rowGap: "20px",
                marginY: 1,
                direction:isRTL === "rtl" ? "rtl" : "ltr",
              }}
            >
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <TextField
                  label={t("firstname")}
                  id="firstName"
                  value={data?.firstName || ""}
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
                  value={data?.lastName || ""}
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
                  value={
                    settings.AllowCriticalEditsAdmin
                      ? data?.mobile || ""
                      : t("hidden_demo")
                  }
                  fullWidth
                  disabled
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
                  value={
                    settings.AllowCriticalEditsAdmin
                      ? data?.email || ""
                      : t("hidden_demo")
                  }
                  fullWidth
                  disabled
                  onChange={handleInputChange}
                  className={
                    isRTL === "rtl" ? classes.rootRtl : classes.textField
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
                <FormControl
                  fullWidth
                  style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    className={isRTL === "rtl" ? classes.right : ""}
                    sx={{ "&.Mui-focused": { color: MAIN_COLOR } }}
                  >
                    {t("approve_status")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={data?.approved || false}
                    label="Approved Status"
                    onChange={handleChangeApproved}
                    className={
                      isRTL === "rtl"
                        ? classes.selectField_rtl
                        : classes.selectField
                    }
                  >
                    <MenuItem
                      style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                      value={true}
                    >
                      {t("approved")}
                    </MenuItem>
                    <MenuItem
                      style={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                      value={false}
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
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                  }}
                  onClick={handleUpdate}
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
                    {t("update")}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
};

export default UpdateFleetAdmin;
