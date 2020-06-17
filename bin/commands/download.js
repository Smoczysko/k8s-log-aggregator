const fs = require('fs');
const childProcess = require('child_process');
const kubernetesUtils = require('../utils/k8s.utils');

module.exports = async (prefix, container, file) => {
    const outputFileStream = fs.createWriteStream(file);
    const pods = await kubernetesUtils.getPods(prefix);

    let inputStreamsCounter = pods.length;

    pods.forEach((pod, index) => {
        const logs = childProcess.spawn(`kubectl`, ['logs', `${prefix}${pods[index]}`, '-c', container]);

        logs.stdout.on('data', data => {
            outputFileStream.write(`[${pods[0]}] ${data}`);
        });

        logs.on('exit', () => {
            inputStreamsCounter--;

            if (inputStreamsCounter === 0) {
                outputFileStream.close();
            }
        });

        logs.on('error', error => {
            console.log(`Error occurred while watching on ${prefix}${pod} container logs`);
            console.log(error);
        })
    });
};
