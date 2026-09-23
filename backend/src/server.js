import app from './app.js';

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`API de Little Ville rodando em http://localhost:${port}`));
