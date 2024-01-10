// SubmittedForms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmittedForms.css';

const SubmittedForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get('http://192.46.208.104:5000/api/forms')
      .then(response => setForms(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div style={{padding: 2 + 'em'}}>
      <h2>Submitted Forms</h2>
      <table className="forms-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Phone No</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form._id}>
              <td>{form.name}</td>
              <td>{form.email}</td>
              <td>{new Date(form.dob).toLocaleDateString()}</td>
              <td>{form.phoneNumber}</td>
              <td>{form.submissionTime ? new Date(form.submissionTime).toLocaleString() : '1-10-2023'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmittedForms;
