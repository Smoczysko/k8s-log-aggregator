const nodeUtils = require('util');
const childProcess = require('child_process');
const chalk = require('chalk');
const chalkUtils = require('../utils/chalk.utils');

const exec = nodeUtils.promisify(childProcess.exec);

module.exports = async (prefix, container) => {
    const { stdout } = await exec(`kubectl get po`, {
        env: process.env,
        shell: '/bin/bash'
    });

    const pods = stdout.split('\n')
        .slice(1)
        .map(line => {
            const parts = line.split(/[ ,]+/);

            return !parts ? undefined : parts[0];
        })
        .filter(line => line.startsWith(prefix))
        .map(pod => pod.substring(prefix.length));

    const podStyles = chalkUtils.setColors(pods);

    pods.forEach((pod, index) => {
        const logs = childProcess.spawn(`kubectl`, ['logs', '-f', `${prefix}${pods[0]}`, '-c', container]);

        logs.stdout.on('data', data => {
            console.log(chalk[podStyles[index]](`[${pods[0]}] ${data}`));
        });

        logs.on('exit', code => {
            if (code !== 0) {
                console.log('Something went wrong...');
                process.exit(code);
            } else {
                console.log('Bye bye');
            }
        });

        logs.on('error', error => {
            console.log('WTF?!');
            console.log(error);
        })
    });
};
