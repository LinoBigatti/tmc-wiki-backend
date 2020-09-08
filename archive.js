/*
Litematic archive handling
*/
const fs = require('fs');
const index = (req, res) => {
    var lsFiles = fs.readdirSync('./archive/');

    var response = {};
    id = 0;

    lsFiles.forEach(file => {
        if (file == '.nodelete') {
            return;
        }
        var stats = fs.statSync(`./archive/${file}`);

        name = file;
        size = stats.size;
        created = stats.ctime;

        response[id] = {
            'name': name,
            'size': size / 1000,
            'created': created.toISOString(),
            'link': `/archive/${name}`
        }

        id++;
    });
    res.send((response));
}
exports.index = index;

const download = (req, res) => {
//    console.log(req.params)
    res.download(`.${req.url}`);
}
exports.download = download;

const uploadProcess = (req, res) => {
    const file = req.files.file;
    const fileExt = (file.name.split('.').pop());
    const fileName = file.name.split('.').slice(0, -1).join('.');

    if(fileExt !== 'litematic' && fileExt !== 'schematic' && fileExt !== 'nbt') {
        res.redirect('/');
        return;
    }

    path = `./archive/${file.name}`;
    id = 1;

    while(fs.existsSync(path)) {
    	path = `./archive/${fileName}-${id}.${fileExt}`;
    	id++;
    }
    file.mv(path);

    res.redirect('/archive');
}
exports.uploadProcess = uploadProcess;