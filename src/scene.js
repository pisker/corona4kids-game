import mountainBackgroundSrc0 from './media/scenes/mountain/backgroundTile0.png';
import mountainBackgroundSrc1 from './media/scenes/mountain/backgroundTile1.png';
import mountainBackgroundSrc2 from './media/scenes/mountain/backgroundTile2.png';
import mountainBackgroundSrc3 from './media/scenes/mountain/backgroundTile3.png';
import mountainBackgroundSrc4 from './media/scenes/mountain/backgroundTile4.png';
import mountainBackgroundSrc5 from './media/scenes/mountain/backgroundTile5.png';
import mountainBackgroundSrc6 from './media/scenes/mountain/backgroundTile6.png';

import campingBackgroundSrc0 from './media/scenes/camping/backgroundTile0.png';
import campingBackgroundSrc1 from './media/scenes/camping/backgroundTile1.png';
import campingBackgroundSrc2 from './media/scenes/camping/backgroundTile2.png';
import campingBackgroundSrc3 from './media/scenes/camping/backgroundTile3.png';
import campingBackgroundSrc4 from './media/scenes/camping/backgroundTile4.png';
import campingBackgroundSrc5 from './media/scenes/camping/backgroundTile5.png';
import campingBackgroundSrc6 from './media/scenes/camping/backgroundTile6.png';

import seaBackgroundSrc0 from './media/scenes/sea/backgroundTile0.png';
import seaBackgroundSrc1 from './media/scenes/sea/backgroundTile1.png';
import seaBackgroundSrc2 from './media/scenes/sea/backgroundTile2.png';
import seaBackgroundSrc3 from './media/scenes/sea/backgroundTile3.png';
import seaBackgroundSrc4 from './media/scenes/sea/backgroundTile4.png';
import seaBackgroundSrc5 from './media/scenes/sea/backgroundTile5.png';
import seaBackgroundSrc6 from './media/scenes/sea/backgroundTile6.png';

import farmBackgroundSrc0 from './media/scenes/farm/backgroundTile0.png';
import farmBackgroundSrc1 from './media/scenes/farm/backgroundTile1.png';
import farmBackgroundSrc2 from './media/scenes/farm/backgroundTile2.png';
import farmBackgroundSrc3 from './media/scenes/farm/backgroundTile3.png';
import farmBackgroundSrc4 from './media/scenes/farm/backgroundTile4.png';
import farmBackgroundSrc5 from './media/scenes/farm/backgroundTile5.png';
import farmBackgroundSrc6 from './media/scenes/farm/backgroundTile6.png';

import windmillSrc from './media/windmill.png';

import 'pixi.js'

const mountainBackgroundSrcs = [
    mountainBackgroundSrc0, mountainBackgroundSrc1, 
    mountainBackgroundSrc2, mountainBackgroundSrc3, 
    mountainBackgroundSrc4, mountainBackgroundSrc5,
    mountainBackgroundSrc6];

const campingBackgroundSrcs = [
    campingBackgroundSrc0, campingBackgroundSrc1, 
    campingBackgroundSrc2, campingBackgroundSrc3, 
    campingBackgroundSrc4, campingBackgroundSrc5,
    campingBackgroundSrc6];

const seaBackgroundSrcs = [
    seaBackgroundSrc0, seaBackgroundSrc1, 
    seaBackgroundSrc2, seaBackgroundSrc3, 
    seaBackgroundSrc4, seaBackgroundSrc5,
    seaBackgroundSrc6];
    
const farmBackgroundSrcs = [
    farmBackgroundSrc0, farmBackgroundSrc1, 
    farmBackgroundSrc2, farmBackgroundSrc3, 
    farmBackgroundSrc4, farmBackgroundSrc5,
    farmBackgroundSrc6];
    

var pixiContainer;
var pixiLoaderResources;
var pixiRenderer;
var scenes = [];

function addResources(app, loader) {
    mountainBackgroundSrcs.forEach(src => loader.add(src));
    campingBackgroundSrcs.forEach(src => loader.add(src));
    seaBackgroundSrcs.forEach(src => loader.add(src));
    farmBackgroundSrcs.forEach(src => loader.add(src));
    loader.add(windmillSrc);
}
function initScenes(container, app) {
    pixiContainer = container;
    pixiLoaderResources = app.loader.resources;
    pixiRenderer = app.renderer;

    createScene('camping', 0); // create first scene, others are added in updateScenes()
}

