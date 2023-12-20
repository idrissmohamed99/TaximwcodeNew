import React, { useState, useEffect, useRef } from "react";
import { downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import moment from "moment/min/moment-with-locales";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
import { colors } from "../components/Theme/WebTheme";

export default function CustomerRides() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const settings = useSelector((state) => state.settingsdata.settings);
  const loaded = useRef(false);
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (bookinglistdata.bookings) {
      setBookingData(
        bookinglistdata.bookings.filter((item) => item.customer === id)
      );
    } else {
      setBookingData([]);
    }
    loaded.current = true;
  }, [bookinglistdata.bookings, id]);

  const col = [
    {
      title: t("booking_status"),
      field: "status",
      render: (rowData) => (
        <div
          style={{
            backgroundColor:
              rowData.status === "CANCELLED"
                ? colors.RED
                : rowData.status === "COMPLETE"
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
          {t(rowData.status)}
        </div>
      ),
    },
    {
      title: t("booking_ref"),
      field: "reference",
      cellStyle: {
        textAlign: "center",
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
    {
      title: t("booking_date"),
      field: "bookingDate",
      render: (rowData) =>
        rowData.bookingDate ? moment(rowData.bookingDate).format("lll") : null,
      cellStyle: {
        textAlign: "center",
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
    {
      title: t("pickup_address"),
      field: "pickupAddress",
      cellStyle: {
        textAlign: "center",
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
    {
      title: t("drop_address"),
      field: "dropAddress",
      cellStyle: {
        textAlign: "center",
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
  ];

  return !loaded.current ? (
    <CircularLoading />
  ) : (
    <>
      <div
        style={{
          backgroundColor: colors.LandingPage_Background,
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
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
          title={t("bookings_table_title")}
          columns={col}
          style={{
            direction: isRTL === "rtl" ? "rtl" : "ltr",
            borderRadius: "8px",
            boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
            border: "1px solid rgba(224, 224, 224, 1)",
            width: "100%",
          }}
          data={bookingData}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
            exportCsv: (columns, data) => {
              let hArray = [];
              const headerRow = columns.map((col) => {
                if (typeof col.title === "object") {
                  return col.title.props.text;
                }
                hArray.push(col.field);
                return col.title;
              });
              const dataRows = data.map(({ tableData, ...row }) => {
                row.createdAt =
                  new Date(row.createdAt).toLocaleDateString() +
                  " " +
                  new Date(row.createdAt).toLocaleTimeString();
                let dArr = [];
                for (let i = 0; i < hArray.length; i++) {
                  dArr.push(row[hArray[i]]);
                }
                return Object.values(dArr);
              });
              const { exportDelimiter } = ",";
              const delimiter = exportDelimiter ? exportDelimiter : ",";
              const csvContent = [headerRow, ...dataRows]
                .map((e) => e.join(delimiter))
                .join("\n");
              const csvFileName = "download.csv";
              downloadCsv(csvContent, csvFileName);
            },
            exportButton: {
              csv: settings.AllowCriticalEditsAdmin,
              pdf: false,
            },
            maxColumnSort: "all_columns",
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",

              border: "1px solid rgba(224, 224, 224, 1)",
            }),
            editable: {
              backgroundColor: colors.Header_Text,
              fontSize: "0.8em",
              fontWeight: "bold ",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',            
            },
            headerStyle: {
              position: "sticky",
              top: "0px",
              fontSize: "0.8em",
              fontWeight: "bold ",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              color: colors.Black,
              backgroundColor: SECONDORY_COLOR,
              textAlign: "center",
              border: "1px solid rgba(224, 224, 224, 1)",
            },
            cellStyle: {
              border: "1px solid rgba(224, 224, 224, 1)",
              textAlign: "center",
            },
            actionsColumnIndex: -1,
          }}
          localization={{
            body: {
              addTooltip: t("add"),
              deleteTooltip: t("delete"),
              editTooltip: t("edit"),
              emptyDataSourceMessage: t("blank_message"),
              editRow: {
                deleteText: t("delete_message"),
                cancelTooltip: t("cancel"),
                saveTooltip: t("save"),
              },
            },
            toolbar: {
              searchPlaceholder: t("search"),
              exportTitle: t("export"),
            },
            header: {
              actions: t("actions"),
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
    </>
  );
}
