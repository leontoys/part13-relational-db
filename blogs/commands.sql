CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
('Quincy Larson', 'https://www.freecodecamp.org/news/podcast-biggest-youtube-programming-channel-beau-carnes/', 'Podcast: Running the Biggest Programming Channel on YouTube with freeCodeCamp''s Beau Carnes', 100);
INSERT INTO blogs (author, url, title, likes) VALUES
('Beau Carnes', 'https://www.freecodecamp.org/news/learn-react-and-tailwind-css-for-front-end-development/', 'Learn React and Tailwind CSS for Front End Development', 50);
