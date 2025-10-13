const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname));

app.listen(3001, () => {
    console.log('Serveris veikia http://localhost:3001');
});

const blogs = [
        {
            id: 1,
            title: 'Pirmoji pamoka',
            santrauka: 'Tai yra pirmoji pamoka apie Node.js',
            body: 'Šioje pamokoje sužinosite apie Node.js pagrindus. Node.js yra JavaScript vykdymo aplinka, kuri leidžia rašyti serverio pusės programas naudojant JavaScript kalbą.'
        },
        {
            id: 2,
            title: 'Antroji pamoka', 
            santrauka: 'Šioje pamokoje sužinosite apie Express.js',
            body: 'Express.js yra minimalus ir lankstus Node.js web aplikacijų karkasas, kuris suteikia platų funkcijų rinkinį, skirtą kurti web ir mobiliesiems aplikacijoms.'
        },
        {
            id: 3,
            title: 'Trečioji pamoka', 
            santrauka: 'Ši pamoka skirta EJS šablonų varikliui',
            body: 'EJS (Embedded JavaScript) yra šablonų variklis, kuris leidžia generuoti HTML puslapius naudojant JavaScript kodą. Tai leidžia dinamiškai kurti turinį ir lengvai integruoti duomenis į HTML.'
        },
        {
            id: 4,
            title: 'Ketvirtoji pamoka', 
            santrauka: 'Šioje pamokoje aptarsime duomenų bazes',
            body: 'Duomenų bazės yra struktūrizuotos duomenų saugojimo sistemos, kurios leidžia efektyviai saugoti, tvarkyti ir pasiekti duomenis. Node.js dažnai naudojamas su MongoDB, MySQL ar PostgreSQL duomenų bazėmis.'
        }
    ];

app.get('/', (req, res) => {
    res.render('index', {title: 'Pamokos', blogs});
});

app.get('/apie', (req, res) => {
    res.render('apie', {title: 'Apie'});
});

app.get('/blogs/create-blog', (req, res) => {
    res.render('create-blog', {title: 'Kurti pamoką'});
});

app.get('/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
        res.render('blog', {title: blog.title, blog});
    } else {
        res.status(404).render('404', {title: 'Pamoka nerasta'});
    }
});

app.use((req, res) => {
    res.status(404).render('404', {title: 'Puslapis nerastas'});
});