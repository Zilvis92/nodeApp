const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(3000, () => {
    console.log('Serveris veikia http://localhost:3000');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/apie', (req, res) => {
    res.render('apie');
});

app.get('/blogs/create-blog', (req, res) => {
    res.render('create-blog')
});

app.use((req, res) => {
    res.status(404).render('404')
});