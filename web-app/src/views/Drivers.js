import React, { useState, useEffect, useRef } from "react";
import { downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from 'moment/min/moment-with-locales';
import { colors } from "../components/Theme/WebTheme";
import AlertDialog from "../components/AlertDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import { Typography, } from "@mui/material";
import {MAIN_COLOR,SECONDORY_COLOR} from "../common/sharedFunctions"

export default function Users() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editUser,
    deleteUser,
    fetchUsersOnce,
  } = api;
  const [data, setData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();
  const loaded = useRef(false);
  const [role, setRole] = useState(null);
  const [fleetAdminsObj, setFleetAdminsObj] = useState();
  const [sortedData, SetSortedData] = useState([]);

  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    if (staticusers) {
      if (role === "admin") {
        let arr = staticusers.filter((user) => user.usertype === "fleetadmin");
        let obj = {};
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
              (settings.AllowCriticalEditsAdmin
                ? user.email
                : t("hidden_demo")),
          });
          obj[user.id] =
            user.firstName +
            " " +
            user.lastName +
            " (" +
            (settings.AllowCriticalEditsAdmin
              ? user.mobile
              : t("hidden_demo")) +
            ") " +
            (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo"));
        }
        setFleetAdminsObj(obj);
      }
      setTimeout(() => {
        setData(
          staticusers.filter(
            (user) =>
              user.usertype === "driver" &&
              ((user.fleetadmin === auth.profile.uid &&
                auth.profile.usertype === "fleetadmin") ||
                auth.profile.usertype === "admin")
          )
        );
      }, 1000);
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [
    staticusers,
    auth.profile.usertype,
    auth.profile.uid,
    settings.AllowCriticalEditsAdmin,
    role,t
  ]);

  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data])

  useEffect(() => {
    if (auth.profile && auth.profile.usertype) {
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

 
  const handelApproved = (rowData) => {
    const updatedUser = { ...rowData, approved: !rowData.approved };

    dispatch(editUser(updatedUser.id, updatedUser));
    dispatch(fetchUsersOnce());
    return updatedUser;
  };
  const handelDriverActiveStatus = (rowData) => {
    const updatedUser = {
      ...rowData,
      driverActiveStatus: !rowData.driverActiveStatus,
    };

    dispatch(editUser(updatedUser.id, updatedUser));
    dispatch(fetchUsersOnce());
    return updatedUser;
  };

  const columns = [
    { title: t("first_name"), field: "firstName", initialEditValue: "" },
    { title: t("last_name"), field: "lastName", initialEditValue: "" },
    {
      title: t("mobile"),
      field: "mobile",
      editable: "onAdd",
      render: (rowData) =>
        settings.AllowCriticalEditsAdmin ? rowData.mobile : t("hidden_demo"),
    },
    {
      title: t("email"),
      field: "email",
      editable: "onAdd",
      render: (rowData) =>
        settings.AllowCriticalEditsAdmin ? rowData.email : t("hidden_demo"),
      headerStyle: { textAlign: "center" },
    },
    { title: t('vehicle_reg_no'), field: 'vehicleNumber', editable:'never', initialEditValue: '',cellStyle:{textAlign:isRTL=== 'rtl' ?'right':'center'} },
    { title: t('wallet_balance'),  field: 'walletBalance', type:'numeric' , editable:'never', initialEditValue: 0,cellStyle:{textAlign:isRTL=== 'rtl' ?'right':'center'}},
    { title: t('you_rated_text'), render: rowData => <span>{rowData.rating?rowData.rating: "0"}</span>,cellStyle:{textAlign:isRTL=== 'rtl' ?'right':'center'} },

    {
      title: t("profile_image"),
      field: "profile_image",
      render: (rowData) =>
        rowData.profile_image ? (
          <img
            alt="Profile"
            src={rowData.profile_image}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 40 }} />
        ),
      editable: "never",
    },
    {
      title: t("account_approve"),
      field: "approved",
      type: "boolean",
      initialEditValue: true,
      render: (rowData) => (
        <Switch
          checked={rowData.approved}
          onChange={() => handelApproved(rowData)}
        />
      ),
    },
    {
      title: t("driver_active"),
      field: "driverActiveStatus",
      editable: "never",
      type: "boolean",
      initialEditValue: true,
      render: (rowData) => (
        <Switch
          disabled
          checked={rowData.driverActiveStatus}
          onChange={() => handelDriverActiveStatus(rowData)}
        />
      ),
    },
    {
      title: t("queue"),
      field: "queue",
      editable: "never",
      type: "boolean",
      initialEditValue: true,
      render: (rowData) => (
        <Switch
          disabled
          checked={rowData.queue}
          onChange={() => console.log(rowData.queue)}
        />
      ),
    }
  ];

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };


  const [selectedRow, setSelectedRow] = useState(null);

  return !loaded.current ? (
    <CircularLoading />
  ) : (
    <div style={{ backgroundColor: colors.LandingPage_Background }}>
      <MaterialTable
        title={t("drivers_title")}
        columns={columns}
        style={{
          direction: isRTL === "rtl" ? "rtl" : "ltr",
          borderRadius: "8px",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
          border: "1px solid rgba(224, 224, 224, 1)",
          padding: "20px",
        }}
        data={sortedData}
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
              row.fleetadmin = row.fleetadmin
                ? fleetAdminsObj[row.fleetadmin]
                : "";
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
              selectedRow === rowData.tableData.id ? "#F5F5F5" : "white",

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
            color: colors.BLACK,
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
        editable={{
          onRowDelete: (oldData) =>
            settings.AllowCriticalEditsAdmin
              ? new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    dispatch(deleteUser(oldData.id));
                    dispatch(fetchUsersOnce());
                  }, 600);
                })
              : new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    alert(t("demo_mode"));
                  }, 600);
                }),
        }}
        actions={[
          {
            icon: "add",
            tooltip: t("add_driver"),
            isFreeAction: true,
            onClick: (event) => navigate("/users/adddriver"),
          },
          {
            icon: "info",
            tooltip: t("profile_page_subtitle"),
            onClick: (event, rowData) => {
              navigate(`/users/driverdetails/${rowData.id}`);
            },
          },
          (rowData) => ({
            icon: () => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: 10,
                  backgroundColor: MAIN_COLOR,
                  borderRadius: 5,
                  boxShadow: "0px 3px 5px 0px #B4B4B3",
                }}
              >
                <Typography style={{ color: colors.LandingPage_Background }}>
                  {t("documents")}
                </Typography>
              </div>
            ),
            tooltip: t("documents"),
            onClick: () => navigate(`/users/userdocuments/${rowData.id}`),
          }),
        ]}
      />
      
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
}
