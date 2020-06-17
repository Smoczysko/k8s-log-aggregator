const nodeUtils = require('util');
const childProcess = require('child_process');
const exec = nodeUtils.promisify(childProcess.exec);

const getPods = async (prefix) => {
    const { stdout } = await exec(`kubectl get po`, {
        env: process.env,
        shell: '/bin/bash'
    });

    return stdout.split('\n')
        .slice(1)
        .map(line => {
            const parts = line.split(/[ ,]+/);

            return !parts ? undefined : parts[0];
        })
        .filter(line => line.startsWith(prefix))
        .map(pod => pod.substring(prefix.length))
        .filter(pod => {
            const podName = pod.substring(1); // '-' character that separates deployment name from replica set name

            return podName.indexOf('-') === podName.lastIndexOf('-');
        });
}

module.exports = {
    getPods
};
