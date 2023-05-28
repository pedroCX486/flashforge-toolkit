import { Socket } from "net";
import crc32 from 'buffer-crc32';

export function sendFileToPrinter(printerIP: string, printerPort: number, fileBuffer: Buffer, fileName: string): Promise<string> {
  const fileSize = fileBuffer.length;
  const client = new Socket();
  let chunkCounter = 0;
  let currentChunkIndex = 0;

  client.connect(printerPort, printerIP, () => {
    client.write(`~M28 ${fileSize} 0:/user/${fileName.replace(/ /g, '_')}\r\n`); // Prepare Print
  });

  function sendChunk(i: number) {
    if (i >= fileBuffer.length) {
      // All chunks have been sent
      client.write('~M29\r\n'); //Save File
      client.write(`~M23 0:/user/${fileName}\r\n`); // Print Start
      return;
    }

    let chunk = fileBuffer.slice(i, i + 4080);
    const crcValue = crc32.unsigned(chunk).toString(16);

    const header = Buffer.alloc(16);
    header.writeUInt32BE(0x5a5aa5a5, 0);
    header.writeUInt32BE(chunkCounter++, 4);
    header.writeUInt32BE(chunk.length, 8);
    header.write(crcValue.padStart(8, '0'), 12, 'hex');

    chunk = Buffer.concat([header, chunk]);
    if (chunk.length < 4096) {
      chunk = Buffer.concat([chunk, Buffer.alloc(4096 - chunk.length)]);
    }

    client.write(chunk);
    currentChunkIndex += 4080;
  }

  return new Promise((resolve, reject) => {
    client.on('data', (data) => {
      console.log(`Data: ${data}`);

      if (data.includes('M28 Received')) {
        sendChunk(currentChunkIndex); // Send first chunk
      }

      if (data.includes('Data:') && data.includes('ok')) {
        sendChunk(currentChunkIndex); // Wait until OK comes and send next chunk
      }
    });

    client.on('close', () => {
      console.log('Connection closed.');
      client.destroy();
      resolve('Connection Closed!');
    });

    client.on('error', (error) => {
      console.error('An error occurred:', error);
      client.destroy();
      reject('Error during file transmission...');
    });
  });
}