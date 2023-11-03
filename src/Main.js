import React, { useEffect, useState } from "react";
import SideBar from "./Sidebar";

import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

import axios from "axios";
import { Http } from "@material-ui/icons";
import { useCookies } from 'react-cookie';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import format from "date-fns/format";
import parse from "date-fns/parse";
import dayjs from 'dayjs';

import 'dayjs/plugin/calendar'; // Import the calendar plugin
import 'dayjs/locale/th';

import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import MuiAlert from '@mui/material/Alert';

import { Navigate, useNavigate } from "react-router-dom";

function Main() {
  const url = 'http://localhost:5101/activities'
  dayjs.locale('th');

  let navigate = useNavigate()

  const [activities, setActivities] = useState([]);
  const [newActivityText, setNewActivityText] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedActivityText, setEditedActivityText] = useState(""); // New state for edited text
  const [cookies] = useCookies(['token']);

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  }
  const [columns, setColumns] = useState([
    { title: 'กิจกรรม', field: 'name' },
    {
      title: "วันเวลา",
      field: "time",
      render: (rowData) => {
        // Convert the ISO 8601 time to a Thai-formatted string
        const thaiFormattedTime = dayjs(rowData.time).locale("th").format("D MMM YYYY เวลา HH:mm น.");
        return thaiFormattedTime;
      },
      editComponent: ({ value, onChange }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="new activity time"
            value={dayjs(value)}
            onChange={onChange}
            format="D MMM YYYY เวลา HH:mm น."
          />
        </LocalizationProvider>
      ),
    },
    { title: "ID", field: "id" , hidden: true}
  ]);
  const [data, setData] = useState([
    /*
    { name: 'Mehmet', time: 'Baran', id: 1987 },
    { name: 'Zerya Betül', time: 'Baran', id: 2017 }
    */
  ])
  const defaultMaterialTheme = createTheme()

  const handleDateTimeChange = (rowData, newTime) => {
    // Create a new array with the updated time for the edited row
    const updatedData = data.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, time: newTime.toISOString() };
      }
      return row;
    });

    // Update the data state with the new array
    setData(updatedData);
  };

  function parseDate(item) {
    console.log("item: " + item);
    let parsedDate;
    try {
      const [datePart, timePart] = item.split(' ');
      const [day, month, year] = datePart.split('/'); // Adjust the format to match "day/month/year"
      const [hour, minute, second] = timePart.split(':');
      const isoFormattedTime = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
      console.log("iso " + isoFormattedTime);

      const customFormat = 'YY/MM/DD H:m:ss';

      // Create dayjs object from dateString parsing it using the provided format
      parsedDate = dayjs(isoFormattedTime, customFormat);
    } catch (e) {
      console.error("Error parsing date:", e);
      // Handle the error here, for example:
      parsedDate = dayjs(); // Set to the current date if parsing fails
    }
    return parsedDate;
  }

  useEffect(() => {
    console.log("cookies['token'] != null :" + cookies['token'] != null)
    console.log("cookies['token'] :" + cookies['token'])
    if (cookies['token'] == undefined || !cookies['token']) {
      SnackbarEvent('error', 'please Login');
      setTimeout(() => {
        navigate('/login');
      },3000)
      ;
      return ; // You can also display a loading spinner or message here
    }

    SnackbarEvent('info', 'load complete');
    console.log("cookies" + cookies['token']);
    console.log("use effect");
    axios.get(
      url,
      {
        headers: { Authorization: `Bearer ${cookies['token']}` },
        timeout: 10 * 1000
      }
    ).then((response) => {
      const parsedTimes = response.data.map((item) => {
        const parsedTime = parseDate(item.time);
        console.log("fixed time " + parsedTime);
        return { ...item, time: parsedTime };
      });
      console.log(parsedTimes); // Check the parsed times
      setData(parsedTimes); // Update the data state with the parsed times
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.log("Request was canceled:", error.message);
      } else {
        console.error("An error occurred:", error.message);
      }
      console.log(error.code)
    });
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const SnackbarEvent = (severity, text) => {
    setOpen(true);
    setSnackbarData({ severity, text });
  };

  const [snackbarData, setSnackbarData] = React.useState({
    severity: 'success',
    text: 'This is a success message!',
  });

  const tableOptions = {
    headerStyle: {
      
      color: '#333', // Specify your text color
      // Add your custom CSS class for the Kanit font
      fontFamily: "'Kanit', sans-serif", // Use the Kanit font
    },
  };


  return (
    <div id='outer-container'>

      <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div id='page-wrap' style={{ width: '90%', height: '100%' }}>
        <ThemeProvider theme={defaultMaterialTheme}>
          <MaterialTable
            icons={tableIcons}
            title="Test Table"
            columns={columns}
            data={data}
            options={tableOptions}
            editable={{
              //isEditable: rowData => rowData.name === 'Mehmet', // only name(a) rows would be editable
              isEditHidden: rowData => rowData.name === 'x',
              //isDeletable: rowData => rowData.name === 'b', // only name(b) rows would be deletable,
              isDeleteHidden: rowData => rowData.name === 'y',
              onBulkUpdate: changes =>
                new Promise((resolve, reject) => {
                  console.log('on bulk')
                  setTimeout(() => {
                    axios.get(
                      url,
                      {
                        headers: { Authorization: `Bearer ${cookies['token']}` }
                        , timeout: 10 * 1000
                      }
                    ).then((response) => {
                      setData(response.data)
                    }).catch((error) => {
                      if (error.code === "ECONNABORTED") {
                        console.log("time out")
                      } else {
                        console.log(error.response)
                      }
                    })
                    resolve();
                  }, 1000);
                }),
              onRowAddCancelled: rowData => { console.log('Row adding cancelled') },
              onRowUpdateCancelled: rowData => {
                SnackbarEvent('warning', 'cancel update');
                console.log('Row editing cancelled')
              },

              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  // Simulate a delay with setTimeout
                  setTimeout(() => {
                    // Format the time to ISO 8601 format
                    const isoFormattedTime = dayjs(newData.time).format("YYYY-MM-DDTHH:mm:ss.SSS");
                    console.log("time :" + isoFormattedTime)

                    // Send a POST request to add new data
                    axios.post(
                      url,
                      {
                        name: newData.name,
                        when: isoFormattedTime,
                      },
                      {
                        headers: { Authorization: `Bearer ${cookies['token']}` },
                        timeout: 10 * 1000,
                      }
                    )
                      .then((response) => {
                        const newId = response.data.id; // Extract the ID from the response
                        console.log("Post complete, new ID: " + newId);
                        SnackbarEvent('success', 'row add complete');

                        // Update the data with the new ID and corrected time
                        newData.id = newId;
                        newData.time = isoFormattedTime; // Use the ISO 8601 formatted time
                        setData([...data, newData]);
                        resolve();
                      })
                      .catch((error) => {
                        SnackbarEvent('error', 'row add failed');
                        if (error.code === "ECONNABORTED") {
                          console.log("Time out");
                        } else {
                          console.log(error.response);
                        }
                        reject();
                      });
                  }, 1000); // Adjust the delay time (in milliseconds) as needed
                })

              ,

              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    // Store the current locale
                    const currentLocale = dayjs.locale();

                    // Set the locale to 'th' for Thai
                    dayjs.locale('th');

                    // Format the time to both ISO and Thai formats
                    const isoFormattedTime = dayjs(newData.time).format("YYYY-MM-DDTHH:mm:ss.SSS");
                    const thaiFormattedTime = dayjs(newData.time).format("D MMM YYYY เวลา HH:mm น.");

                    // Set the locale back to the original one
                    dayjs.locale(currentLocale);

                    // Create a copy of newData with the corrected time
                    const updatedData = { ...newData, when: isoFormattedTime };
                    const updatedDataForDisplay = { ...newData, when: thaiFormattedTime };

                    // Send a PUT request to update the data
                    axios.put(`${url}/${newData.id}`, updatedData, {
                      headers: { Authorization: `Bearer ${cookies['token']}` },
                      timeout: 10 * 1000,
                    })
                      .then((response) => {
                        console.log('complete update');
                        SnackbarEvent('success', 'row edit complete');

                        // If the PUT request is successful, update the data state with the edited data
                        const dataUpdate = [...data];
                        const index = dataUpdate.findIndex((item) => item.id === newData.id);
                        if (index !== -1) {
                          dataUpdate[index] = updatedData; // Use the updated data with corrected time
                          setData(dataUpdate);
                        }
                        resolve();
                      })
                      .catch((error) => {
                        SnackbarEvent('error', 'row edit failed');
                        console.log(error.code);
                        reject();
                      });
                  }, 1000); // Set your desired timeout here
                })



              ,

              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  // Send a DELETE request to remove data
                  console.log("try to delete: " + oldData.id);
                  console.log('delete: ' + `${url}/${oldData.id}`);
                  axios
                    .delete(`${url}/${oldData.id}`, {
                      headers: { Authorization: `Bearer ${cookies['token']}` },
                      timeout: 1 * 1000,
                    })
                    .then((response) => {
                      console.log('complete: ' + response.code);
                      SnackbarEvent('success', 'row delete complete');

                      // If the DELETE request is successful, update the data state
                      const dataDelete = [...data];
                      const index = dataDelete.findIndex((item) => item.id === oldData.id);
                      if (index !== -1) {
                        dataDelete.splice(index, 1);
                        setData(dataDelete);
                      }

                      resolve();
                    })
                    .catch((error) => {
                      SnackbarEvent('error', 'row delete failed');
                      console.log(error.code);
                      reject();
                    });
                })


            }
            }
          />
        </ThemeProvider>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackbarData.severity} sx={{ width: '100%' }}>
            {snackbarData.text}
          </Alert>
        </Snackbar>
      </div>

    </div>
  );
}

export default Main;