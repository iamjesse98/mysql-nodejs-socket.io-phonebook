const mysql = require('mysql')
// This will allow us to run socket.io on port 4000
const client = require('socket.io').listen(4000).sockets

// connection.connect()

// connection.query("INSERT INTO numbers(person_id,number) VALUES(25, 9090909090)")

// connection.query("SELECT users.name, numbers.number FROM users INNER JOIN numbers ON users.id=numbers.person_id")

// connection.query("CREATE DATABASE phone_book", () => console.log('created'))

// connection.query("CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))", () => console.log('user table created'))

// connection.query("CREATE TABLE numbers (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, person_id INT NOT NULL, number INT NOT NULL, FOREIGN KEY(person_id) REFERENCES users(id))", () => console.log('number table created'))

// connection.query("SELECT * FROM users WHERE id=2", (err, res) => {
//     console.log(res)
// })

// Connect to Socket.io
client.on('connection', socket => {
    const connection = mysql.createConnection({
        host: 'iamjesse',
        user: 'jesse',
        password: 'loveispatientandkind',
        database: 'phone_book'
    })

    connection.connect()

    connection.query("SELECT * FROM users", (err, res) => {
        socket.emit('userslist', res)
        // console.log(res)
    })
    socket.on('insert_number', data => {
        const connection = mysql.createConnection({
            host: 'iamjesse',
            user: 'jesse',
            password: 'loveispatientandkind',
            database: 'phone_book'
        })
        // console.log(data.user, data.number)
        if(data.user >= 25)connection.query(`INSERT INTO numbers(person_id,number) VALUES(${data.user}, ${Number(data.number)})`, (err, res) => console.log(res))
    })
    socket.on('insert_user', function(data) {
        const connection = mysql.createConnection({
            host: 'iamjesse',
            user: 'jesse',
            password: 'loveispatientandkind',
            database: 'phone_book'
        })
        // console.log("INSERT INTO users(name) VALUES(\"" + data.name + "\")")
        connection.query("INSERT INTO users(name) VALUES(\"" + data.name + "\")", (err, res) => console.log(res))
        connection.query("SELECT * FROM users", (err, res) => {
            socket.emit('userslist', res)
            // console.log(res)
        })
    })

    socket.on('find', data => {
        const connection = mysql.createConnection({
            host: 'iamjesse',
            user: 'jesse',
            password: 'loveispatientandkind',
            database: 'phone_book'
        })
        // console.log(data.target)
        connection.query(`SELECT number FROM numbers WHERE number=${data.target}`, (err, num) => {
            // console.log()
            if (Array.from(num).length === 0) {
                socket.emit('result', [{ name: 'not found' }])
            } else {
                connection.query(`SELECT numbers.person_id FROM numbers WHERE number=${data.target}`, (err, pid) => {
                    // if(err) console.log('oh no!!')
                    // console.log(pid[0].person_id)
                    connection.query(`SELECT users.name FROM users WHERE id=${pid[0].person_id}`, (err, res) => {
                        // if(err) console.log('oh no!!')
                        socket.emit('result', res)
                    })
                })
            }
        })
    })

    socket.on('getnums', data => {
        const connection = mysql.createConnection({
            host: 'iamjesse',
            user: 'jesse',
            password: 'loveispatientandkind',
            database: 'phone_book'
        })
        // console.log(data.target)
        connection.query(`SELECT id FROM users WHERE name="${data.name}"`, (err, num) => {
            // console.log()
            if (Array.from(num).length === 0) {
                socket.emit('numsre', [{ numbers: 'not found' }])
            } else {
                connection.query(`SELECT users.id FROM users WHERE name="${data.name}"`, (err, pid) => {
                    // if(err) console.log('oh no!!')
                    // console.log(pid[0].person_id)
                    connection.query(`SELECT numbers.number FROM numbers WHERE person_id=${pid[0].id}`, (err, res) => {
                        // if(err) console.log('oh no!!')
                        // socket.emit('result', res)
                        // console.log(res)
                        socket.emit('numsre', [ { numbers: res } ])
                    })
                })
            }
        })
    })

    connection.end()
})