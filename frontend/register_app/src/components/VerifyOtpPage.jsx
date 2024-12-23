import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../utils/AxiosInstance';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const {userId} = location.state
    const token =  localStorage.getItem('token') || '';
  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) { 
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      console.log('OTP Submitted:', otp);
      try {
        if (token) {
           
        const response = await API.post('/api/users/verifyotp',{userId:userId,otp:otp},{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        })
        console.log(response)
        alert('OTP Verified Successfully!');
        navigate('/private')
        setError('');
    }
      } catch (error) {
        if (error.status == 403) {
            localStorage.removeItem("token");
            alert('Session timedout, please login!');;
            navigate("/register");
            return;
          }
        console.error(error.message)
      }
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="otp">Enter OTP</label><br />
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleChange}
            maxLength="6"
            style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '5px' }}
          />
          {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
        </div>

        <button type="submit" style={{ padding: '10px 15px', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
