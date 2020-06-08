// run this script from src-folder with 'node tools/tileBackgroundImage.js'
// this script slices the (big) background images to smaller slices, which can be handled by mobile devices
var PNG = require('pngjs').PNG;
var fs = require('fs');

var fileName = './media/scenes/sea/background';
var targetWidth = 1000;

var sourceImage = new PNG();
fs.createReadStream(fileName + '.png')
    .pipe(sourceImage)
    .on("parsed", function() {
        console.log('Source image is %d x %d px', this.width, this.height);
        let slicedWidth = 0;
        let i = 0;
        while(slicedWidth < this.width) {
            let tileImage = new PNG({width: Math.min(targetWidth, this.width - slicedWidth), height: this.height});
            this.bitblt(tileImage, slicedWidth, 0, tileImage.width, tileImage.height);
            tileImage.pack().pipe(fs.createWriteStream(fileName + 'Tile' + (i++) + '.png'));
            slicedWidth += tileImage.width;
            console.log('saved tile %d with width %d', i-1, tileImage.width);
        }
    });


