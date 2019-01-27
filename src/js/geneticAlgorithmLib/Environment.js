class Environment{
    constructor(populationLength,selectionCount,chromosomesLength,chromosomeRange,mutationRate,chromosomeRangeDecimal=false){
        this.populationLength = populationLength;
        this.population = [];
        this._generation = 0;
        this._active = true;
        this.selectionCount = selectionCount;
        this._targetGene = null;
        this.chromosomesLength = chromosomesLength;
        this.chromosomeRange = chromosomeRange;
        this.mutationRate = mutationRate;
        this.chromosomeRangeDecimal = chromosomeRangeDecimal;
    }

    isActive(){
        return this._active;
    }

    get targetGene() {
        return this._targetGene;
    }

    set targetGene(value) {
        this._targetGene = value;
    }

    getBestChromosome(){
        return this.population[0].chromosomes;
    }

    getNewGene(){
        return new GA_Gene(this.chromosomesLength,this.chromosomeRange,this.mutationRate,this.chromosomeRangeDecimal);
    }

    randomPopulateAll(){
        this.population = [];
        for(let i=0;i<this.populationLength;i++){
            let gene = this.getNewGene();
            gene.applyRandomChromosome();
            gene.fitness = gene.applyMutation(undefined,this._targetGene);
            this.population.push(gene);
        }
    }

    sortPopulation(){
        this.population.sort((gene1,gene2)=>{
            return (gene1.fitness<gene2.fitness)?1:(gene1.fitness===gene2.fitness)?0:-1;
        });
    }

    populateAll(){
        this._generation++;
        let topPerformers = this.population.slice(0,this.selectionCount);
        let population = [];
        for(let i=this.selectionCount;i<this.populationLength;i++){
            let parent1 = topPerformers[Math.round(Math.random()*(this.selectionCount-1))];
            let parent2 = topPerformers[Math.round(Math.random()*(this.selectionCount-1))];

            let mid = Math.round(Math.random()*(this.chromosomesLength)/2);
            let half1 = parent1.chromosomes.slice(0,mid);
            let half2 = parent2.chromosomes.slice(mid,this.chromosomesLength);
            let newGene = this.getNewGene();
            newGene.chromosomes = (Math.random()<0.5)?half1.concat(half2):half2.concat(half1);
            newGene.fitness = newGene.applyMutation(undefined,this._targetGene);
            population.push(newGene);
        }

        this.population = topPerformers.concat(population);
    }
}