const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(3001, () => {
    console.log('Serveris veikia http://localhost:3001');
});

app.get('/', (req, res) => {
    res.render('index', {title: 'Pamokos'});
});

app.get('/apie', (req, res) => {
    res.render('apie', {title: 'Apie'});
});

app.get('/blogs/create-blog', (req, res) => {
    res.render('create-blog', {title: 'Kurti pamoka'});
});

app.use((req, res) => {
    res.status(404).render('404', {title: 'Puslapis nerastas'});
});