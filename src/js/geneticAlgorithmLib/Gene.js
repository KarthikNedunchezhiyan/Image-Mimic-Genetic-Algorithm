class GA_Gene {
    constructor(chromosomesLength, chromosomeRange, mutationRate, chromosomeRangeDecimal = false) {
        this._fitness = 0;
        this.chromosomesLength = chromosomesLength;
        this.mutationRate = mutationRate;
        this.chromosomeRange = chromosomeRange;
        this.chromosomeRangeDecimal = chromosomeRangeDecimal;
        this.chromosomes = [];
    }

    get fitness() {
        return this._fitness;
    }

    set fitness(value) {
        this._fitness = value;
    }

    getRandomChromosome() {
        let chromosome = this.chromosomeRange[0] + (Math.random() * (this.chromosomeRange[1] - this.chromosomeRange[0]));
        if (!this.chromosomeRangeDecimal)
            chromosome = Math.round(chromosome);
        return chromosome;
    }

    applyRandomChromosome() {
        this.chromosomes = [];
        for (let i = 0; i < this.chromosomesLength; i++)
            this.chromosomes.push(this.getRandomChromosome());
    }

    applyMutation(mutationRate, targetGene) {
        let matchCount = 0;
        mutationRate = (mutationRate !== undefined) ? mutationRate : this.mutationRate;
        for (let i = 0; i < this.chromosomesLength; i++) {
            if (Math.random() < mutationRate)
                this.chromosomes[i] = this.getRandomChromosome();

            if (targetGene.chromosomes[i] === this.chromosomes[i])
                matchCount++;
        }
        return (matchCount / this.chromosomesLength) * 100;
    }
}