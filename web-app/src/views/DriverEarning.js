import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import {  SECONDORY_COLOR } from "../common/sharedFunctions";

export default function DriverEarning() {
  
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();

  const columns =  [
      { title: t('year'),field: 'year',
      },
      { title: t('months'), field: 'monthsName', },
      { title: t('driver_name'), field: 'driverName', 
    },
      { title: t('booking_count'), field: 'total_rides', 
    },
      { title: t('vehicle_reg_no'), field: 'driverVehicleNo', 
      },
      { title: t('earning_amount'), field: 'driverShare', 
    }
  ];

  const [data, setData] = useState([]);
  const driverearningdata = useSelector(state => state.driverearningdata);

  useEffect(()=>{
        if(driverearningdata.driverearnings){
            setData(driverearningdata.driverearnings);
        }
  },[driverearningdata.driverearnings]);

  const [selectedRow, setSelectedRow] = useState(null);
  
  return (
    driverearningdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('driver_earning_title')}
      columns={columns}
      style={{
        direction: isRTL === "rtl" ? "rtl" : "ltr",
        borderRadius: "8px",
        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        padding: "20px",
      }}
      data={data}
      
      onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 15, 20],
        exportButton: true,
        rowStyle: rowData => ({
          backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF',
        border: "1px solid rgba(224, 224, 224, 1)",
        }),
        editable:{
          backgroundColor: colors.Header_Text,
          fontSize: "0.8em",
          fontWeight: 'bold ',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        headerStyle: {
          position: "sticky",
          top: "0px",
          fontSize: "0.8em",
          fontWeight: 'bold ',
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
        toolbar: {
          searchPlaceholder: (t('search')),
          exportTitle: (t('export')),
        },
        pagination: {
          labelDisplayedRows: ('{from}-{to} '+ (t('of'))+ ' {count}'),
          firstTooltip: (t('first_page_tooltip')),
          previousTooltip: (t('previous_page_tooltip')),
          nextTooltip: (t('next_page_tooltip')),
          lastTooltip: (t('last_page_tooltip'))
        },
      }}
      
    />
  );
}
