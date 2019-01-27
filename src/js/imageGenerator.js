class ImageGenerator {
    constructor(imageWidth, imageHeight, threshold=4) {
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.threshold = threshold;
    }

    constructImage(pixelMatrix,targetCanvas) {
        let img = targetCanvas.createImage(230, 230);
        img.loadPixels();
        for (let i = 0; i < this.imageHeight; i++)
            for (let j = 0; j < this.imageWidth; j++)
                img.set(j, i, this.convertPixel2Dto3D(i,j,this.getImagePixel(i,j,pixelMatrix)));
        img.updatePixels();
        return img;
    }

    convertPixel2Dto3D(i,j,count) {
        switch(count){
            case 0:
                return [255, 87, 51 ,255];
            case 1:
                return [ 255, 195, 0 ,255];
            case 2:
                return [ 0, 255, 0 ,255];
            case 3:
                return [ 0, 0 , 255 ,255];
            default:
                console.log("cvt error! "+count+" "+i+" "+j);
        }
    }

    getImagePixel(i,j,pixelMatrix){
        return pixelMatrix[(i * this.imageHeight) + j];
    }

    setImagePixel(i,j,pixelMatrix,value){
        pixelMatrix[(i * this.imageHeight) + j] = value;
    }

    alterSurrounding(i,j,pixelMatrix,value=1){
        if(i>=this.imageHeight || j>=this.imageWidth || i<0 || j<0)
            return;
        this.setImagePixel(i,j,pixelMatrix,this.getImagePixel(i,j,pixelMatrix)+value);
    }

    constructNewDesign(i,j,pixelMatrix){
        if(i>=this.imageHeight || j>=this.imageWidth || i<0 || j<0 || this.getImagePixel(i,j,pixelMatrix)<this.threshold)
            return;
        this.setImagePixel(i,j,pixelMatrix,this.getImagePixel(i,j,pixelMatrix)-this.threshold);
        this.alterSurrounding(i+1,j,pixelMatrix);
        this.alterSurrounding(i,j+1,pixelMatrix);
        this.alterSurrounding(i-1,j,pixelMatrix);
        this.alterSurrounding(i,j-1,pixelMatrix);

        this.constructNewDesign(i+1,j,pixelMatrix);
        this.constructNewDesign(i,j+1,pixelMatrix);
        this.constructNewDesign(i-1,j,pixelMatrix);
        this.constructNewDesign(i,j-1,pixelMatrix);
    }
}