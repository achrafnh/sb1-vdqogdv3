import { createServer } from 'net';

export function getRandomPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, () => {
      const { port } = server.address() as { port: number };
      server.close(() => {
        resolve(port);
      });
    });
    server.on('error', reject);
  });
}