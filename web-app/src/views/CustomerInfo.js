import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Avatar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Tooltip from "@mui/material/Tooltip";
import { colors } from "../components/Theme/WebTheme";
import AlertDialog from "../components/AlertDialog";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
import { makeStyles } from "@mui/styles";
import { api } from "common";

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
    "& .MuiFilledInput-root": {
      background: SECONDORY_COLOR,
    },
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
  rootRtl_1: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 20,
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
  rootRtl_3: {
    "& label": {
      right: 0,
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
}));

function CustomerInfo() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const navigate = useNavigate();
  const { editUser, fetchUsersOnce, updateCustomerProfileImage } = api;
  const [data, setData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const loaded = useRef(false);
  const [editable, setEditable] = useState(false);
  const [newData, setNewData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const settings = useSelector((state) => state.settingsdata.settings);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    if (staticusers) {
      const user = staticusers.filter(
        (user) => user.id === id.toString() && user.usertype === "customer"
      )[0];
      if (!user) {
        navigate("/404");
      }
      setData(user);
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers, id, navigate]);

  const handleSaveUser = () => {
    setLoading(true);

    if (profileImage) {
      updateCustomerProfileImage(profileImage, data.id).then(() => {
        dispatch(fetchUsersOnce());
      });
    } else if (
      JSON.stringify(data) !== JSON.stringify(newData) &&
      Object.keys(newData).length !== 0
    ) {
      dispatch(editUser(newData.id, { ...newData }));
      dispatch(fetchUsersOnce());
    } else if (
      JSON.stringify(data) === JSON.stringify(newData) ||
      (profileImage === null && Object.keys(newData).length === 0)
    ) {
      setCommonAlert({ open: true, msg: t("make_changes_to_update") });
    }

    setTimeout(() => {
      setProfileImage(null);
      setEditable(false);
      setLoading(false);
    }, 2000);

    loaded.current = true;
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleInputChange = (e) => {
    setNewData({ ...data, ...newData, [e.target.id]: e.target.value });
  };

  const profileImageChange = async (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleCancel = () => {
    setProfileImage(null);
    setEditable(false);
  };

  const handleApprove = (e) => {
    if (data.approved === true) {
      dispatch(editUser(data.id, { ...data, approved: false }));
      dispatch(fetchUsersOnce());
    } else if (data.approved === false) {
      dispatch(editUser(data.id, { ...data, approved: true }));
      dispatch(fetchUsersOnce());
    }
  };
  return loading ? (
    <CircularLoading />
  ) : (
    <Card
      style={{
        borderRadius: "19px",
        backgroundColor: "#fff",
        minHeight: 100,
        marginBottom: 20,
        padding: 20,
        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
      }}
    >
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
              textAlign: isRTL === "rtl" ? "right" : "left",
              fontWeight: "bold",
              color: MAIN_COLOR,
            }}
          >
            {`<<- ${t("go_back")}`}
          </Typography>
        </Button>
      </div>
      <Grid container spacing={1} sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          xl={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <>
            {editable ? (
              <>
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
              </>
            ) : (
              <>
                {data.profile_image ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={data.profile_image}
                      alt="Profile"
                      style={{
                        width: 200,
                        height: 250,
                        borderRadius: "19px",
                      }}
                    />
                  </div>
                ) : (
                  <Avatar
                    sx={{
                      width: 200,
                      height: 250,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: 3,
                      border: "2px dashed #B5B5B0",
                      fontSize: 20,
                      background: "none",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                    variant="square"
                  >
                    {data?.firstName?.slice(0, 1) +
                      " " +
                      data?.lastName?.slice(0, 1)}
                  </Avatar>
                )}
              </>
            )}

            {!editable ? (
              <Tooltip
                title={
                  data.approved === true
                    ? "Click to not approve"
                    : "Click to approve"
                }
                placement="bottom"
                arrow
              >
                <Button
                  style={{
                    borderRadius: "19px",
                    backgroundColor:
                      data.approved === true ? colors.GREEN : colors.RED,
                    minHeight: 50,
                    minWidth: 100,
                    marginBottom: 20,
                    marginTop: 20,
                    width: "50%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  variant="contained"
                  onClick={handleApprove}
                >
                  <Typography
                    style={{
                      color: colors.WHITE,
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {data.approved === true ? t("approved") : t("not_approved")}
                  </Typography>
                </Button>
              </Tooltip>
            ) : null}

            {!editable ? (
              <Button
                style={{
                  borderRadius: "19px",
                  backgroundColor: MAIN_COLOR,
                  minHeight: 50,
                  minWidth: 100,
                  marginBottom: 20,
                  marginTop: 20,
                  width: "50%",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setEditable(true)}
                sx={{
                  cursor: "pointer",
                  borderColor: colors.CARD_DETAIL,
                }}
                variant="contained"
              >
                <Typography
                  style={{
                    color: colors.WHITE,
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {t("edit")}
                </Typography>
              </Button>
            ) : (
              <>
                <Button
                  style={{
                    borderRadius: "19px",
                    backgroundColor: colors.GREEN,
                    minHeight: 50,
                    minWidth: 100,
                    marginBottom: 20,
                    marginTop: 20,
                    width: "50%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleSaveUser}
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
                    {t("save")}
                  </Typography>
                </Button>
                <Button
                  style={{
                    borderRadius: "19px",
                    backgroundColor: colors.RED,
                    minHeight: 50,
                    minWidth: 100,
                    marginBottom: 20,
                    marginTop: 20,
                    width: "50%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  variant="contained"
                  onClick={handleCancel}
                >
                  <Typography
                    style={{
                      color: colors.WHITE,
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {t("cancel")}
                  </Typography>
                </Button>
              </>
            )}
          </>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={8}
          xl={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
          }}
          gap={2}
        >
          <Grid
            container
            spacing={2}
            sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
          >
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              {editable ? (
                <TextField
                  label={t("firstname")}
                  id="firstName"
                  defaultValue={data?.firstName}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  className={
                    isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
                  }
                />
              ) : (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                          minHeight: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          backgroundColor: MAIN_COLOR,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontSize: 16,
                          }}
                        >
                          {t("first_name")}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl"
                              ? "15px 0 0 15px "
                              : "0 15px 15px 0",
                          backgroundColor: colors.WHITE,
                          minHeight: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold",
                          }}
                        >
                          {data?.firstName}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              {editable ? (
                <TextField
                  label={t("last_name")}
                  id="lastName"
                  defaultValue={data?.lastName}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  className={
                    isRTL === "rtl" ? classes.rootRtl_1 : classes.textField
                  }
                />
              ) : (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                          backgroundColor: MAIN_COLOR,
                          minHeight: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontSize: 16,
                          }}
                        >
                          {t("last_name")}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl"
                              ? "15px 0 0 15px "
                              : "0 15px 15px 0",
                          backgroundColor: colors.WHITE,
                          minHeight: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "Black",
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold",
                          }}
                        >
                          {data?.lastName}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          {!editable ? (
            <Grid
              container
              spacing={2}
              sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
            >
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <Card
                  style={{
                    borderRadius:
                      isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                    backgroundColor: MAIN_COLOR,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 10,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                  }}
                >
                  <Typography
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    {t("mobile")}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card
                  style={{
                    borderRadius:
                      isRTL === "rtl" ? "15px 0 0 15px " : "0 15px 15px 0",
                    backgroundColor: colors.WHITE,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 10,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                  }}
                >
                  <Typography
                    style={{
                      color: "Black",
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {settings.AllowCriticalEditsAdmin
                      ? data?.mobile
                      : t("hidden_demo")}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          ) : null}
          {!editable ? (
            <Grid
              container
              spacing={2}
              sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
            >
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <Card
                  style={{
                    borderRadius:
                      isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                    backgroundColor: MAIN_COLOR,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 10,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                  }}
                >
                  <Typography
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    {t("email")}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card
                  style={{
                    borderRadius:
                      isRTL === "rtl" ? "15px 0 0 15px " : "0 15px 15px 0",
                    backgroundColor: colors.WHITE,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 10,
                    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                  }}
                >
                  <Typography
                    style={{
                      color: "Black",
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {settings.AllowCriticalEditsAdmin
                      ? data?.email
                      : t("hidden_demo")}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          ) : null}
          <Grid container spacing={2} direction="row" justifyContent={"center"}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {editable ? (
                <TextField
                  label={t("verify_id")}
                  id="verifyId"
                  defaultValue={data?.verifyId}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  className={
                    isRTL === "rtl" ? classes.rootRtl_3 : classes.textField
                  }
                  style={{ marginTop: 20 }}
                />
              ) : (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl" ? "0 15px 15px 0" : "15px 0 0 15px",
                          backgroundColor: MAIN_COLOR,
                          minHeight: 90,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontSize: 16,
                          }}
                        >
                          {t("verify_id")}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Card
                        style={{
                          borderRadius:
                            isRTL === "rtl"
                              ? "15px 0 0 15px "
                              : "0 15px 15px 0",
                          backgroundColor: colors.WHITE,
                          minHeight: 90,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 10,
                          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: "Black",
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold",
                          }}
                        >
                          {data?.verifyId ? data.verifyId : null}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </Card>
  );
}

export default CustomerInfo;
