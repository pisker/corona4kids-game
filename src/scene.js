import background1Src from './media/Ballonversuch PNG.png';
import background2Src from './media/Hintergrund2.png';
import windmillSrc from './media/Windrad2.png';

import * as PIXI from 'pixi.js'

var pixiContainer;
var pixiLoaderResources;
var pixiRenderer;
var scenes = [];

function addResources(loader) {
    loader.add(background1Src);
    loader.add(background2Src);
    loader.add(windmillSrc);
}
function initScenes(container, app) {
    pixiContainer = container;
    pixiLoaderResources = app.loader.resources;
    pixiRenderer = app.renderer;

    createScene('alt'); // create first scene, others are added in updateScenes()
}

function updateScenes(delta) {
    // add scene(s) as long as last scene is not completely filling the screen
    let lastScene = scenes[scenes.length-1];
    while((lastScene.container.x+lastScene.width)*pixiContainer.scale.x<=pixiRenderer.width) {
        createScene(getNextSceneName());
        lastScene = scenes[scenes.length-1];
    }

    // remove first scene(s) if it is completely out of view
    let firstScene = scenes[0];
    while (scenes[0].container.x < -scenes[0].width) {
        removeFirstScene();
        firstScene[0] = scenes[0];
    }

    // update scenes
    scenes.forEach(scene => {
        scene.container.x -= delta*5;
        updateScene(scene, delta);
    });
}

function createScene(name) {
    console.log('create scene');
    let sceneContainer = new PIXI.Container();
    if (scenes.length === 0) {
        sceneContainer.x = 0;
    } else {
        let lastScene = scenes[scenes.length - 1];
        sceneContainer.x = lastScene.container.x + lastScene.width;
    }

    let scene = {
        name: name,
        container: sceneContainer,
        width: 0, // to be set in buildScene()
    };

    buildScene(scene);
    pixiContainer.addChild(sceneContainer);
    scenes.push(scene);
}

function removeFirstScene() {
    pixiContainer.removeChild(scenes[0].container);
    scenes.shift();
}

function updateScene(scene, delta) {
    switch (scene.name) {
        case 'alt':
            break;
        case 'windrad':
            scene.windmillSprite.rotation += 0.01 * delta;
            break;
        default:
            break;
    }
}

function buildScene(scene) {
    if (scene.name === 'alt') {

        let sprite = new PIXI.Sprite(pixiLoaderResources[background1Src].texture); // TODO: Select texture from scene name
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });
    } else if (scene.name === 'windrad') {
        let backgroundSprite = new PIXI.Sprite(pixiLoaderResources[background2Src].texture); // TODO: Select texture from scene name
        scene.width = backgroundSprite.width;
        scene.container.addChild(backgroundSprite);

        let windmillSprite = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite.anchor.set(109/windmillSprite.width, 78/windmillSprite.height);
        windmillSprite.position.set(108, 423);
        scene.container.addChild(windmillSprite);

        Object.assign(scene, { backgroundSprite: backgroundSprite, windmillSprite: windmillSprite });
    }
}

function getNextSceneName() {
    if(scenes[scenes.length-1].name === 'windrad')
        return 'alt';
    else
        return 'windrad';
}


export { addResources, initScenes, updateScenes };