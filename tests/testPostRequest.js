const axios = require('axios');

const testPostBlog = async () => {
  const testData = {
    title: "Fourth Wall",
    author: "Radan",
    url: "http://test.com",
    year: 2018,
  };

  const token = '';

  try {
    const response = await axios.post('http://localhost:3001/api/blogs', testData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    console.log("Blog created successfully:", response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error creating blog:", error.response.data);
      if (error.response.data.error && error.response.data.error.errors) {
        error.response.data.error.errors.forEach(err => {
          console.error(`Validation error for ${err.path}: ${err.message}`);
        });
      }
    } else {
      console.error("Error creating blog:", error.message);
    }
  }
};

testPostBlog();
