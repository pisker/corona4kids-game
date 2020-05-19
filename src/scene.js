import mountainBackgroundSrc from './media/scenes/mountain/background.png';
import campingBackgroundSrc from './media/scenes/camping/background.png';
import seaBackground0Src from './media/scenes/sea/background0.png';
import seaBackground1Src from './media/scenes/sea/background1.png';
import seaWave0Src from './media/scenes/sea/wave0.png';
import seaWave1Src from './media/scenes/sea/wave1.png';
import farmBackgroundSrc from './media/scenes/farm/background.png';
import windmillSrc from './media/windmill.png';
import { whaleSrcs } from './animations.js';
//import {lib} from './media/scenes/camping/campfire.js'

import 'pixi.js'
//import 'pixi-animate';

var pixiContainer;
var pixiLoaderResources;
var pixiRenderer;
var scenes = [];

function addResources(app, loader) {
    loader.add(mountainBackgroundSrc);
    loader.add(campingBackgroundSrc);
    loader.add(seaBackground0Src);
    loader.add(seaBackground1Src);
    loader.add(seaWave0Src);
    loader.add(seaWave1Src);
    loader.add(farmBackgroundSrc);
    loader.add(windmillSrc);
    whaleSrcs.forEach(src => loader.add(src ));
}
function initScenes(container, app) {
    pixiContainer = container;
    pixiLoaderResources = app.loader.resources;
    pixiRenderer = app.renderer;

    createScene('camping'); // create first scene, others are added in updateScenes()
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
        sceneContainer.x = lastScene.container.x + lastScene.width - 1;
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
        case 'mountain':
            scene.windmillSprite1.rotation += 0.01 * delta;
            scene.windmillSprite2.rotation += 0.01 * delta;
            scene.windmillSprite3.rotation += 0.01 * delta;
            break;
        case 'hintergrund2':
            scene.windmillSprite1.rotation += 0.01 * delta;
            break;
        case 'sea':
            scene.wave0Sprite.position.x = Math.sin(Date.now() / 2000) * scene.width * 0.01;
            scene.wave1Sprite.position.y = Math.sin(-Date.now() / 500) * scene.width * 0.001;
            //   scene.whaleSprite.update();
            break;
        default:
            break;
    }
}

function buildScene(scene) {
    if (scene.name === 'alt') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[background1Src].texture); 
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });
    } else if (scene.name === 'windrad') {
        let backgroundSprite = new PIXI.Sprite(pixiLoaderResources[background2Src].texture);
        scene.width = backgroundSprite.width;
        scene.container.addChild(backgroundSprite);

        let windmillSprite = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite.anchor.set(109/windmillSprite.width, 78/windmillSprite.height);
        windmillSprite.position.set(108, 423);
        scene.container.addChild(windmillSprite);

        Object.assign(scene, { backgroundSprite: backgroundSprite, windmillSprite: windmillSprite });
    } else if(scene.name === 'mountain') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[mountainBackgroundSrc].texture);
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

    } else if(scene.name === 'camping') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[campingBackgroundSrc].texture); 
        scene.container.addChild(sprite);
        scene.width = sprite.width;

        let windmillSprite1 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
        windmillSprite1.anchor.set(109/windmillSprite1.width, 78/windmillSprite1.height);
        windmillSprite1.position.set(185, 242);
        windmillSprite1.scale.set(0.7);
        scene.container.addChild(windmillSprite1);

        //let campfire = new lib.campfire();

        Object.assign(scene, { backgroundSprite: sprite, windmillSprite1: windmillSprite1 });
        
    } else if(scene.name === 'sea') {
        let background0Sprite = new PIXI.Sprite(pixiLoaderResources[seaBackground0Src].texture);
        let background1Sprite = new PIXI.Sprite(pixiLoaderResources[seaBackground1Src].texture);
        let wave0Sprite = new PIXI.Sprite(pixiLoaderResources[seaWave0Src].texture);
        let wave1Sprite = new PIXI.Sprite(pixiLoaderResources[seaWave1Src].texture);
        let whaleTextures = [];
        whaleSrcs.forEach(src => {
            let texture = pixiLoaderResources[src].texture;
            whaleTextures.push(texture);
        });

        let whaleSprite = new PIXI.AnimatedSprite(whaleTextures);
        whaleSprite.loop = true;  
        whaleSprite.position.set(500, 200) 
        whaleSprite.animationSpeed = 0.2;  
        whaleSprite.gotoAndPlay(0);
        scene.container.addChild(background0Sprite);
        scene.container.addChild(wave0Sprite);
        scene.container.addChild(whaleSprite);
        scene.container.addChild(wave1Sprite);
        scene.container.addChild(background1Sprite);


        scene.width = background1Sprite.width;
        Object.assign(scene, { background0Sprite: background0Sprite, background1Sprite: background1Sprite, wave0Sprite: wave0Sprite, wave1Sprite: wave1Sprite, whaleSprite: whaleSprite });
        
    } else if(scene.name === 'farm') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[farmBackgroundSrc].texture); 
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });
        
    }
}

function getNextSceneName() {
    let lastScene = scenes[scenes.length-1];
    if(lastScene.name === 'mountain')
        return 'camping';
    else if(lastScene.name === 'camping')
        return 'sea';
    else if(lastScene.name === 'sea')
        return 'farm';
    else if(lastScene.name === 'farm')
        return 'mountain';
}


export { addResources, initScenes, updateScenes };