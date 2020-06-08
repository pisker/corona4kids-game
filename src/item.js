import mask1Src from './media/mask1.png';
import mask2Src from './media/mask2.png';
import mask3Src from './media/mask3.png';
import mask4Src from './media/mask4.png';
import mask5Src from './media/mask5.png';
import soap1Src from './media/soap1.png';
import soap2Src from './media/soap2.png';
import soap3Src from './media/soap3.png';
import corona1Src from './media/corona1.png';
import corona2Src from './media/corona2.png';
import corona3Src from './media/corona3.png';
import corona4Src from './media/corona4.png';
import corona5Src from './media/corona5.png';
import corona6Src from './media/corona6.png';

import 'pixi.js';

var maskSrcs = [ mask1Src, mask2Src, mask3Src, mask4Src, mask5Src ];
var soapSrcs = [ soap1Src, soap2Src, soap3Src];
var coronaSrcs = [ corona1Src, corona2Src, corona3Src, corona4Src, corona5Src, corona6Src];

var items = [];

var itemsContainer;
var pixiRenderer;
var pixiLoaderResources;
var playerSprite;

var addLifeFunc, removeLifeFunc, addScoreFunc;
var itemScale;

function addResources(loader) {
    loader.add(mask1Src);
    loader.add(mask2Src);
    loader.add(mask3Src);
    loader.add(mask4Src);
    loader.add(mask5Src);
    loader.add(soap1Src);
    loader.add(soap2Src);
    loader.add(soap3Src);
    loader.add(corona1Src);
    loader.add(corona2Src);
    loader.add(corona3Src);
    loader.add(corona4Src);
    loader.add(corona5Src);
    loader.add(corona6Src);
}

function initItems(container, app, player, addLife, removeLife, addScore, scale) {
    itemsContainer = container;
    pixiRenderer = app.renderer;
    pixiLoaderResources = app.loader.resources;
    playerSprite = player;
    addLifeFunc = addLife;
    removeLifeFunc = removeLife;
    addScoreFunc = addScore;
    itemScale = scale;
}

function updateItems(delta) {
    updateItemsWithName(delta, 'corona');
    updateItemsWithName(delta, 'mask');
    updateItemsWithName(delta, 'soap');
}

function updateItemsWithName(delta, name) {
    let lastItem = null;
    let toBeDeleted = [];
    items.forEach(item => {
        if (item.name === name) {
            updateItem(delta, item);
            if (item.sprite.x + item.sprite.width < -100 || collideItem(item, delta)) {
                toBeDeleted.push(item);
            }

            else
                lastItem = item;
        }

    });

    toBeDeleted.forEach(item => {
        itemsContainer.removeChild(item.sprite);
        items = items.filter(i => i !== item);
    });

    while (lastItem === null || lastItem.sprite.x < pixiRenderer.width + 300) {
        addItem(name);
        lastItem = items[items.length - 1];
    }

}

function clearItems() {
    items.forEach(item => {
        itemsContainer.removeChild(item.sprite);
    });
    items = [];
}

function collideItem(item, delta) {
    let centerPoint = new PIXI.Point(playerSprite.position.x, playerSprite.position.y + 150* playerSprite.scale.y);
    let playerPos = playerSprite.parent.toGlobal(centerPoint); // player center point in screen px
    let itemPos = item.sprite.getGlobalPosition(); // item center point in screen px

    let x = playerPos.x - itemPos.x;
    let y = playerPos.y - itemPos.y;
    let distance = x*x+y*y; // squared distance player to item
    let collide = false;
    if (distance < 500*itemScale*itemScale) { // collide
        collide = true;
        if (item.name === 'corona')
            removeLifeFunc();
        else if (item.name === 'mask')
            addScoreFunc();
        else if (item.name === 'soap')
            addLifeFunc();
    } else if(distance < 3000*itemScale*itemScale) { // move item towards player
        let localCenterPoint = item.sprite.parent.toLocal(playerPos);
        let localDirectionVector = new PIXI.Point(localCenterPoint.x - item.sprite.x, localCenterPoint.y - item.sprite.y);
        let localDirectionVectorLength = Math.sqrt(localDirectionVector.x * localDirectionVector.x + localDirectionVector.y * localDirectionVector.y);
        item.sprite.x += localDirectionVector.x / localDirectionVectorLength * 10 * delta;
        item.sprite.y += localDirectionVector.y / localDirectionVectorLength * 10 * delta;
    }

    return collide;
}

function updateItem(delta, item) {
    item.sprite.x -= delta * 6;
}

function addItem(name) {
    let sprite = new PIXI.Sprite();
    let propability = 2000;
    let srcIndex;
    let elapsedSecs = (Date.now() - window.gameStart) / 1000;
    switch (name) {
        case 'corona':
            srcIndex = Math.floor(Math.random() * coronaSrcs.length);
            sprite.texture = pixiLoaderResources[coronaSrcs[srcIndex]].texture;
            sprite.scale.set(0.25 * itemScale);
            propability = 1000;
            break;
        case 'mask':
            srcIndex = Math.floor(Math.random() * maskSrcs.length);
            sprite.texture = pixiLoaderResources[maskSrcs[srcIndex]].texture;
            sprite.scale.set(0.15 * itemScale);
            propability  = 500;
            break;
        case 'soap':
            srcIndex = Math.floor(Math.random() * soapSrcs.length);
            sprite.texture = pixiLoaderResources[soapSrcs[srcIndex]].texture;
            sprite.scale.set(0.15 * itemScale);
            propability = 2500;
            break;
    }
    let lastItem = null;
    items.forEach(item => {
        if (item.name === name)
            lastItem = item;
    });

    if(lastItem === null) {
        console.log('add offset for item %s', name);
    }
    let offsetX = (lastItem === null) ? 500 : lastItem.sprite.x;
    sprite.x = offsetX + Math.random() * propability * itemScale;
    sprite.y = Math.random() * pixiRenderer.height;
    sprite.anchor.set(0.5);
    itemsContainer.addChild(sprite);
    let obj = { sprite: sprite, name: name };
    items.push(obj);
}

function setItemScale(scale) {
    itemScale = scale;
}

export { addResources, initItems, updateItems, clearItems, setItemScale };