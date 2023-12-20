import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';
import {colors} from '../components/Theme/WebTheme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  dateTimePickerInput: {
    '& .MuiOutlinedInput-input': {
      color:MAIN_COLOR, 
    },
  },
}));
export default function Promos() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editPromo
  } = api;
  const settings = useSelector(state => state.settingsdata.settings);

  const inputRef = useRef(null);

  const columns = [
    { title: t('promo_name'), field: 'promo_name',
  },
  {
    title: t('promo_code_web'), field: 'promo_code'
  },
    { title: t('description'), field: 'promo_description',
  },
    {
      title: t('type'),
      field: 'promo_discount_type',
      lookup: { flat: t('flat'), percentage: t('percentage')},
    },
    { title: t('promo_discount_value'), field: 'promo_discount_value', type: 'numeric',
  },
    { title: t('max_limit'), field: 'max_promo_discount_value', type: 'numeric',
  },
    { title: t('min_limit'), field: 'min_order', type: 'numeric',
  },
    { title: t('end_date'), field: 'promo_validity',  
    editComponent: props => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          inputRef={inputRef}
          renderInput={(props) => <TextField {...props} variant='outlined' className={classes.dateTimePickerInput} />}
          label="DateTimePicker"
          value={props.rowData.promo_validity ? props.rowData.promo_validity : new Date()}
          onChange={(newValue) => {
            props.onChange(newValue)
          }}
          autoFocus={false}
        />
      </LocalizationProvider>
    ),
    render: rowData => rowData.promo_validity?moment(rowData.promo_validity).format('lll'):null,
  },
    { title: t('promo_usage'), field: 'promo_usage_limit', type: 'numeric',
  },
  { title: t('show_in_list'),  field: 'promo_show', type:'boolean'
  },
    { title: t('promo_used_by'), field: 'user_avail', editable: 'never',
  }
  ];

  const [data, setData] = useState([]);
  const promodata = useSelector(state => state.promodata);
  const dispatch = useDispatch();
  const [sortedData, SetSortedData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (promodata.promos) {
      setData(promodata.promos);
    } else {
      setData([]);
    }
  }, [promodata.promos]);

  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data])

  const [selectedRow, setSelectedRow] = useState(null);
  return (
    promodata.loading ? <CircularLoading /> :
    <MaterialTable
      title={t('promo_offer_title')}
      columns={columns}
      style={{
        direction: isRTL === "rtl" ? "rtl" : "ltr",
        borderRadius: "8px",
        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        padding: "20px",
      }}
      data={sortedData}
     
      onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 15, 20],
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
      localization={{body:{
        addTooltip: (t('add')),
        deleteTooltip: (t('delete')),
        editTooltip: (t('edit')),
        emptyDataSourceMessage: (
          (t('blank_message'))
      ),
      editRow: { 
        deleteText: (t('delete_message')),
        cancelTooltip: (t('cancel')),
        saveTooltip: (t('save')) 
        }, 
        },
        toolbar: {
          searchPlaceholder: (t('search')),
          exportTitle: (t('export')),
        },
        header: {
          actions: (t('actions')) 
      },
      pagination: {
        labelDisplayedRows: ('{from}-{to} '+ (t('of'))+ ' {count}'),
        firstTooltip: (t('first_page_tooltip')),
        previousTooltip: (t('previous_page_tooltip')),
        nextTooltip: (t('next_page_tooltip')),
        lastTooltip: (t('last_page_tooltip'))
      },
      }}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if(!(newData.promo_name && newData.promo_code && newData.promo_description && newData.promo_discount_value && newData.promo_discount_type && newData.promo_discount_value && newData.max_promo_discount_value && newData.min_order && newData.promo_usage_limit && (newData.min_order >= newData.max_promo_discount_value) && (newData.promo_discount_value>=newData.max_promo_discount_value))){
                alert(t('no_details_error'));
                reject();
              }else{
                newData['promo_code'] = newData.promo_code.toUpperCase();
                newData['promo_show'] = newData.promo_show ? true : false;
                newData['createdAt'] = new Date().getTime();
                newData['promo_validity'] = newData.promo_validity? new Date(newData.promo_validity).getTime() : null;
                dispatch(editPromo(newData,"Add"));
                resolve();
              }
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          settings.AllowCriticalEditsAdmin?
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if(!(newData.promo_name && newData.promo_code &&  newData.promo_description && newData.promo_discount_value && newData.promo_discount_type && newData.promo_discount_value && newData.max_promo_discount_value && newData.min_order && newData.promo_usage_limit && (newData.min_order >= newData.max_promo_discount_value) && (newData.promo_discount_value>=newData.max_promo_discount_value))){
                alert(t('no_details_error'));
                reject();
              }else{
                resolve();
                newData['promo_code'] = newData.promo_code.toUpperCase();
                newData['promo_show'] = newData.promo_show ? true : false;
                newData['promo_validity'] = newData.promo_validity? new Date(newData.promo_validity).getTime(): null;
                if(newData !== oldData){
                  delete newData.tableData;
                  dispatch(editPromo(newData,"Update"));
                }
              }
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(t('demo_mode'));
            }, 600);
          }),
        onRowDelete: oldData =>
          settings.AllowCriticalEditsAdmin?
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editPromo(oldData,"Delete"));
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(t('demo_mode'));
            }, 600);
          })
      }}
    />
  );
}
