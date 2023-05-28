import { Socket } from "net";

export const stopPrint = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Stopping print in progress...');
    client.write('~M26\r\n'); // Stop
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      console.log(`Data returned:\n ${data.toString()}`);
      client.destroy();
      resolve(data.toString().includes('ok') ? "Print Stopped" : "Error Stopping Print");
    });
  });
}

export const ledOn = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Turning LED on...');
    client.write('~M146 r255 g255 b255 F0\r\n'); // LED ON
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      console.log(`Data returned:\n ${data.toString()}`);
      client.destroy();
      resolve(data.toString().includes('ok') ? "Print Stopped" : "Error Stopping Print");
    });
  });
}

export const ledOff = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Turning LED off...');
    client.write('~M146 r0 g0 b0 F0\r\n'); // LED OFF
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      console.log(`Data returned:\n ${data.toString()}`);
      client.destroy();
      resolve(data.toString().includes('ok') ? "Print Stopped" : "Error Stopping Print");
    });
  });
}