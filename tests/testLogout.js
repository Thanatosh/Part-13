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
    throw new Error("Login failed");
  }
};

const logout = async (token) => {
  try {
    const response = await axios.delete('http://localhost:3001/api/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Logout response:", response.data);
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }
};

const main = async () => {
  try {
    const token = await login();
    if (token) {
      await logout(token);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

main();
