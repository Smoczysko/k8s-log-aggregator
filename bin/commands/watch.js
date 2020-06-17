const childProcess = require('child_process');
const chalk = require('chalk');
const chalkUtils = require('../utils/chalk.utils');
const kubernetesUtils = require('../utils/k8s.utils');

module.exports = async (prefix, container) => {
    const pods = await kubernetesUtils.getPods(prefix);
    const podStyles = chalkUtils.setColors(pods);

    pods.forEach((pod, index) => {
        const logs = childProcess.spawn(`kubectl`, ['logs', '-f', `${prefix}${pods[index]}`, '-c', container]);

        logs.stdout.on('data', data => {
            console.log(chalk[podStyles[index]](`[${pods[0]}] ${data}`));
        });

        logs.on('exit', code => {
            if (code !== 0) {
                console.log(`Something went wrong while watching on ${prefix}${pod} container logs Exit status: ${code}`);

                process.exit(code);
            } else {
                console.log('Bye bye');
            }
        });

        logs.on('error', error => {
            console.log(`Error occurred while watching on ${prefix}${pod} container logs`);
            console.log(error);
        })
    });
};
