import { app } from './app.js';

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8000;
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`📚 API Documentation: http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();