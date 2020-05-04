import ballonSrc from './media/Heißluftballon PNG.png';

import * as PIXI from 'pixi.js'
import * as Keyboard from 'pixi.js-keyboard';
import * as Mouse from 'pixi.js-mouse';

import * as SceneManager from './scene.js';



/** @type {PIXI.Application} */
var app;

var scenesContainer;
var ballon;

const backgroundHeightPx = 658;

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
        .add(ballonSrc);

    SceneManager.addResources(resLoader);

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
    SceneManager.updateScenes(delta);

    rot+= 0.01*delta;
    ballon.rotation = 0.5*Math.sin(rot)+0.2;

    if(Keyboard.isKeyDown('Space') || Mouse.isButtonDown(Mouse.Button.LEFT)) {
        a = -0.2;
    } else {
        a = 0.1;
    }
    v += a*delta;
    v = Math.max(v, -2);
    v = Math.min(v, 2);
    ballon.y += v*delta;
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
    ballon.scale.set(0.5);
}


export {initGame};