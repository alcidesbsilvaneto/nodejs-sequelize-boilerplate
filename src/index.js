import app from './app';
app.server.listen(process.env.PORT || 1337, () => {
    console.log('Server listening on ' + app.server.address().port);
});