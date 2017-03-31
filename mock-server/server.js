const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const _ = require('lodash');
//import _ from 'lodash';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// app.get('/api/check_login',
//     function (req, res) {
//         res.send({status:"OK"});
//     }
// );
//
// app.post('/api/check_login',
//     function (req, res) {
//         res.send({status:"OK", id:111});
//     }
// );

app.get('/api/jwt',
    function (req, res) {
        fs.readFile( 'api/jwt.json', 'utf-8', function(e, content){
            res.send([JSON.parse(content)]);
        })
    }
);
// PROJECTS
app.get('/api/projects',
    function (req, res) {
        fs.readFile( 'api/projects.json', 'utf-8', function(e, content){
            res.send(
                JSON.parse(content)
            );
        })
    }
);

app.get('/api/project/:id',
    function (req, res) {
        fs.readFile( 'api/project.json', 'utf-8', function(e, content){
            res.send(
                JSON.parse(content)
            );
        })
    }
);


app.put('/api/project/:id',
    function (req, res) {
        fs.writeFile('api/project.json', JSON.stringify(JSON.parse(req.body.content), null, 4), function(err, content){
            if (err) { return console.error(err); }

            res.send(content);
        });
    }
);


app.post('/api/project',
    function (req, res) {
        fs.readFile( 'api/projects.json', 'utf-8', function(e, content){

            content = JSON.parse(content);
            var newid = content[content.length].id + 1;
            var o = req.body;
            o.id = newid;
            content.push(o);

            fs.writeFile('api/projects.json', JSON.stringify(JSON.parse(content), null, 4), function(err, content2){
                if (err) { return console.error(err); }

                res.send(content2);
            });
        })
    }
);

// TASKS
app.get('/api/tasks',
    function (req, res) {
        fs.readFile( 'api/tasks.json', 'utf-8', function(e, content){
            res.send(
                JSON.parse(content)
            );
        })
    }
);

app.get('/api/task/:id',
    function (req, res) {
        fs.readFile( 'api/task.json', 'utf-8', function(e, content){
            res.send(JSON.parse(content));
        })
    }
);


app.put('/api/task/:id',
    function (req, res) {
        fs.writeFile('api/task.json', JSON.stringify(JSON.parse(req.body.content), null, 4), function(err, content){
            if (err) { return console.error(err); }

            res.send(content);
        });
    }
);


app.post('/api/task',
    function (req, res) {
        fs.readFile( 'api/tasks.json', 'utf-8', function(e, content){

            content = JSON.parse(content);
            var newid = content[content.length].id + 1;
            var o = req.body;
            o.id = newid;
            content.push(o);

            fs.writeFile('api/tasks.json', JSON.stringify(JSON.parse(content), null, 4), function(err, content2){
                if (err) { return console.error(err); }

                res.send(content2);
            });
        })
    }
);

/***************/
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