function updateScenes(delta) {
    // add scene(s) as long as last scene is not completely filling the screen
    let lastScene = scenes[scenes.length-1];
    while((lastScene.container.x+lastScene.width)*pixiContainer.scale.x<=pixiRenderer.width + 100) {
        if(lastScene.tile < 6)
            createScene(lastScene.name, lastScene.tile + 1);
        else
            createScene(getNextSceneName(), 0);
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

function createScene(name, tile) {
    console.log('create scene %s tile %d', name, tile);
    let sceneContainer = new PIXI.Container();
    if (scenes.length === 0) {
        sceneContainer.x = 0;
    } else {
        let lastScene = scenes[scenes.length - 1];
        sceneContainer.x = lastScene.container.x + lastScene.width - 1;
    }

    let scene = {
        name: name,
        tile: tile,
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
        case 'camping':
            if(scene.tile === 0)
                scene.windmillSprite1.rotation += 0.01 * delta;
            break;
        case 'mountain':
            if(scene.tile === 5) {
                scene.windmillSprite1.rotation += 0.01 * delta;
                scene.windmillSprite2.rotation += 0.01 * delta;
            } else if(scene.tile === 6)
                scene.windmillSprite3.rotation += 0.01 * delta;
            break;
        case 'sea':
            //scene.wave0Sprite.position.x = Math.sin(Date.now() / 2000) * scene.width * 0.01;
            //scene.wave1Sprite.position.y = Math.sin(-Date.now() / 500) * scene.width * 0.001;
            //   scene.whaleSprite.update();
            break;
        default:
            break;
    }
}

function buildScene(scene) {
    if(scene.name === 'mountain') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[mountainBackgroundSrcs[scene.tile]].texture);
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite });

        if(scene.tile === 5) {
            let windmillSprite1 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
            windmillSprite1.anchor.set(109/windmillSprite1.width, 78/windmillSprite1.height);
            windmillSprite1.position.set(592, 913);
            windmillSprite1.scale.set(0.7);
            scene.container.addChild(windmillSprite1);
    
            let windmillSprite2 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
            windmillSprite2.anchor.set(109/windmillSprite2.width, 78/windmillSprite2.height);
            windmillSprite2.position.set(858, 334);
            scene.container.addChild(windmillSprite2);
            Object.assign(scene, { windmillSprite1: windmillSprite1, windmillSprite2: windmillSprite2 });
        } else if(scene.tile === 6) {
            let windmillSprite3 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
            windmillSprite3.anchor.set(109/windmillSprite3.width, 78/windmillSprite3.height);
            windmillSprite3.position.set(59, 300);
            windmillSprite3.scale.set(0.3);
            scene.container.addChild(windmillSprite3);
            Object.assign(scene, { windmillSprite3: windmillSprite3 });
        }


    } else if(scene.name === 'camping') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[campingBackgroundSrcs[scene.tile]].texture); 
        scene.container.addChild(sprite);
        scene.width = sprite.width;
        Object.assign(scene, { backgroundSprite: sprite});

        if(scene.tile === 0) {
            let windmillSprite1 = new PIXI.Sprite(pixiLoaderResources[windmillSrc].texture);
            windmillSprite1.anchor.set(109/windmillSprite1.width, 78/windmillSprite1.height);
            windmillSprite1.position.set(159, 274);
            windmillSprite1.scale.set(0.7);
            scene.container.addChild(windmillSprite1);
            Object.assign(scene, { windmillSprite1: windmillSprite1 });
    
        }
        
    } else if(scene.name === 'sea') {
        let backgroundSprite = new PIXI.Sprite(pixiLoaderResources[seaBackgroundSrcs[scene.tile]].texture);
        scene.container.addChild(backgroundSprite);
        scene.width = backgroundSprite.width;

        Object.assign(scene, { backgroundSprite: backgroundSprite });
        
    } else if(scene.name === 'farm') {
        let sprite = new PIXI.Sprite(pixiLoaderResources[farmBackgroundSrcs[scene.tile]].texture); 
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