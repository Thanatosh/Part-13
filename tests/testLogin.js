const axios = require('axios');

const login = async () => {
  const loginData = {
    username: "JoHo@example.com",
    password: "salainen",
  };

  try {
    const response = await axios.post('http://localhost:3001/api/login', loginData);
    console.log("Logged in successfully, token:", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
  }
};

login();
