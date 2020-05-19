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

import 'pixi.js';
import "pixi-plugin-bump";

var items = [];

var itemsContainer;
var pixiRenderer;
var pixiLoaderResources;
var playerSprite;

var addLifeFunc, removeLifeFunc, addScoreFunc;

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
}

function initItems(container, app, player, addLife, removeLife, addScore) {
    itemsContainer = container;
    pixiRenderer = app.renderer;
    pixiLoaderResources = app.loader.resources;
    playerSprite = player;
    addLifeFunc = addLife;
    removeLifeFunc = removeLife;
    addScoreFunc = addScore;
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
            if (item.sprite.x < -100 || collideItem(item)) {
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

function collideItem(item) {
    let b = new PIXI.extras.Bump.Bump();
    let collide = b.hit(playerSprite, item.sprite);

    if (collide) {
        if (item.name === 'corona')
            removeLifeFunc();
        else if (item.name === 'mask')
            addScoreFunc();
        else if (item.name === 'soap')
            addLifeFunc();
    }
    return collide;
}

function updateItem(delta, item) {
    item.sprite.x -= delta * 5;
}

function addItem(name) {
    let sprite = new PIXI.Sprite();
    switch (name) {
        case 'corona':
            sprite.texture = pixiLoaderResources[corona1Src].texture;
            sprite.scale.set(0.25);
            break;
        case 'mask':
            sprite.texture = pixiLoaderResources[mask1Src].texture;
            sprite.scale.set(0.2);
            break;
        case 'soap':
            sprite.texture = pixiLoaderResources[soap1Src].texture;
            sprite.scale.set(0.2);
            break;
    }
    let lastItem = null;
    items.forEach(item => {
        if (item.name === name)
            lastItem = item;
    });

    let offsetX = (lastItem === null) ? 300 : lastItem.sprite.x;
    sprite.x = offsetX + Math.random() * 2000;
    sprite.y = Math.random() * pixiRenderer.height;

    itemsContainer.addChild(sprite);
    let obj = { sprite: sprite, name: name };
    items.push(obj);
}

export { addResources, initItems, updateItems };