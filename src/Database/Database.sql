use gestion_file;

select * from user;

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

ALTER TABLE files
ADD COLUMN category_id INT,
ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id);

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    cedula VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CHECK (cedula REGEXP '^[0-9]+$')
);

ALTER TABLE user
CHANGE COLUMN email username VARCHAR(255) NOT NULL UNIQUE;

ALTER TABLE user
ADD COLUMN security_answer1 VARCHAR(255),
ADD COLUMN security_answer2 VARCHAR(255),
ADD COLUMN security_answer3 VARCHAR(255);
ALTER TABLE user
ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user';

CREATE TABLE security_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  question VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);