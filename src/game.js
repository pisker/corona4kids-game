import ballonSrc from './media/Heißluftballon.png';
import score0Src from './media/score0.png'
import score1Src from './media/score1.png'
import score2Src from './media/score2.png'
import scoreMasksSrc from './media/score_masks.png'

import 'pixi.js'
import * as Keyboard from 'pixi.js-keyboard';
import * as Mouse from 'pixi.js-mouse';
import 'pixi-text-input';

import * as SceneManager from './scene.js';
import * as ItemManager from './item.js';

/** @type {PIXI.Application} */
var app;

var scenesContainer;
var itemsContainer;
var gameEndedContainer;
var ballon;
var scoreLifesSprite;
var scoreMasksSprite;
var scoreMasksText;

var playerNameBox;

const backgroundHeightPx = 500;

var score = 0;
var lifes = 1;

async function initGame() {
    let gameElement = document.getElementById("gameContent");
    app = new PIXI.Application({
        autoResize: true,
        antialias: true,
        resolution: 1
    });
    app.renderer.backgroundColor = 0x0;
    window.addEventListener('resize', resize);

    var resLoader = app.loader
        .add(ballonSrc)
        .add(score0Src)
        .add(score1Src)
        .add(score2Src)
        .add(scoreMasksSrc);

    SceneManager.addResources(app, resLoader);
    ItemManager.addResources(resLoader);

    gameElement.appendChild(app.view); // add canvas to body
    resLoader.load(setup); // load textures
}

function setup() {
    // init scenes
    scenesContainer = new PIXI.Container();
    SceneManager.initScenes(scenesContainer, app);
    app.stage.addChild(scenesContainer);

    // init ballon sprite
    ballon = new PIXI.Sprite(app.loader.resources[ballonSrc].texture);
    ballon.anchor.set(0.5, 0.2);
    ballon.scale.set(0.5);

    itemsContainer = new PIXI.Container();
    ItemManager.initItems(itemsContainer, app, ballon, addLife, removeLife, addScore);
    app.stage.addChild(itemsContainer);

    scoreLifesSprite = new PIXI.Sprite(app.loader.resources[score1Src].texture);
    scoreLifesSprite.position.set(250, 10);
    scoreMasksSprite = new PIXI.Sprite(app.loader.resources[scoreMasksSrc].texture);
    scoreMasksSprite.position.set(10, 10);
    scoreMasksText = new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 32 });
    scoreMasksText.position.set(40, 20);

    app.stage.addChild(scoreMasksSprite);
    app.stage.addChild(scoreLifesSprite);
    app.stage.addChild(scoreMasksText);

    gameEndedContainer = new PIXI.Container();
    gameEndedContainer.visible = false;
    app.stage.addChild(gameEndedContainer);
    playerNameBox = new PIXI.TextInput({
        input: {},
        box: {
            default: { fill: 0xE8E9F3, rounded: 16, stroke: { color: 0xCBCEE0, width: 4 } },
            focused: { fill: 0xE1E3EE, rounded: 16, stroke: { color: 0xABAFC6, width: 4 } },
            disabled: { fill: 0xDBDBDB, rounded: 16 }
        }
    });
    playerNameBox.position.set(100, 100);
    gameEndedContainer.addChild(playerNameBox);

    resize(); // MUST BE CALLED BEFORE addChild(ballon)!
    app.stage.addChild(ballon);


    // Listen for frame updates
    app.ticker.add((delta) => {
        update(delta);
    });


}
var rot = 0;
var v = 0;
var a = 0;
function update(delta) {
    if (Keyboard.isKeyDown('KeyP')) {
        delta = 0;
    }
    if (lifes > 0) {
        SceneManager.updateScenes(delta);
        ItemManager.updateItems(delta);
    }


    rot += 0.01 * delta;
    ballon.rotation = 0.5 * Math.sin(rot) + 0.2;

    if (Keyboard.isKeyDown('Space') || Mouse.isButtonDown(Mouse.Button.LEFT)) {
        a = -0.2;
    } else {
        a = 0.1;
    }
    if (ballon.y > app.renderer.height)
        a = -  100;
    else if (ballon.y < -50)
        a = 100;
    v += a * delta;

    v = Math.max(v, -2);
    v = Math.min(v, 2);
    ballon.y += v * delta;
    Keyboard.update();
    Mouse.update();
}

function resize() {
    const parent = app.view.parentNode;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    console.log('width: %d, height: %d', width, height);
    // Resize the renderer
    app.renderer.resize(width, height);

    // resize scene container
    scenesContainer.scale.set(height / backgroundHeightPx);

    // resize and move ballon
    ballon.x = width * 0.3;
    ballon.y = app.stage.height / 2;
    ballon.scale.set(0.25);
}

function removeLife() {
    if (lifes > 0)
        lifes--;

    if (lifes === 2)
        scoreLifesSprite.texture = app.loader.resources[score2Src].texture;
    else if (lifes === 1)
        scoreLifesSprite.texture = app.loader.resources[score1Src].texture;
    else if (lifes === 0) {
        scoreLifesSprite.texture = app.loader.resources[score0Src].texture;
        // lost game!
        showHighscore();
    }
}

function addLife() {
    if (lifes < 2)
        lifes++;

    if (lifes === 2)
        scoreLifesSprite.texture = app.loader.resources[score2Src].texture;
    else if (lifes === 1)
        scoreLifesSprite.texture = app.loader.resources[score1Src].texture;
    else if (lifes === 0)
        scoreLifesSprite.texture = app.loader.resources[score0Src].texture;
}

function addScore() {
    score++;
    scoreMasksText.text = score;
}

function showHighscore() {
    ballon.visible = false;
    scoreLifesSprite.visible = false;
    scoreMasksText.visible = false;
    scoreMasksSprite.visible = false;
    itemsContainer.visible = false;
    gameEndedContainer.visible = true;
}

function resetGame() {
    gameEndedContainer.visible = false;
    ballon.visible = true;
    scoreLifesSprite.visible = true;
    scoreMasksText.visible = true;
    scoreMasksSprite.visible = true;
    itemsContainer.visible = true;
    score = -1;
    addScore();
    lifes = 0;
    addLife();
    ballon.y = app.stage.height / 2;
}

export { initGame };