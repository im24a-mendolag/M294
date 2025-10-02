const up = document.getElementById("up");
const left = document.getElementById("left");
const right = document.getElementById("right");
const down = document.getElementById("down");


const TEAM_NAME = "B";
const TEAM_SECRET = "k74e";

let client;

function initClient() {
    if (!window.ApiArenaClient) {
        console.error("ApiArenaClient is not available");
        return;
    }
    client = new window.ApiArenaClient(TEAM_NAME, TEAM_SECRET);
}

async function registerNavigator() {
    if (!client) return;
    try {
        await client.register('navigator');
    } catch (err) {
        console.error('Register failed', err);
    }
}

async function sendMove(direction) {
    if (!client) return;
    try {
        const res = await client.move(direction);
        console.log('Move', direction, res);
    } catch (err) {
        console.error('Move failed', direction, err);
    }
}

function wireButtons() {
    up?.addEventListener('click', () => sendMove('up'));
    down?.addEventListener('click', () => sendMove('down'));
    left?.addEventListener('click', () => sendMove('left'));
    right?.addEventListener('click', () => sendMove('right'));
}

function wireKeyboard() {
    const keyToDirection = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
    };
    window.addEventListener('keydown', (e) => {
        const dir = keyToDirection[e.key];
        if (dir) {
            e.preventDefault();
            sendMove(dir);
        }
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    initClient();
    wireButtons();
    wireKeyboard();
    await registerNavigator();
});