const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const net = require('net');

// ********* CUSTOMIZE THESE SETTINGS TO FIT YOUR SETUP ************ //
const apiPort = 81;
const apiLogin = 'flashforge';
const apiPwd = 'finder';

const printerIP = '192.168.0.101'; // Remember to set your printer an fixed IP addr in your router to avoid problems!
const printerPort = 8899;
let printerData = [];

app.get('/requestData', (req, res, next) => {
	printerData = [];

	try {
		connectToPrinter();
	} finally {
		console.log(printerData)

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');

		// This is insane, I realize, but it works.
		// Better ideas? PR please. I'm a front-end dev learning back-end.
		res.send('[{"status":"' +
			printerData.join('"},\r\n{"status":"')
				.replace(/CMD/g, '')
				.replace(/ok/g, '')
				.replace(/Received./g, '')
				.replace(/\./g, '')
				.replace(/\r\n/g, '')
				.replace(/ M/g, 'M')
			+ '"}]'.trim());
	}
});

// This is a VERY basic login function, BY NO MEANS USE THIS AS A SILVER BULLET!
app.post('/login', (req, res) => {
	let reqUsername = req.body.username;
	let reqPwd = req.body.password;

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	if (reqUsername === apiLogin && reqPwd === apiPwd) {
		res.json('{"authorized":"true", "session":"' + new Date() + '"}')
	} else {
		res.status(401).json('{ "error": "true", "message": "Invalid username or password." }');
	}
});

app.listen(apiPort, () => {
	console.log('Running on Port ' + apiPort + ' - ' + new Date());
});

function connectToPrinter() {
	let client = new net.Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Connecting...');
		client.write('~M601 S1\r\n'); // Req. Control
	});

	client.on('data', function (data) {
		if (data.includes('Control Success.')) {
			console.log('Connected - ' + new Date());
			printerData.push(data.toString());
			client.destroy();
			getPrinterStatus();
		}
	});

	client.on('error', function () {
		console.log('Connection failed - ' + new Date());
		client.destroy();
		return printerData
	});
}

function getPrinterStatus() {
	let client = new net.Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting machine status...');
		client.write('~M119\r\n'); // Status
	});


	client.on('data', function (data) {
		console.log('Data returned:');
		console.log(data.toString());
		printerData.push(data.toString());
		client.destroy();
		getPrintProgress();
	});
}

function getPrintProgress() {
	let client = new net.Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting print progress...');
		client.write('~M27\r\n'); // Progress
	});


	client.on('data', function (data) {
		console.log('Data returned:');
		console.log(data.toString());
		printerData.push(data.toString());
		client.destroy();
		getExtruderTemperature();
	});
}

function getExtruderTemperature() {
	let client = new net.Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting extruder temperature...');
		client.write('~M105\r\n'); // Temperature
	});


	client.on('data', function (data) {
		console.log('Data returned:');
		console.log(data.toString());
		printerData.push(data.toString());
		client.destroy();
	});

	return printerData
}
