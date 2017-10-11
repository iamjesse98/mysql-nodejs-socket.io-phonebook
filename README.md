# mysql-nodejs-socket.io-phonebook
Real Time Phone Book Implemented in mysql, node.js, socket.io

*To setup and run*
```
git clone https://github.com/iamjesse98/mysql-nodejs-socket.io-phonebook.git
cd mysql-nodejs-socket.io-phonebook
npm install -g nodemon
npm install
npm start
```

**To setup database**
```
CREATE DATABASE phone_book
CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))
CREATE TABLE numbers (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, person_id INT NOT NULL, number INT NOT NULL, FOREIGN KEY(person_id) REFERENCES users(id))
```

- edit `server.js` with your credentials.
- open `index.html` in a browser.