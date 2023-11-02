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

function Main() {
  const url = 'http://localhost:5101/activities'

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
    { title: 'Name', field: 'name' },
    {
      title: "Time",
      field: "time",
      render: (rowData) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="activity time"
            value={dayjs(rowData.time)}
            onChange={(newTime) => handleDateTimeChange(rowData, newTime)}
            rowData={rowData}
          />
        </LocalizationProvider>
      ),
      editComponent: ({ value, onChange }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="new activity time"
            value={dayjs(value)} // Ensure you are using the correct property
            onChange={onChange}
          />
        </LocalizationProvider>
      ),
    },
    { title: "ID", field: "id" }
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


  useEffect(() => {
    console.log("cookies" + cookies['token'])
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
  }, [])

  return (
    <div id='outer-container'>

      <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div id='page-wrap' style={{ width: '80%', height: '100%' }}>
        <ThemeProvider theme={defaultMaterialTheme}>
          <MaterialTable
            icons={tableIcons}
            title="Test Table"
            columns={columns}
            data={data}
            editable={{
              //isEditable: rowData => rowData.name === 'Mehmet', // only name(a) rows would be editable
              isEditHidden: rowData => rowData.name === 'x',
              //isDeletable: rowData => rowData.name === 'b', // only name(b) rows would be deletable,
              isDeleteHidden: rowData => rowData.name === 'y',
              onBulkUpdate: changes =>
                new Promise((resolve, reject) => {
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
              onRowAddCancelled: rowData => console.log('Row adding cancelled'),
              onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),

              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  // Simulate a delay with setTimeout
                  setTimeout(() => {
                    // Send a POST request to add new data
                    axios.post(
                        url,
                        {
                          name: newData.name,
                          when: dayjs(newData.time),
                        },
                        {
                          headers: { Authorization: `Bearer ${cookies['token']}` },
                          timeout: 10 * 1000,
                        }
                      )
                      .then((response) => {
                        const newId = response.data.id; // Extract the ID from the response
                        console.log("Post complete, new ID: " + newId);

                        newData.id = newId
                        newData.time = newData.time
                        setData([...data, newData]);
                        resolve();
                      })
                      .catch((error) => {
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
                    // Send a PUT request to update the data
                    axios
                      .put(`${url}/${newData.id}`, newData, {
                        headers: { Authorization: `Bearer ${cookies['token']}` },
                        timeout: 10 * 1000,
                      })
                      .then((response) => {
                        console.log('complete update');

                        // If the PUT request is successful, update the data state with the edited data
                        const dataUpdate = [...data];
                        const index = dataUpdate.findIndex((item) => item.id === newData.id);
                        if (index !== -1) {
                          dataUpdate[index] = newData;
                          setData(dataUpdate);
                        }

                        resolve();
                      })
                      .catch((error) => {
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
                      console.log(error.code);
                      reject();
                    });
                })


            }
            }
          />
        </ThemeProvider>
      </div>

    </div>
  );
}

export default Main;