import express from 'express';
import { Socket } from 'net';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

const printerPort = 8899;
let printerData = {};

// *** CHANGE THESE SETTINGS TO FIT YOUR SETUP *** //
const apiPort = 8000; // The port this API runs on. Remember to point your front-end here.
const printerIP = '192.168.0.175'; // Remember to give your printer an fixed IP addr in your router to avoid problems!
// ********************************************** //

app.get('/', async (_req, res) => {
	try {
		printerData.printerConnection = await connectToPrinter();
		printerData.printerStatus = await getPrinterStatus();
		printerData.printProgress = await getPrintProgress();
		printerData.extruderTemperature = await getExtruderTemperature();
	} catch (res) {
		printerData.printerConnection = res;
	}

	console.log(printerData);

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	res.send(printerData);
});

app.listen(apiPort, () => {
	console.log('Running on Port ' + apiPort + ' - ' + new Date());
});

function connectToPrinter() {
	let client = new Socket();

	client.connect(printerPort, printerIP, function () {
		console.log('Connecting...');
		client.write('~M601 S1\r\n'); // Req. Control
	});

	return new Promise((resolve, reject) => {
		client.on('data', function (data) {
			if (data.includes('Control Success.')) {
				console.log('Connected - ' + new Date());
				client.destroy();
				resolve('Connected');
			}
		});

		client.on('error', function () {
			console.log('Connection failed - ' + new Date());
			client.destroy();
			reject('Unknown connection error - Printer may be offline?');
		});
	});
}

function getPrinterStatus() {
	let client = new Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting machine status...');
		client.write('~M119\r\n'); // Status
	});

	return new Promise((resolve) => {
		client.on('data', function (data) {
			console.log(`Data returned:\n ${data.toString()}`);
			client.destroy();
			resolve(
				data.toString().includes('MachineStatus: READY')
					? 'Idle/Ready' : data.toString().includes('MachineStatus: BUILDING_FROM_SD')
						? 'Printing' : 'Unknown Status'
			);
		});
	});
}

function getPrintProgress() {
	let client = new Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting print progress...');
		client.write('~M27\r\n'); // Progress
	});

	return new Promise((resolve) => {
		client.on('data', function (data) {
			console.log(`Data returned:\n ${data.toString()}`);
			client.destroy();
			resolve(Number(data.toString().split('byte ')[1].split('/')[0]));
		});
	});
}

function getExtruderTemperature() {
	let client = new Socket();
	client.connect(printerPort, printerIP, function () {
		console.log('Requesting extruder temperature...');
		client.write('~M105\r\n'); // Temperature
	});

	return new Promise((resolve) => {
		client.on('data', function (data) {
			console.log(`Data returned:\n ${data.toString()}`);
			client.destroy();
			resolve(data.toString().split(' ')[2].replace('Received.\r\nT0:', '') + 'ºC');
		});
	});
}
