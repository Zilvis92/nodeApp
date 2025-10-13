const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(3001, () => {
    console.log('Serveris veikia http://localhost:3001');
});

app.get('/', (req, res) => {
    const blogs = [
        {title: 'Pirmoji pamoka', santrauka: 'Tai yra pirmoji pamoka apie Node.js'},
        {title: 'Antroji pamoka', santrauka: 'Šioje pamokoje sužinosite apie Express.js'},
        {title: 'Trečioji pamoka', santrauka: 'Ši pamoka skirta EJS šablonų varikliui'},
        {title: 'Ketvirtoji pamoka', santrauka: 'Šioje pamokoje aptarsime duomenų bazes'}
    ];
    res.render('index', {title: 'Pamokos', blogs});
});

app.get('/apie', (req, res) => {
    res.render('apie', {title: 'Apie'});
});

app.get('/blogs/create-blog', (req, res) => {
    res.render('create-blog', {title: 'Kurti pamoka'});
});

app.use(express.static(__dirname));

app.use((req, res) => {
    res.status(404).render('404', {title: 'Puslapis nerastas'});
});