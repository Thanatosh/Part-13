const axios = require('axios');

const disableUser = async (userId, token) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/users/${userId}/disable`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error disabling user:", error.response?.data || error.message);
  }
};

disableUser(1, '');