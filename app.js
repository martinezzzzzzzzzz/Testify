const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const questionRoutes = require('./routes/question.routes');

const app = express();

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  secret: 'testify-secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);

app.listen(3001, () => {
  console.log('Testify backend corriendo en puerto 3001');
});
