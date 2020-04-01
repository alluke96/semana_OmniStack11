const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();


// app.use(cors({
//     origin: 'http://meuapp.com' por exemplo, para quando o projeto estiver em produção.
// }));
app.use(cors()); // em desenvolvimento para o frontend poder acessar o backend
app.use(express.json());
app.use(routes);

app.listen(3333);