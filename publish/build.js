const {exec} = require('child_process');
const packageJSON = require('../package.json');

exec('npm run dist', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
        return console.log(err);
    }

    console.log(stderr);

    console.log(
        `✅ ${packageJSON.name}@${packageJSON.version}----------------打包成功`
    );
});