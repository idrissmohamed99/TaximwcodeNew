import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Typography, Grid, Card, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";
import { colors } from "../components/Theme/WebTheme";
import { useNavigate } from "react-router-dom";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";

function DriverWallet(props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settingsdata = useSelector((state) => state.settingsdata);
  const [selectedRow, setSelectedRow] = useState(null);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (settingsdata.settings) {
      setSettings(settingsdata.settings);
    }
  }, [settingsdata.settings]);

  const columns = [
    {
      title: t("requestDate"),
      field: "date",
      render: (rowData) =>
        rowData.date ? moment(rowData.date).format("lll") : null,
    },
    {
      title: t("amount"),
      field: "amount",
      editable: "never",
      render: (rowData) =>
        rowData.amount
          ? settings.swipe_symbol
            ? rowData.amount + " " + settings.symbol
            : settings.symbol + " " + rowData.amount
          : settings.swipe_symbol
            ? "0 " + settings.symbol
            : settings.symbol + " 0",
    },
    {
      title: t("transaction_id"),
      field: "transaction_id",
      render: (rowData) =>
        rowData.transaction_id ? rowData.transaction_id : rowData.txRef,
    },
    {
      title: t("type"),
      field: "type",
      render: (rowData) => (
        <div
          style={{
            backgroundColor:
              rowData.type === "Debit"
                ? colors.RED
                : rowData.type === "Credit"
                  ? colors.GREEN
                  : colors.YELLOW,
            color: "white",
            padding: 7,
            borderRadius: "15px",
            fontWeight: "bold",
            width: "150px",
            margin: "auto",
          }}
        >
          {t(rowData.type)}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        style={{
          borderRadius: "19px",
          backgroundColor: "#fff",
          marginTop: 20,
          marginBottom: 20,
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            direction:isRTL === "rtl" ? "rtl" : "ltr",
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: colors.WHITE,
                minHeight: 70,
                minWidth: 300,
                width: "80%",
                color: "white",
                display: "flex",
                boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
              }}
            >
              <Typography
                style={{
                  fontSize: 20,
                  backgroundColor: MAIN_COLOR,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                {t("wallet_ballance")}
              </Typography>
              <Typography
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: colors.BLACK,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {props.data?.walletBalance
                  ? settings.swipe_symbol
                    ? props.data.walletBalance + " " + settings.symbol
                    : settings.symbol + " " + props.data.walletBalance
                  : settings.swipe_symbol
                    ? "0 " + settings.symbol
                    : settings.symbol + " 0"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div
              style={{
                backgroundColor: colors.WHITE,
                borderRadius: "8px",
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
              <MaterialTable
                title={t("transaction_history_title")}
                columns={columns}
                style={{
                  direction: isRTL === "rtl" ? "rtl" : "ltr",
                  borderRadius: "8px",
                  boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
                }}
                data={props.wallet ? props.wallet : []}
                onRowClick={(evt, selectedRow) =>
                  setSelectedRow(selectedRow.tableData.id)
                }
                options={{
                  pageSize: 10,
                  pageSizeOptions: [10, 15, 20],
                  exportButton: true,
                  rowStyle: (rowData) => ({
                    backgroundColor:
                      selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",

                    border: "1px solid rgba(224, 224, 224, 1)",
                  }),
                  editable: {
                    backgroundColor: colors.CARD_DETAIL,
                    fontSize: "0.8em",
                    fontWeight: "bold ",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  },
                  headerStyle: {
                    backgroundColor: SECONDORY_COLOR,
                    color: colors.Black,
                    fontSize: "0.8em",
                    fontWeight: "bold ",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    border: "1px solid rgba(224, 224, 224, 1)",
                    textAlign: "center",
                  },
                  cellStyle: {
                    border: "1px solid rgba(224, 224, 224, 1)",
                    textAlign: "center",
                  },
                }}
                localization={{
                  toolbar: {
                    searchPlaceholder: t("search"),
                    exportTitle: t("export"),
                  },
                  pagination: {
                    labelDisplayedRows: "{from}-{to} " + t("of") + " {count}",
                    firstTooltip: t("first_page_tooltip"),
                    previousTooltip: t("previous_page_tooltip"),
                    nextTooltip: t("next_page_tooltip"),
                    lastTooltip: t("last_page_tooltip"),
                  },
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default DriverWallet;
