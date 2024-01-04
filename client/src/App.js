import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyForm from './components/Form';
import SubmittedForms from './pages/SubmittedForms';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/submitted-forms" element={<SubmittedForms />} />
          <Route path="/" element={<MyForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
