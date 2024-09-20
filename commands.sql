CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('John Smith', 'http://example.com/JohnBlog', 'JohnBlog', 5),
       ('Rachel Doe', 'http://example.com/RachelBlog', 'RachelBlog', 10);
