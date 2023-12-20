import React,{useState,useEffect,useRef} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DriverInfo from "./DriverInfo";
import DriverWallet from "./DriverWallet";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import DriverRides from "./DriverRides";
import { api } from "common";
import DriverCars from "./DriverCars";
import {MAIN_COLOR,SECONDORY_COLOR} from "../common/sharedFunctions";
import { makeStyles} from '@mui/styles';

    const useStyles = makeStyles({
  tabs: {

    "& .MuiTabs-indicator": {
      backgroundColor: SECONDORY_COLOR,
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: MAIN_COLOR
    }
  }
})

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DriverDetails() {
  const { id } = useParams();
  const {
    fetchUsersOnce, fetchUserWalletHistory
  } = api;
  const [value, setValue] = React.useState(0);
  const { t, } = useTranslation();
  const [data,setData] = useState([])
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const walletHistory = useSelector((state) => state.auth.walletHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loaded = useRef(false);
  const[walletHistoryData,setWalletHistoryData] = useState();
  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchUsersOnce());
    dispatch(fetchUserWalletHistory(id));
    if(walletHistory){

      setWalletHistoryData(walletHistory)
    }

  }, [dispatch, fetchUsersOnce,fetchUserWalletHistory,id,walletHistory]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    if (staticusers) {
      const user = staticusers.filter((user) => (user.id === id.toString()) && (user.usertype === "driver") )[0];
      if (!user) {
        navigate("/404");
      }
      setData(user);
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers,id,navigate]);


  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Driver tabs"
          className={classes.tabs}
        >
          <Tab
            label={t("info")}
            {...a11yProps(0)}
          />
          <Tab
            label={t("rides")}
            {...a11yProps(1)}
          />
          <Tab
            label={t("cars")}
            {...a11yProps(2)}
          />
          <Tab
            label={t("wallet")}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
        <TabPanel value={value} index={0}>
          <DriverInfo />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DriverRides data= {data}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <DriverCars data= {data}/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <DriverWallet data= {data} wallet = {walletHistory === walletHistoryData? [] : walletHistoryData}/>
        </TabPanel>
    </Box>
  );
}