let img;

let dps = [{x: 0, y: 0}];
let chart = null;
let imgSize = 30;
let scaleValue = 5;
let targetImgPixelMat = [];
let initialHeapRange = [1100, 1550];
let initialHeap = Math.round(initialHeapRange[0] + Math.random() * (initialHeapRange[1] - initialHeapRange[0]));
let threshold = 4;
let gapBetweenImages = 5;
let canvasPadding = 10;
let populationLength = 10000;
let selectionCount = 2;
let chromosomesLength = imgSize * imgSize;
let chromosomeRange = [0, threshold - 1];
let mutationRate = 0.001;
let lastFitness = 0;
let ENVIRONMENT = new Environment(populationLength, selectionCount, chromosomesLength, chromosomeRange, mutationRate);

let newGene = ENVIRONMENT.getNewGene();

newGene.chromosomes = targetImgPixelMat;

ENVIRONMENT.targetGene = newGene;

let targetImageP5 = new p5();

window.onload = ()=>{
    let targetImageSketch = _ => {
        _.setup = () => {
            let canvas = _.createCanvas((((imgSize + (gapBetweenImages / 2)) * scaleValue) * 2) + canvasPadding, imgSize * scaleValue + canvasPadding);
            canvas.parent("targetImage");
            for (let i = 0; i < imgSize * imgSize; i++)
                targetImgPixelMat.push(0);
            let imid = Math.round(imgSize / 2);
            let jmid = Math.round(imgSize / 2);
            let imageGen = new ImageGenerator(imgSize, imgSize, threshold);
            imageGen.setImagePixel(imid, jmid, targetImgPixelMat, initialHeap);
            while (Math.max(...targetImgPixelMat) > imageGen.threshold) {
                for (let i = 0; i < imgSize; i++)
                    for (let j = 0; j < imgSize; j++) {
                        if (imageGen.getImagePixel(i, j, targetImgPixelMat) >= imageGen.threshold)
                            imageGen.constructNewDesign(imid, jmid, targetImgPixelMat);
                    }
            }
            img = imageGen.constructImage(targetImgPixelMat, targetImageP5);
            ENVIRONMENT.randomPopulateAll();
        };

        _.draw = () => {
            _.scale(scaleValue);
            // _.background(0);
            _.image(img, (canvasPadding / scaleValue) / 2, (canvasPadding / scaleValue) / 2);

            // _.frameRate(1);
            if (ENVIRONMENT.isActive()) {
                ENVIRONMENT.sortPopulation();
                let newImage = new ImageGenerator(imgSize, imgSize).constructImage(ENVIRONMENT.getBestChromosome(), targetImageP5);
                _.image(newImage, ((canvasPadding / scaleValue) / 2) + imgSize + gapBetweenImages, (canvasPadding / scaleValue) / 2);
                let topFitness = ENVIRONMENT.population[0].fitness.toFixed(3);
                if (parseFloat(document.getElementById("fitnessScore").innerText) > topFitness) {
                    alert("issue found!");
                }
                document.getElementById("fitnessScore").innerText = topFitness;
                document.getElementById("fitnessScoreBar").style.width = `${topFitness}%`;
                document.getElementById("growthRate").innerText = (topFitness - lastFitness).toFixed(3);
                lastFitness = topFitness;
                if (chart !== null && ENVIRONMENT._generation % 3 === 0) {
                    dps.push({
                        x: ENVIRONMENT._generation,
                        y: Math.round(topFitness)
                    });
                    chart.render();
                }
                if (topFitness >= 100) {
                    _.noLoop();
                }
                ENVIRONMENT.populateAll();
            }
        };
    };


    chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Generation Vs Fitness"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    chart.render();

    targetImageP5 = new p5(targetImageSketch);
};