const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

io.on('connection', socket => {
    let room = '';

    // socket.on('get_chat', room => {
    //     console.log(room);
    // })

    socket.on('join', chatId => {
        room = chatId;
        console.log(chatId);
        socket.join(chatId);
    });

    socket.on('send_message', message => {
      io.to(room).emit('get_message', message);
    });

    // Обработчик отключения клиента
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 8082;
    server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


const os = require('os');
const { networkInterfaces } = os;

// Get a list of network interfaces
const interfaces = networkInterfaces();

// Filter for IPv4 addresses
const ipv4Addresses = {};

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipv4Addresses[name] = iface.address;
    }
  }
}

console.log(ipv4Addresses);
