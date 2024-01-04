import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmittedForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // Fetch and set submitted forms
    axios.get('/api/forms')
      .then(response => setForms(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Submitted Forms</h2>
      <ul>
        {forms.map(form => (
          <li key={form._id}>
            <p>Name: {form.name}</p>
            <p>Email: {form.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmittedForms;
