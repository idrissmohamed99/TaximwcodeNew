import React, { useState, useEffect } from "react";
import { Typography, Grid, Card, Avatar, Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { colors } from "../components/Theme/WebTheme";
import moment from "moment/min/moment-with-locales";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { makeStyles } from "@mui/styles";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions"
const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: "10px",
    backgroundColor: "#fff",
    minHeight: 100,
    marginTop: 5,
    marginBottom: 20,
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
  },
  txt: {
    padding: 10,
    fontWeight: "bold",
    minHeight: 60,
    backgroundColor: SECONDORY_COLOR,
    color: colors.BLACK,
    boxShadow: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
function BookingDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const settings = useSelector((state) => state.settingsdata.settings);
  const classes = useStyles();
  useEffect(() => {
    if (bookinglistdata.bookings) {
      const booking = bookinglistdata.bookings.filter(
        (item) => item.id === id.toString()
      )[0];

      if (booking) {
        setData(booking);
      } else {
        navigate("/404");
        setData([]);
      }
    }
  }, [bookinglistdata.bookings, id, navigate]);

  return (
    <>
      <div dir={isRTL === "rtl" ? "rtl" : "ltr"}
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          variant="text"
          onClick={() => {
            navigate("/bookings");
          }}
        >
          <Typography
            style={{
              margin: "10px 10px 0 5px",
              textAlign: isRTL === "rtl" ? "right" : "left",
              fontWeight: "bold",
              color: MAIN_COLOR
            }}
          >
            {`<<- ${t("go_back")}`}
          </Typography>
        </Button>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                <Typography
                  className={classes.txt}
                  style={{
                    borderBottomRightRadius: isRTL ? "90px" : "",
                    borderBottomLeftRadius: isRTL ? "" : "90px",
                  }}
                  variant="h5"
                >
                  {t("ride_information")}
                </Typography>

                <Grid container direction="column" style={{ padding: 10 }}>
                  {data?.id ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("booking_id")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.id}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.reference ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("booking_ref")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.reference}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.status ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("booking_status_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 3,
                            textAlign: "center",
                            backgroundColor:
                              data?.status === "CANCELLED"
                                ? colors.RED
                                : data?.status === "COMPLETE"
                                  ? colors.GREEN
                                  : colors.YELLOW,
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            wordBreak: 'break-word'
                          }}
                        >
                          {t(data?.status)}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.tripdate ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("trip_start_date")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.tripdate
                            ? moment(data?.tripdate).format("lll")
                            : null}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.trip_start_time ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("trip_start_time")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.trip_start_time}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.trip_end_time ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("trip_end_time")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.trip_end_time}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.parcelTypeSelected ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("parcel_type_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data.parcelTypeSelected
                            ? data.parcelTypeSelected.description +
                            " (" +
                            data.parcelTypeSelected.amount +
                            ")"
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.optionSelected ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("parcel_option")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data.optionSelected
                            ? data.optionSelected.description +
                            " (" +
                            data.optionSelected.amount +
                            ")"
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.deliveryPerson ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("deliveryPerson")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.deliveryPerson}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.deliveryPersonPhone ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("deliveryPersonPhone")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.deliveryPersonPhone}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.pickup_image ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("take_pickup_image_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <img
                          src={data?.pickup_image}
                          alt="pickup_image"
                          style={{
                            width: 120,
                            height: 90,
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.deliver_image ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("take_deliver_image_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <img
                          src={data?.deliver_image}
                          alt="deliver_image"
                          style={{
                            width: 120,
                            height: 90,
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.reason ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("cancellation_reason")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.reason}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.otp ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("otp")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.otp}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.total_trip_time ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("total_time")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.total_trip_time}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.distance ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("distance_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          { }
                          {settings.convert_to_mile
                            ? data?.distance + t("mile")
                            : data?.distance + " " + t("km")}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.pickUpInstructions ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("pickUpInstructions_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.pickUpInstructions}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {data?.deliveryInstructions ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("deliveryInstructions")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.deliveryInstructions}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.feedback ? (
                    <Grid
                      container
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        minHeight: 60,
                        marginBottom: 20,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            //color: "green",
                          }}
                        >
                          {t("feedback")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordBreak: 'break-word'
                          }}
                        >
                          {data?.feedback}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.pickupAddress ? (
                    <Grid
                      container
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        minHeight: 60,
                        marginBottom: 20,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            color: "green",
                          }}
                        >
                          {t("pickup_address")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordBreak: 'break-word'
                          }}
                        >
                          {data?.pickupAddress}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.dropAddress ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            color: "red",
                          }}
                        >
                          {t("drop_address")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordBreak: 'break-word'
                          }}
                        >
                          {data?.dropAddress}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                <Typography
                  className={classes.txt}
                  style={{
                    borderBottomRightRadius: isRTL ? "90px" : "",
                    borderBottomLeftRadius: isRTL ? "" : "90px",
                  }}
                  variant="h5"
                >
                  {t("payment_info")}
                </Typography>

                <Grid container direction="column" style={{ paddingRight: 15, paddingLeft:15,paddingBottom:15 }}>
                  {data?.trip_cost ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("trip_cost")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.trip_cost + " " + settings.symbol
                            : settings.symbol + " " + data?.trip_cost}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.customer_paid ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("Customer_paid")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.customer_paid + " " + settings.symbol
                            : settings.symbol + " " + data?.customer_paid}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.discount ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("discount_ammount")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.discount + " " + settings.symbol
                            : settings.symbol + " " + data?.discount}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.driver_share ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("driver_share")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.driver_share + " " + settings.symbol
                            : settings.symbol + " " + data?.driver_share}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {data?.fleetCommission && parseFloat(data?.fleetCommission) > 0 ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("fleet_admin_comission")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.fleetCommission + " " + settings.symbol
                            : settings.symbol + " " + data?.fleetCommission}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.convenience_fees ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("convenience_fee")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.convenience_fees + " " + settings.symbol
                            : settings.symbol + " " + data?.convenience_fees}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.cancellationFee ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("cancellationFee")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ?data.cancellationFee
                              ? data.cancellationFee
                              : (0).toFixed(settings.decimal) +
                              " " +
                              settings.symbol
                            : settings.symbol + " " + data.cancellationFee
                              ? data.cancellationFee
                              : (0).toFixed(settings.decimal)}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.gateway ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("payment_gateway")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.gateway}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.payment_mode ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("payment_mode_web")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {data?.payment_mode}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.cashPaymentAmount ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("cash_payment_amount")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.cashPaymentAmount + " " + settings.symbol
                            : settings.symbol + " " + data?.cashPaymentAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.cardPaymentAmount ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("card_payment_amount")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? settings.symbol + " " + data?.cardPaymentAmount
                            : data?.cardPaymentAmount + " " + settings.symbol}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.usedWalletMoney ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("wallet_payment_amount")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.usedWalletMoney + " " + settings.symbol
                            : settings.symbol + " " + data?.usedWalletMoney}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.payableAmount ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                          }}
                        >
                          {t("payable_ammount")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                          }}
                        >
                          {settings.swipe_symbol
                            ? data?.payableAmount + " " + settings.symbol
                            : settings.symbol + " " + data?.payableAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Card>
            </Grid>{" "}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                <Typography
                  className={classes.txt}
                  style={{
                    borderBottomRightRadius: isRTL ? "90px" : "",
                    borderBottomLeftRadius: isRTL ? "" : "90px",
                  }}
                  variant="h5"
                >
                  {t("driver_info")}
                </Typography>

                <Grid container direction="column" style={{ padding: 15 }}>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data?.driver_image ? (
                      <Avatar
                        alt="driver profile image"
                        src={data?.driver_image}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                    )}
                  </Grid>

                  {data?.driver ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("driver_id")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            //   flexWrap:"wrap"
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.driver}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.driver_name ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("driver_name")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.driver_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.driver_contact ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("driver_contact")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.driver_contact}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.driver_email ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("driver_email")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {" "}
                          {settings.AllowCriticalEditsAdmin
                            ? data?.driver_email
                            : t("hidden_demo")}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.carType ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("car_type")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.carType}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.vehicle_number ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("vehicle_no")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.vehicle_number}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {data?.driverDeviceId ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 60,
                      }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "right" : "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {t("device_id")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 18,
                            padding: 2,
                            letterSpacing: -1,
                            textAlign: "center",
                          }}
                        >
                          -----
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontSize: 16,
                            padding: 2,
                            textAlign: isRTL === "rtl" ? "left" : "right",
                            wordWrap: "break-word",
                          }}
                        >
                          {data?.driverDeviceId}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                <Typography
                  className={classes.txt}
                  style={{
                    borderBottomRightRadius: isRTL ? "90px" : "",
                    borderBottomLeftRadius: isRTL ? "" : "90px",
                  }}
                  variant="h5"
                >
                  {t("customer_info")}
                </Typography>

                <Grid container direction="column" style={{ padding: 15 }}>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data?.customer_image ? (
                      <Avatar
                        alt="customer profile image"
                        src={data?.customer_image}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                    )}
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 60,
                    }}
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "right" : "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {t("customer_id")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Typography
                        style={{
                          fontSize: 18,
                          padding: 2,
                          letterSpacing: -1,
                          textAlign: "center",
                        }}
                      >
                        -----
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "left" : "right",
                          //   flexWrap:"wrap"
                          wordWrap: "break-word",
                        }}
                      >
                        {data?.customer}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 60,
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "right" : "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {t("customer_name")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 18,
                          padding: 2,
                          letterSpacing: -1,
                          textAlign: "center",
                        }}
                      >
                        -----
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "left" : "right",
                          wordWrap: "break-word",
                        }}
                      >
                        {data?.customer_name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 60,
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "right" : "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {t("customer_contact")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 18,
                          padding: 2,
                          letterSpacing: -1,
                          textAlign: "center",
                        }}
                      >
                        -----
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "left" : "right",
                          wordWrap: "break-word",
                        }}
                      >
                        {settings.AllowCriticalEditsAdmin
                          ? data?.customer_contact
                          : t("hidden_demo")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    sx={{ direction:isRTL === "rtl" ? "rtl" : "ltr",}}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 60,
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "right" : "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {t("customer_email")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 18,
                          padding: 2,
                          letterSpacing: -1,
                          textAlign: "center",
                        }}
                      >
                        -----
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          padding: 2,
                          textAlign: isRTL === "rtl" ? "left" : "right",
                          wordWrap: "break-word",
                        }}
                      >
                        {settings.AllowCriticalEditsAdmin
                          ? data?.customer_email
                          : t("hidden_demo")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default BookingDetails;
