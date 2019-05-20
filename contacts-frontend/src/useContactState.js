import { useState } from 'react';

export default initialValue => {
  const [contacts, setContacts] = useState(initialValue);

  return {
    contacts,
    setContacts,
    addContact: contact => {
      setContacts([...contacts, contact]);
    },
    updateContact: contact => {
      const index = contacts.findIndex(({id}) => id === contact.id);
      if(~index){
        const update = contacts[index];
        const newContacts = [
          ...contacts.slice(0, index),
          {...contact, selected: update.selected},
          ...contacts.slice(index + 1)
        ];
        setContacts(newContacts);
      }
    },
    setSelected: (contact, selected) => {
      const index = contacts.findIndex(({id}) => id === contact.id);
      if(~index){
        const newContacts = [
          ...contacts.slice(0, index),
          {
            ...contact,
            selected
          },
          ...contacts.slice(index + 1)
        ];
        setContacts(newContacts);
      }
    },
    deleteContacts: (ids) => {
      const newContacts = contacts.filter(({id}) => !~ids.indexOf(id));
      setContacts(newContacts);
    }
  };
};