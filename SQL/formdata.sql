CREATE DATABASE formdata;

USE formdata;

CREATE TABLE registerForm (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(250) NOT NULL,
	lastname VARCHAR(250) NOT NULL,
	email VARCHAR(250) NOT NULL,
	password VARCHAR(250) NOT NULL,
	phonenumber VARCHAR(10) NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- SELECT * FROM tasks;

-- DROP TABLE tasks;
