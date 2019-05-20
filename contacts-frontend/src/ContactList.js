import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const ContactList = ({ contacts, setSelected, openContactModal}) => {
    const handleCheckedChange = (n, event) => {
        setSelected(n, event.target.checked);
    };
    return (
        <Table aria-labelledby="tableTitle">
            <TableBody>
                {contacts.map(n => {
                    return (
                    <TableRow
                        hover
                        onClick={() => openContactModal(n)}
                        role="checkbox"
                        aria-checked={n.selected}
                        tabIndex={-1}
                        key={n.id}
                        selected={n.selected}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox 
                                onClick={e => e.stopPropagation()} 
                                onChange={(event) => handleCheckedChange(n, event)}
                                checked={n.selected || false}
                                value="selected"/>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">{n.name}</TableCell>
                        <TableCell>{n.phone}</TableCell>
                        <TableCell>{n.email}</TableCell>
                        <TableCell>{n.address}</TableCell>
                    </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
  
export default ContactList;