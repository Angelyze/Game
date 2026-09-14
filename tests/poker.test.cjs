const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'Poker.html'), 'utf8');
const script = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];
const elements = new Map();
function element(id) {
    if (!elements.has(id)) elements.set(id, {
        style: {}, textContent: '', src: '', disabled: false, events: {},
        classList: {add() {}, remove() {}},
        getAttribute: key => key === 'role' && ['welcomeScreen','endScreen'].includes(id) ? 'button' : null,
        addEventListener(type, handler) { this.events[type] = handler; }
    });
    return elements.get(id);
}
const context = vm.createContext({document: {getElementById: element}, alert: message => { throw new Error(message); }});
vm.runInContext(script, context);
const run = code => vm.runInContext(code, context);
const hand = text => text.split(' ').map(card => ({rank: '23456789TJQKA'.indexOf(card[0]), suit: 'HDCS'.indexOf(card[1])}));
const score = text => run(`evaluateHand(${JSON.stringify(hand(text))})`);
const compare = (a, b) => run(`compareHands(${JSON.stringify(hand(a))}, ${JSON.stringify(hand(b))})`);
const categories = ['AS JD 9C 5H 2S', 'AS AD 9C 5H 2S', 'AS AD 9C 9H 2S', 'AS AD AC 5H 2S', '6S 5D 4C 3H 2S', 'AS JS 9S 5S 2S', 'AS AD AC 5H 5S', 'AS AD AC AH 2S', '6S 5S 4S 3S 2S', 'AS KS QS JS TS'];
categories.forEach((cards, category) => assert.equal(score(cards), category));
assert.equal(score('AS 2D 3C 4H 5S'), 4);
const victories = [
    ['AS JD 9C 5H 2S','KS JD 9C 5H 2S'],
    ['AS AD 9C 5H 2S','KS KD AC 5H 2S'],
    ['AS AD KC 5H 2S','AC AH QC 5D 2H'],
    ['AS AD KC QH 4S','AC AH KD QS 3H'],
    ['AS AD KC KH 2S','AC AH QC QH KS'],
    ['AS AD KC KH QS','AC AH KD KS JH'],
    ['AS AD AC KH QS','AH AC AD KS JH'],
    ['6S 5D 4C 3H 2S','AS 2D 3C 4H 5S'],
    ['AS QS 9S 5S 2S','AH JH 9H 5H 2H'],
    ['AS AD AC KH KS','KS KD KC AH AS'],
    ['AS AD AC KH KS','AH AC AD QH QS'],
    ['KS KD KC KH AS','KS KD KC KH QS'],
    ['7S 6S 5S 4S 3S','6H 5H 4H 3H 2H']
];
for (const [a,b] of victories) { assert.ok(compare(a,b)>0); assert.ok(compare(b,a)<0); }
assert.equal(compare('AS KD QC JH 9S', 'AH KC QD JS 9H'), 0);
const seven = hand('AS AD AC KH KS KD 2C');
assert.equal(run(`scoreHand(getBestHandRank(${JSON.stringify(seven)})).join(',')`), '6,12,11');
const original = JSON.stringify(seven);
run(`const unchangedHand = ${original}; scoreHand(unchangedHand);`);
assert.equal(run('JSON.stringify(unchangedHand)'), original);

for (const [player, house, board, expectedPlayerCaps] of [
    ['AS AD', 'KS KD', '2H 5D 7C 9H TS', 110],
    ['KS QD', 'JS TD', 'AH AD 7C 9H 2S', 110],
    ['2C 3D', '4S 5C', 'AH KH QH JH TH', 100]
]) {
    run(`restartGame(); playerCaps = 90; houseCaps = 90; pot = 20; roundActive = true;
        playerHand = ${JSON.stringify(hand(player))}; houseHand = ${JSON.stringify(hand(house))};
        communityCards = ${JSON.stringify(hand(board))}; showdown();`);
    assert.equal(run('playerCaps'), expectedPlayerCaps);
    assert.equal(run('houseCaps'), 200 - expectedPlayerCaps);
    assert.equal(run('pot'), 0);
}
run('restartGame();');

function invariant() {
    assert.equal(run('playerCaps + houseCaps + pot'), 200);
    assert.ok(run('[playerCaps, houseCaps, pot].every(n => Number.isInteger(n) && n >= 0)'));
}
run('startGame(); startRound();');
assert.equal(run('pot'), 2);
assert.equal(run('roundActive'), true);
run(`houseHand = ${JSON.stringify(hand('AS AD'))};`);
run('playerBet();');
assert.equal(run('stage'), 'flop');
assert.equal(run('currentBet'), 0);
assert.equal(run('pot'), 12);
assert.equal(element('houseCaps').textContent, 'House Caps: 94');
run('playerCheck();');
assert.equal(run('stage'), 'turn');
assert.equal(run('pot'), 12);
run('playerBet();');
assert.equal(run('stage'), 'river');
assert.equal(run('pot'), 22);
run('playerCheck();');
assert.equal(run('stage'), 'complete');
assert.equal(run('pot'), 0);
invariant();
const settled = run('JSON.stringify([playerCaps, houseCaps, pot])');
run('showdown(); playerFold(); playerBet(); playerCheck();');
assert.equal(run('JSON.stringify([playerCaps, houseCaps, pot])'), settled);

run(`restartGame(); playerCaps = 3; houseCaps = 197; startRound(); houseHand = ${JSON.stringify(hand('AS AD'))}; playerBet();`);
assert.equal(run('roundActive'), false);
assert.ok(run('communityCardImgs.every(img => img.src !== cardURLs.back)'));
invariant();
run('restartGame(); playerCaps = 1; houseCaps = 199; startRound();');
assert.equal(run('roundActive'), false);
invariant();
run('restartGame(); startRound();');
const dealt = run('JSON.stringify([playerCaps,houseCaps,pot,playerHand,houseHand,communityCards])');
run('startRound();');
assert.equal(run('JSON.stringify([playerCaps,houseCaps,pot,playerHand,houseHand,communityCards])'), dealt);
run('playerFold();');
assert.equal(run('houseCaps'), 101);
assert.equal(run('playerCaps'), 99);
run(`restartGame(); startRound(); houseHand = ${JSON.stringify(hand('2H 3D'))}; Math.random = () => 0; playerBet();`);
assert.equal(run('playerCaps'), 101);
assert.equal(run('houseCaps'), 99);
invariant();

// Seeded complete rounds exercise checks, bets, folds, short stacks and restarts.
run('let randomSeed = 12345; Math.random = () => ((randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0) / 4294967296);');
for (let round = 0; round < 1500; round++) {
    if (run('playerCaps === 0 || houseCaps === 0')) run('restartGame();');
    run('startRound();');
    let actions = 0;
    while (run('roundActive')) {
        run('{ const action = Math.random(); if (action < .1) playerFold(); else if (action < .6) playerBet(); else playerCheck(); }');
        invariant();
        assert.ok(++actions <= 4, 'Round must finish within four betting streets');
    }
    invariant();
}
assert.equal(element('betButton').events.touchstart, undefined);
assert.equal(typeof element('welcomeScreen').events.keydown, 'function');
console.log('PASS: hand categories, kickers, true ties, ace-low straights, best-five selection, betting resets, short stacks, duplicate actions, and 1,500 complete rounds.');
