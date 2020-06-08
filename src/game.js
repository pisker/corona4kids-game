import ballonSrc from './media/Heißluftballon.png';
import score0Src from './media/score0.png'
import score1Src from './media/score1.png'
import score2Src from './media/score2.png'
import scoreMasksSrc from './media/score_masks.png'
import scoreScreenSrc from './media/scoreScreen.png';
import scoreScreenButton1Src from './media/scoreScreenButton1.png';
import scoreScreenButton2Src from './media/scoreScreenButton2.png';

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

var scoreScreenSprite;
var scoreScreenHighscoreText;
var scoreScreenButton;

var playerNameBox;

const backgroundHeightPx = 500;
const scoreScreenHeightPx = 700;
var itemScale;

var score = 0;
var lifes = 1;

async function initGame(scale) {
    itemScale = scale;
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
        .add(scoreScreenSrc)
        .add(scoreScreenButton1Src)
        .add(scoreScreenButton2Src)
        .add(scoreMasksSrc);

    SceneManager.addResources(app, resLoader);
    ItemManager.addResources(resLoader);

    gameElement.appendChild(app.view); // add canvas to body
    resLoader.load(setup); // load textures
}

function setup() {
    for(var key in app.loader.resources) 
        app.renderer.plugins.prepare.upload(app.loader.resources[key].texture);

    window.gameStart = new Date();
    // init scenes
    scenesContainer = new PIXI.Container();
    SceneManager.initScenes(scenesContainer, app);
    app.stage.addChild(scenesContainer);

    // init ballon sprite
    ballon = new PIXI.Sprite(app.loader.resources[ballonSrc].texture);
    ballon.anchor.set(0.5, 0.2);
    ballon.scale.set(1*itemScale);

    itemsContainer = new PIXI.Container();
    ItemManager.initItems(itemsContainer, app, ballon, addLife, removeLife, addScore, itemScale);
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
    scoreScreenSprite = new PIXI.Sprite(app.loader.resources[scoreScreenSrc].texture);
    gameEndedContainer.addChild(scoreScreenSprite);
    scoreScreenHighscoreText = new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 50 });
    scoreScreenHighscoreText.position.set(750, 320);
    gameEndedContainer.addChild(scoreScreenHighscoreText);
    playerNameBox = new PIXI.TextInput({
        input: {
            fontFamily: 'Arial',
            fontSize: '50px',
            width: '200px'
        },
        box: {
            default: {  },
            focused: {  },
        }
    });

    playerNameBox.position.set(589, 540);
    gameEndedContainer.addChild(playerNameBox);
    scoreScreenButton = new PIXI.Sprite(app.loader.resources[scoreScreenButton1Src].texture);
    scoreScreenButton.interactive = true;
    scoreScreenButton.buttonMode = true;
    scoreScreenButton.position.set(882, 514);
    scoreScreenButton.on('pointerdown', () => {
        scoreScreenButton.texture = app.loader.resources[scoreScreenButton2Src].texture;
    });
    scoreScreenButton.on('pointerupoutside', () => {
        scoreScreenButton.texture = app.loader.resources[scoreScreenButton1Src].texture;
    });
    scoreScreenButton.on('pointerup', () => {
        resetGame();
        scoreScreenButton.texture = app.loader.resources[scoreScreenButton1Src].texture;
    });
    gameEndedContainer.addChild(scoreScreenButton);

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
    const maxSpeed = 3;
    v = Math.max(v, -maxSpeed);
    v = Math.min(v, maxSpeed);
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

    gameEndedContainer.scale.set(height / scoreScreenHeightPx * 0.8);
    gameEndedContainer.x = width / 2 - gameEndedContainer.width / 2; 
    gameEndedContainer.y = height / 2 - gameEndedContainer.height / 2;
    // resize and move ballon
    ballon.x = width * 0.3;
    ballon.y = app.stage.height / 2;
    ballon.scale.set(0.17*itemScale);
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
        //resetGame();
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
    const filter = new PIXI.filters.BlurFilter(8);
    scenesContainer.filters = [filter];
    scoreScreenHighscoreText.text = score;
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
    window.gameStart = new Date();
    scenesContainer.filters = [];
    ItemManager.clearItems();
}

export { initGame };