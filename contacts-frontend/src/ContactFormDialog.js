import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const ContactFormDialog = ({ open, contact, onClose }) => {
    const [state, setState] = useState({});
    const [error, setError] = useState(false);
    useEffect(() => {
      setState({...contact});
      setError(false);
    }, [contact]); // eslint-disable-line react-hooks/exhaustive-deps
    const handleChange = (name, event) => {
        state[name] = event.target.value;
        setState({...state});
        if(name === 'name'){
            setError(!state[name]);
        }
    };
    const handleSave = () => {
        if(state.name){
            onClose(true, state);
        }else{
            setError(true);
        }
    }
    return (
        <div>
        <Dialog
          open={open}
          onClose={() => {onClose(false)}}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Contact</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={error ? 'Name is required': 'Full name'}
              value={state.name || ''}
              error={error}
              onChange={(event) => handleChange('name', event)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="phone"
              label="Phone"
              type="phone"
              value={state.phone || ''}
              onChange={(event) => handleChange('phone', event)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              value={state.email || ''}
              onChange={(event) => handleChange('email', event)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="address"
              label="Address"
              multiline
              rows="4"
              value={state.address || ''}
              onChange={(event) => handleChange('address', event)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {onClose(false)}} color="primary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  export default ContactFormDialog;