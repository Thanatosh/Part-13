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

const createBlog = async (token) => {
  const blogData = {
    title: "Blogi",
    author: "Author III",
    url: "https://example.com/blog",
    likes: 0,
    year: 2015,
  };

  try {
    const response = await axios.post('http://localhost:3001/api/blogs', blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Blog created successfully:", response.data);
  } catch (error) {
    console.error("Error creating blog:", error.response?.data || error.message);
  }
};

const main = async () => {
  try {
    const token = await login();
    if (token) {
      await createBlog(token);
    }
  } catch (error) {
    console.error("An error occurred during the blog creation process:", error.message);
  }
};

main();
