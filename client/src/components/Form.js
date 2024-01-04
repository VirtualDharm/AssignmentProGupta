import 'antd/dist/reset.css';
import React, { useState } from 'react';
import { DatePicker, Form, Input, Button, message } from 'antd';

const MyForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);

  const handleDateChange = (date) => {
    setDob(date);
  };

  const validateDateOfBirth = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value) {
        const today = new Date();
        const birthDate = new Date(value._d || value); // Access value._d for moment objects
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
      resolve();//callbacks are deprecated
    });
  };

  const handleSubmit = () => {
    if (!name || !email || !dob) {
      message.error('Please fill out all fields');
    } else {
      message.success('Form submitted successfully!');
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: 'Please select your date of birth!' }, { validator: validateDateOfBirth }]}>
        <DatePicker onChange={handleDateChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
