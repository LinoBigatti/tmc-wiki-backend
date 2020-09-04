/*
Litematic archive handling
*/
const fs = require('fs');
const index = (req, res) => {
    var lsFiles = fs.readdirSync('./archive/');
    var response = {}
    id = 1
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
    console.log(req.params)
    res.download(`.${req.url}`);
}
exports.download = download;

const uploadProcess = (req, res) => {
    const file = req.files.file;
    const file_ext = (file.name.split('.').pop())
    if (file_ext !== "litematic" && file_ext !== "schematic" && file_ext !== "nbt" && file_ext !== "png") {
        res.redirect('/')
        return
    }
    file.mv(`./archive/${file.name}`);

    res.redirect('/archive');
}
exports.uploadProcess = uploadProcess;