import 'antd/dist/reset.css';
import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Input, Button, message } from 'antd';
import './Form.css';

const MyForm = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [dob, setDob] = useState(null);
const [phoneNumber, setPhoneNumber] = useState('');
const [loading, setLoading] = useState(false);

const handleDateChange = (date) => {
  setDob(date);
};

const validateDateOfBirth = (rule, value) => {
  return new Promise((resolve, reject) => {
    if (value) {
      const today = new Date();
      const birthDate = new Date(value._d || value);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        if (age < 18) {
          reject('Age must be at least 18 years old.');
        }
      } else {
        if (age - 1 < 18) {
          reject('Age must be at least 18 years old.');
        }
      }
    }
    resolve();
  });
};

const handleSubmit = async () => {
  if (!name || !email || !dob || !phoneNumber) {
    message.error('Please fill out all fields');
    return;
  }

  try {
    setLoading(true);

    const response = await fetch('http://localhost:5000/api/verification/verify-phone-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, dob, phoneNumber: `+91${phoneNumber}` }),
    });

    if (response.ok) {
      message.success('Form submitted successfully!');
      // Optionally, you can reset the form fields after successful submission
      setName('');
      setEmail('');
      setDob(null);
      setPhoneNumber('');
    } else {
      message.error('Failed to submit form. Please try again. Checking point 1');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    message.error('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  // Cleanup the loading state when the component unmounts
  return () => setLoading(false);
}, []);

return (
  <Form className="form-container" onFinish={handleSubmit}>
    <Form.Item className="form-item" label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
      <Input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
    </Form.Item>
    <Form.Item className="form-item" label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
      <Input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
    </Form.Item>
    <Form.Item className="form-item" label="Date of Birth" name="dob" rules={[{ required: true, message: 'Please select your date of birth!' }, { validator: validateDateOfBirth }]}>
      <DatePicker className="date-picker" onChange={handleDateChange} />
    </Form.Item>
    <Form.Item className="form-item" label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Please input your phone number!' }]}>
      <Input className="input-field" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
    </Form.Item>
    <Form.Item className="form-item">
      <Button className="submit-button" type="primary" htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form.Item>
  </Form>
);
};

export default MyForm;
