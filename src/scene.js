import background1Src from './media/Hintergrund_neu1.png';
import background2Src from './media/Hintergrund_neu2.png';
import background3Src from './media/Hintergrund_neu3.png';
import background4Src from './media/Hintergrund_neu4.png';
import windmillSrc from './media/windmill.png';

import * as PIXI from 'pixi.js'

var pixiContainer;
var pixiLoaderResources;
var pixiRenderer;
var scenes = [];

function addResources(loader) {
    loader.add(background1Src);
    loader.add(background2Src);
    loader.add(background3Src);
    loader.add(background4Src);
    loader.add(windmillSrc);
}
function initScenes(container, app) {
    pixiContainer = container;
    pixiLoaderResources = app.loader.resources;
    pixiRenderer = app.renderer;

    createScene('hintergrund1'); // create first scene, others are added in updateScenes()
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
    console.log('create scene %s', name);
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
        case 'hintergrund1':
            scene.windmillSprite1.rotation += 0.01 * delta;
            scene.windmillSprite2.rotation += 0.01 * delta;
            scene.windmillSprite3.rotation += 0.01 * delta;
            break;
        case 'hintergrund2':
            scene.windmillSprite1.rotation += 0.01 * delta;
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
    } else if(scene.name === 'hintergrund1') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[background1Src].texture); // TODO: Select texture from scene name
        scene.container.addChild(sprite);
        scene.width = sprite.width;

        let windmillSprite1 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite1.anchor.set(109/windmillSprite1.width, 78/windmillSprite1.height);
        windmillSprite1.position.set(6399, 290);
        windmillSprite1.scale.set(0.7);
        scene.container.addChild(windmillSprite1);

        let windmillSprite2 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite2.anchor.set(109/windmillSprite2.width, 78/windmillSprite2.height);
        windmillSprite2.position.set(6705, 305);
        scene.container.addChild(windmillSprite2);

        let windmillSprite3 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite3.anchor.set(109/windmillSprite3.width, 78/windmillSprite3.height);
        windmillSprite3.position.set(6935, 267);
        windmillSprite3.scale.set(0.3);
        scene.container.addChild(windmillSprite3);
        Object.assign(scene, { backgroundSprite: sprite, windmillSprite1: windmillSprite1, windmillSprite2: windmillSprite2, windmillSprite3: windmillSprite3 });

    } else if(scene.name === 'hintergrund2') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[background2Src].texture); // TODO: Select texture from scene name
        scene.container.addChild(sprite);
        scene.width = sprite.width;

        let windmillSprite1 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite1.anchor.set(109/windmillSprite1.width, 78/windmillSprite1.height);
        windmillSprite1.position.set(185, 242);
        windmillSprite1.scale.set(0.7);
        scene.container.addChild(windmillSprite1);

        Object.assign(scene, { backgroundSprite: sprite, windmillSprite1: windmillSprite1 });
        
    } else if(scene.name === 'hintergrund3') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[background3Src].texture); // TODO: Select texture from scene name
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });
        
    } else if(scene.name === 'hintergrund4') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[background4Src].texture); // TODO: Select texture from scene name
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });
        
    }
}

function getNextSceneName() {
    let lastScene = scenes[scenes.length-1];
    if(lastScene.name === 'hintergrund1')
        return 'hintergrund2';
    else if(lastScene.name === 'hintergrund2')
        return 'hintergrund3';
    else if(lastScene.name === 'hintergrund3')
        return 'hintergrund4';
    else if(lastScene.name === 'hintergrund4')
        return 'hintergrund1';
}


export { addResources, initScenes, updateScenes };