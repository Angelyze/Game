// Run with: node tests/viewport-layout.test.cjs
// Checks executable sizing/input logic; visual layout still needs a browser check.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const names = ['Adventure', 'Armageddon', 'CrazyEights', 'GreatWar', 'Memory', 'MemoryGame', 'Poker', 'PostApocalypticAdventure', 'Rummy', 'ScavSaga', 'Snakey', 'TheGreatSerpent', 'TheGreatWar'];
const sizes = [[320, 568], [390, 844], [844, 390], [1366, 768], [1920, 1080], [360, 240], [768, 1024], [1024, 600]];
let checks = 0;
for (const name of names) {
    const html = fs.readFileSync(path.join(root, name + '.html'), 'utf8');
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
    for (const script of scripts) new vm.Script(script, {filename: name + '.html'});
    const properties = {};
    const listeners = {};
    const context = {
        document: {documentElement: {style: {setProperty: (key, value) => properties[key] = value}}},
        window: {innerWidth: 390, innerHeight: 844, addEventListener: (key, fn) => listeners[key] = fn}
    };
    vm.runInNewContext(scripts[0], context);
    assert.equal(properties['--view-height'], '844px');
    for (const [width, height] of sizes) {
        context.window.innerWidth = width;
        context.window.innerHeight = height;
        listeners.resize();
        assert.equal(properties['--view-height'], height + 'px');
        assert.equal(properties['--view-width'], width + 'px');
        checks++;
    }
    context.window.visualViewport = {width: 390, height: 420, addEventListener: (key, fn) => listeners.visualResize = fn};
    vm.runInNewContext(scripts[0], context);
    listeners.visualResize();
    assert.equal(properties['--view-height'], '420px');
    if (['Armageddon', 'GreatWar', 'TheGreatWar'].includes(name)) {
        const setup = html.match(/function setupCanvas\(\) \{[\s\S]*?\n        }/)[0];
        const logicalWidth = Number(html.match(/const GAME_WIDTH = (\d+)/)[1]);
        const logicalHeight = Number(html.match(/const GAME_HEIGHT = (\d+)/)[1]);
        for (const [width, height] of sizes) for (const density of [1, 2, 3]) {
            const canvas = {style: {}};
            let transform;
            vm.runInNewContext(setup + '; setupCanvas();', {
                GAME_WIDTH: logicalWidth, GAME_HEIGHT: logicalHeight, canvas,
                window: {devicePixelRatio: density}, ctx: {setTransform: (...args) => transform = args},
                document: {getElementById: id => id === 'warShell' ? {clientWidth: width, clientHeight: height} : {getBoundingClientRect: () => ({height: 36})}}
            });
            const drawnWidth = parseFloat(canvas.style.width);
            const drawnHeight = parseFloat(canvas.style.height);
            assert.ok(drawnWidth + 4 <= width + .001);
            assert.ok(drawnHeight + 40 <= height + .001);
            assert.ok(Math.abs(drawnWidth / drawnHeight - logicalWidth / logicalHeight) < .00001);
            assert.equal(transform[0], canvas.width / logicalWidth);
            const expression = html.match(/const x = (.*);/g).find(line => line.includes('touch.clientX')).replace('const x = ', '').replace(/;$/, '');
            for (const fraction of [.1, .9]) {
                const x = vm.runInNewContext(expression, {touch: {clientX: 20 + 2 + drawnWidth * fraction}, rect: {left: 20}, canvas: {clientLeft: 2, clientWidth: drawnWidth}, GAME_WIDTH: logicalWidth});
                assert.ok(Math.abs(x - fraction * logicalWidth) < .001);
            }
            checks++;
        }
    }
    if (name === 'ScavSaga') {
        const fit = html.match(/const fitBoard = \(\) => \{[\s\S]*?\n        };/)[0];
        for (const [width, height] of sizes) {
            const canvas = {style: {}};
            vm.runInNewContext(fit + '; fitBoard();', {canvas, document: {getElementById: () => ({clientWidth: width, clientHeight: height - 36})}});
            assert.equal(canvas.style.width, canvas.style.height);
            assert.ok(parseFloat(canvas.style.height) <= height - 36);
            for (const axis of ['x', 'y']) {
                const expression = html.match(new RegExp('const ' + axis + ' = Math.floor\\(.*'))[0].replace('const ' + axis + ' = ', '').replace(/;.*$/, '');
                const content = parseFloat(canvas.style.width) - 8;
                for (let cell = 0; cell < 6; cell++) {
                    const position = 20 + 4 + content * (cell + .5) / 6;
                    const hit = vm.runInNewContext(expression, {e: {clientX: position, clientY: position}, rect: {left: 20, top: 20}, canvas: {width: 360, height: 360, clientWidth: content, clientHeight: content, clientLeft: 4, clientTop: 4}, TILE_SIZE: 60});
                    assert.equal(hit, cell);
                }
            }
            checks++;
        }
    }
}
console.log(`PASS: 13 games parse; ${checks} viewport, canvas-size and input-coordinate cases, plus visual viewport updates.`);
