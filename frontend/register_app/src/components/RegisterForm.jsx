import React, { useState } from 'react';
import { API } from '../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    industry: '',
    name: '',
    mobile: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      try {
        const response = await API.post('/api/users/create',{...formData,verified:false})
        console.log(response)
        if(response.status == 201){
            localStorage.setItem('token',response.data.token)
            navigate('/verifyotp',{state:{userId:response.data.id}})
        }
      } catch (error) {
        console.error(error.message)
      }
      alert('Form submitted successfully!');
      setFormData({ industry: '', name: '', mobile: '', email: '' });
      setErrors({});
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Form</h2>
      <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
          <label htmlFor="industry">Industry</label><br />
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select an industry</option>
            <option value="insurance">Insurance</option>
            <option value="real-estate">Real Estate</option>
          </select>
          {errors.industry && <p style={{ color: 'red', fontSize: '12px' }}>{errors.industry}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Full Name</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="mobile">Mobile</label><br />
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.mobile && <p style={{ color: 'red', fontSize: '12px' }}>{errors.mobile}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        <button type="submit" style={{ padding: '10px 15px', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
