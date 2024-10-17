const axios = require('axios');

const createUser = async () => {
  const userData = {
    username: "JoHo@example.com",
    name: "Jo Ho",
    password: "salainen",
  };

  try {
    const response = await axios.post('http://localhost:3001/api/users', userData);
    console.log("User created successfully:", response.data);
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
  }
};

createUser();