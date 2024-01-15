// Form.js
import 'antd/dist/reset.css';
import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Input, Button, message } from 'antd';
import './Form.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import SubmittedForms from '../pages/SubmittedForms'; 

const firebaseConfig = {
  apiKey: "AIzaSyCcGiLbCHkIe8DJu9MntX1c-lz0832EzjI",
  authDomain: "assignmentproguptaji.firebaseapp.com",
  projectId: "assignmentproguptaji",
  storageBucket: "assignmentproguptaji.appspot.com",
  messagingSenderId: "201915932982",
  appId: "1:201915932982:web:0de5c48097fdf598a69397"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MyForm = () => {
const [form] = Form.useForm();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [dob, setDob] = useState(null);
const [phoneNumber, setPhoneNumber] = useState('');
const [loading, setLoading] = useState(false);
const [lastOtpRequestTime, setLastOtpRequestTime] = useState(null);
const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

const handleSendOTP = async () => {
  try {
    // Check if enough time has passed since the last OTP request
    if (lastOtpRequestTime && Date.now() - lastOtpRequestTime < 6000) {
      message.error('Please wait before sending another OTP.');
      return;
    }
    setLoading(true);
    setLastOtpRequestTime(Date.now());

    const recaptchaContainer = document.getElementById('recaptcha-container');
    const appVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
      size: 'invisible',
    });

    const confirmationResult = await firebase.auth().signInWithPhoneNumber(`+91${phoneNumber}`, appVerifier);
    const code = window.prompt('Enter OTP sent to your phone');

    if (code) {
      const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      await firebase.auth().signInWithCredential(credential);
      message.success('Phone number verified successfully!');

      try {
        const response = await fetch('http://192.46.208.104:5000/api/formsubmission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, dob, phoneNumber: `+91${phoneNumber}` }),
        });
        if (response.ok) {
          message.success('Form submitted successfully!');
          setName('');
          setEmail('');
          setDob(null);
          setPhoneNumber('');
          // Reset the form fields
          form.resetFields();
          // Set the form as submitted
          setIsFormSubmitted(true);
        } else {
          message.error('Failed to submit form. Please try again. Checking point 1');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        message.error('An error occurred. Please try again.');
      }
    } else {
      message.error('Failed to verify OTP. Please try again.');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
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
  <>
    {!isFormSubmitted ? (
      <Form className="form-container" onFinish={handleSendOTP} form={form}>
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
          <div id="recaptcha-container"></div>
          <Button className="submit-button" type="primary" htmlType="submit" loading={loading}>
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <div className='form-item'>
        <SubmittedForms />
      </div>
    )}
  </>
);
};

export default MyForm;