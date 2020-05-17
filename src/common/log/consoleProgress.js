const process = require('process');
const rdl = require('readline');

function cmdProgressBar(size) {
    const cursor = 0;
    const timer = null;

    const start = () => {
        process.stdout.write('\x1B[?25l');
        for (let i = 0; i < size; i++) {
            process.stdout.write('\u2591');
        }
        rdl.cursorTo(process.stdout, cursor, 0);
    };

    const next = () => {
        process.stdout.write('\u2588');
        cursor++;
        return cursor < size;
    };

    return { start, next };
}

exports.cmdProgressBar = cmdProgressBar;
