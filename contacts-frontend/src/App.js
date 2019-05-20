import React, { useEffect, useState } from 'react';
import './App.css';
import 'typeface-roboto';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useContactState from './useContactState';
import ContactList from './ContactList';
import ContactFormDialog from './ContactFormDialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';

const restServerUrl = "http://localhost:8000";
function App() {
  const {contacts, setContacts, addContact, updateContact, setSelected, deleteContacts} = useContactState([]);
  const [modal, setModal] = useState({open: false, value: {}});
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        `${restServerUrl}/api/contacts`,
      );
      setContacts(result.data);
    }
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleOpenModal = (value = {}) => {
    setModal({open: true, value});
  }
  const handleCloseModal = async (save, value = {}) => {
    setModal({...modal, open: false});
    if(save){
      try{
        if(!value.id){ // new
          const result = await axios.post(`${restServerUrl}/api/contacts/`, value);
          addContact(result.data);
        }else{ // update
          const result = await axios.put(`${restServerUrl}/api/contacts/${value.id}/`, value);
          updateContact(result.data);
        }
      }catch(err){
        console.log(err);
      }
    }
  }
  const deleteSelected = (lists) => {
    const promises = lists.map(async (n) => {
      return axios.delete(`${restServerUrl}/api/contacts/${n.id}/`);
    });
    Promise.all(promises).then(res => {
      const delIds = lists.map(n => {
        return n.id;
      });
      deleteContacts(delIds);
    });
  }
  const theme = createMuiTheme({
    palette: {
      type: 'light',
    },
    typography: {
      useNextVariants: true,
    }
  });
  const selectedContacts = contacts.filter(({selected}) => !!selected);
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
          Address Book
          </Typography>
        </Toolbar>
      </AppBar>
      <ContactList contacts={contacts} openContactModal={handleOpenModal} setSelected={setSelected}/>
      <ContactFormDialog open={modal.open} contact={modal.value} onClose={handleCloseModal}/>
      {
        selectedContacts.length > 0 ?
          <Toolbar variant="regular">
          <div>
            <Typography color="inherit" variant="subtitle1">
                {selectedContacts.length} selected
              </Typography>
          </div>
          <div>
              <Tooltip title="Delete">
                <IconButton aria-label="Delete" onClick={() => {deleteSelected(selectedContacts)}} color="secondary">
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
          </div>
        </Toolbar>
        : null
      }
      <Button variant="contained" onClick={() => {handleOpenModal()}} color="primary">+Add</Button>
    </div>
    </MuiThemeProvider>
  );
}

export default App;
