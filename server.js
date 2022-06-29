const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/nik-proj-web/'));
app.get('/*', function(req,res) {
    res.sendFile(__dirname+'/dist/nik-proj-web/index.html');
});
app.listen(process.env.PORT || 8080);
