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

import DateTimePicker from 'react-datetime-picker';

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
    { title: 'Time', field: 'time', initialEditValue: 'initial edit value' },
    { title: "ID", field: "id" }
  ]);
  const [data, setData] = useState([
    { name: 'Mehmet', time: 'Baran', id: 1987 },
    { name: 'Zerya Betül', time: 'Baran', id: 2017 }
  ])
  const defaultMaterialTheme = createTheme()


  function handleAddActivity() {
    if (newActivityText.trim() !== "") {
      setActivities([...activities, newActivityText]);
      setNewActivityText("");
    }
  }

  function get() {
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
  }

  function handleDeleteActivity(index) {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  }

  function handleEditActivity(index) {
    setEditingIndex(index);
    setEditedActivityText(activities[index]); // Set the input text to the current activity
  }

  function handleSaveActivity(index) {
    if (editedActivityText.trim() !== "") { // Use editedActivityText, not newActivityText
      const updatedActivities = [...activities];
      updatedActivities[index] = editedActivityText;
      setActivities(updatedActivities);
      setEditingIndex(null);
      setEditedActivityText(""); // Clear the edited text field
    }
  }

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
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setData([...data, newData]);
                    axios.post(
                      url,
                      {
                        name: newData.name,
                        when: newData.time,
                      },
                      {
                        headers: { Authorization: `Bearer ${cookies["token"]}` },
                        timeout: 10 * 1000,
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

              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    console.log()
                    //const dataUpdate = [...data];
                    //const index = oldData.tableData.id;
                    //dataUpdate[index] = newData;
                    //setData([...dataUpdate]); 
                    resolve();
                  }, 1000);
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    //const dataDelete = [...data];
                    //const index = oldData.tableData.id;
                    //dataDelete.splice(index, 1);
                    //setData([...dataDelete]);
                    resolve();
                  }, 1000);
                })

            }}
          />
        </ThemeProvider>
      </div>

    </div>
  );
}

export default Main;
