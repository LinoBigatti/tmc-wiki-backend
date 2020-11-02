/*
Litematic archive handling
*/

const utils = require('./utils');

const fs = require('fs');
const index = (req, res) => {
    const lsFiles = fs.readdirSync('./archive/');

    const response = {};
    let id = 0;

    lsFiles.forEach(file => {
        if (file === '.nodelete') {
            return;
        }
        const stats = fs.statSync(`./archive/${file}`);

        const name = file;
        const size = stats.size;
        const created = stats.ctime;

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
    let fileName = utils.cast('string', req.params.fileName);
    fileName = utils.sanitizeFilename(fileName);
    const filePath = `./archive/${fileName}`;
    if (fileName === '.nodelete' || !fs.existsSync(filePath)) {
        res.status(404).send(`Archive not found: ${fileName}`);
        return;
    }
    res.download(filePath);
}
exports.download = download;

const uploadProcess = async (req, res) => {
    const file = req.files.file;
    const fileName = utils.sanitizeFilename(file.name);
    const fileExt = (fileName.split('.').pop());
    const filePrefix = fileName.split('.').slice(0, -1).join('.');

    if (!fileName.contains('.') || fileName === '.nodelete' || (fileExt !== 'litematic' && fileExt !== 'schematic' && fileExt !== 'nbt')) {
        res.redirect('/');
        return;
    }

    let path = `./archive/${fileName}`;
    let id = 1;

    while(fs.existsSync(path)) {
    	path = `./archive/${filePrefix}-${id}.${fileExt}`;
    	id++;
    }
    await file.mv(path);

    res.redirect('/archive');
}
exports.uploadProcess = uploadProcess;