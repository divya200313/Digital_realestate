const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Agent',
      email: 'agent@example.com',
      password: 'password123'
    });
    console.log('Registration Success:', res.data);
  } catch (err) {
    console.error('Registration Failed:', err.response ? err.response.data : err.message);
  }
}

testRegister();
