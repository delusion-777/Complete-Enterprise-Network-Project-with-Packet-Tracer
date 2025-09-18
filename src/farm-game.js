// 1D Farm Game with realistic crop management
class FarmGame {
    constructor() {
        this.plots = [];
        this.plotCount = 10; // 1D row of 10 plots
        this.selectedTool = 'plant';
        this.selectedCrop = 'rice';
        this.waterLevel = 100;
        this.season = 'spring';
        this.gameTime = 0;
        
        this.crops = {
            rice: {
                name: 'Rice',
                emoji: '🌾',
                growthStages: ['🌱', '🌿', '🌾', '🌾'],
                growthTime: 12000, // 12 seconds
                waterNeed: 30,
                xpReward: 25,
                coinReward: 15,
                seasonPreference: ['monsoon', 'summer']
            },
            wheat: {
                name: 'Wheat',
                emoji: '🌽',
                growthStages: ['🌱', '🌿', '🌾', '🌽'],
                growthTime: 10000,
                waterNeed: 25,
                xpReward: 20,
                coinReward: 12,
                seasonPreference: ['winter', 'spring']
            },
            tomato: {
                name: 'Tomato',
                emoji: '🍅',
                growthStages: ['🌱', '🌿', '🟢', '🍅'],
                growthTime: 8000,
                waterNeed: 35,
                xpReward: 18,
                coinReward: 10,
                seasonPreference: ['summer', 'spring']
            },
            chili: {
                name: 'Chili',
                emoji: '🌶️',
                growthStages: ['🌱', '🌿', '🟢', '🌶️'],
                growthTime: 9000,
                waterNeed: 20,
                xpReward: 22,
                coinReward: 14,
                seasonPreference: ['summer', 'monsoon']
            },
            cotton: {
                name: 'Cotton',
                emoji: '🤍',
                growthStages: ['🌱', '🌿', '🌸', '🤍'],
                growthTime: 15000,
                waterNeed: 40,
                xpReward: 30,
                coinReward: 18,
                seasonPreference: ['summer', 'monsoon']
            },
            sugarcane: {
                name: 'Sugarcane',
                emoji: '🎋',
                growthStages: ['🌱', '🌿', '🎋', '🎋'],
                growthTime: 18000,
                waterNeed: 50,
                xpReward: 35,
                coinReward: 22,
                seasonPreference: ['monsoon', 'summer']
            }
        };
        
        this.seasons = {
            spring: { emoji: '🌸', duration: 20000 },
            summer: { emoji: '☀️', duration: 25000 },
            monsoon: { emoji: '🌧️', duration: 15000 },
            winter: { emoji: '❄️', duration: 20000 }
        };
        
        this.initializeFarm();
        this.startGameLoop();
        this.setupEventListeners();
    }
    
    initializeFarm() {
        const farmRow = document.getElementById('farmRow');
        farmRow.innerHTML = '';
        
        this.plots = [];
        
        for (let i = 0; i < this.plotCount; i++) {
            const plot = {
                id: i,
                state: 'empty', // empty, planted, growing, mature, ready
                crop: null,
                growthStage: 0,
                plantedTime: 0,
                lastWatered: 0,
                waterLevel: 0,
                health: 100
            };
            
            this.plots.push(plot);
            
            // Create plot element
            const plotElement = document.createElement('div');
            plotElement.className = 'farm-plot dry';
            plotElement.dataset.plotId = i;
            plotElement.innerHTML = '🟫'; // Empty soil
            plotElement.addEventListener('click', (e) => this.handlePlotClick(i));
            
            farmRow.appendChild(plotElement);
        }
    }
    
    setupEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedTool = e.target.onclick.toString().match(/selectTool\('(.+?)'\)/)[1];
                
                const cropSelector = document.getElementById('cropSelector');
                cropSelector.style.display = this.selectedTool === 'plant' ? 'block' : 'none';
            });
        });
        
        // Crop selection
        document.getElementById('selectedCrop').addEventListener('change', (e) => {
            this.selectedCrop = e.target.value;
        });
    }
    
    handlePlotClick(plotId) {
        const plot = this.plots[plotId];
        
        switch (this.selectedTool) {
            case 'plant':
                this.plantCrop(plotId);
                break;
            case 'water':
                this.waterCrop(plotId);
                break;
            case 'harvest':
                this.harvestCrop(plotId);
                break;
        }
    }
    
    plantCrop(plotId) {
        const plot = this.plots[plotId];
        
        if (plot.state !== 'empty') {
            showToast('Plot is not empty!', 'error');
            return;
        }
        
        const crop = this.crops[this.selectedCrop];
        
        // Check season preference
        let growthBonus = 1.0;
        if (crop.seasonPreference.includes(this.season)) {
            growthBonus = 1.3;
            showToast(`Perfect season for ${crop.name}! +30% growth bonus`, 'success');
        }
        
        plot.state = 'planted';
        plot.crop = this.selectedCrop;
        plot.growthStage = 0;
        plot.plantedTime = this.gameTime;
        plot.waterLevel = 20;
        plot.health = 100;
        plot.growthBonus = growthBonus;
        
        this.updatePlotDisplay(plotId);
        showToast(t('cropPlanted') || `${crop.name} planted!`, 'success');
        
        // Update stats
        this.updateStats('cropsPlanted', 1);
    }
    
    waterCrop(plotId) {
        const plot = this.plots[plotId];
        
        if (plot.state === 'empty') {
            showToast('No crop to water!', 'error');
            return;
        }
        
        if (this.waterLevel < 10) {
            showToast('Not enough water!', 'error');
            return;
        }
        
        const crop = this.crops[plot.crop];
        const waterAmount = Math.min(crop.waterNeed, this.waterLevel);
        
        plot.waterLevel = Math.min(100, plot.waterLevel + waterAmount);
        plot.lastWatered = this.gameTime;
        this.waterLevel -= waterAmount;
        
        this.updatePlotDisplay(plotId);
        this.updateWaterDisplay();
        
        showToast(t('cropWatered') || 'Crop watered!', 'success');
    }
    
    harvestCrop(plotId) {
        const plot = this.plots[plotId];
        
        if (plot.state !== 'ready') {
            showToast('Crop is not ready for harvest!', 'error');
            return;
        }
        
        const crop = this.crops[plot.crop];
        
        // Calculate rewards based on health and weather
        const weatherEffect = weatherSystem ? weatherSystem.getWeatherEffect() : { growthMultiplier: 1.0 };
        const healthMultiplier = plot.health / 100;
        const seasonMultiplier = crop.seasonPreference.includes(this.season) ? 1.2 : 1.0;
        
        const xpEarned = Math.round(crop.xpReward * healthMultiplier * seasonMultiplier);
        const coinsEarned = Math.round(crop.coinReward * healthMultiplier * seasonMultiplier);
        
        // Reset plot
        plot.state = 'empty';
        plot.crop = null;
        plot.growthStage = 0;
        plot.waterLevel = 0;
        plot.health = 100;
        
        this.updatePlotDisplay(plotId);
        
        // Award rewards
        updatePlayerStats(xpEarned, coinsEarned);
        
        showToast(
            `${t('cropHarvested') || 'Harvested'} ${crop.name}! +${xpEarned} XP, +${coinsEarned} coins`,
            'success'
        );
        
        // Update stats
        this.updateStats('cropsHarvested', 1);
        this.updateStats('totalXP', xpEarned);
    }
    
    updatePlotDisplay(plotId) {
        const plot = this.plots[plotId];
        const plotElement = document.querySelector(`[data-plot-id="${plotId}"]`);
        
        // Update plot appearance
        plotElement.className = 'farm-plot';
        
        switch (plot.state) {
            case 'empty':
                plotElement.classList.add('dry');
                plotElement.innerHTML = '🟫';
                break;
                
            case 'planted':
            case 'growing':
                plotElement.classList.add(plot.waterLevel > 50 ? 'watered' : 'dry');
                const crop = this.crops[plot.crop];
                const stageIndex = Math.min(plot.growthStage, crop.growthStages.length - 1);
                plotElement.innerHTML = crop.growthStages[stageIndex];
                
                // Add water indicator if recently watered
                if (this.gameTime - plot.lastWatered < 3000 && plot.waterLevel > 30) {
                    plotElement.innerHTML += '<div class="water-indicator">💧</div>';
                }
                break;
                
            case 'ready':
                plotElement.classList.add('ready');
                const readyCrop = this.crops[plot.crop];
                plotElement.innerHTML = readyCrop.growthStages[readyCrop.growthStages.length - 1];
                break;
        }
        
        // Health indicator
        if (plot.health < 70 && plot.state !== 'empty') {
            plotElement.style.filter = 'brightness(0.7)';
        } else {
            plotElement.style.filter = 'brightness(1)';
        }
    }
    
    startGameLoop() {
        setInterval(() => {
            this.gameTime += 100;
            this.updateCrops();
            this.updateSeason();
            this.regenerateWater();
        }, 100);
    }
    
    updateCrops() {
        this.plots.forEach((plot, index) => {
            if (plot.state === 'planted' || plot.state === 'growing') {
                const crop = this.crops[plot.crop];
                const timeSincePlanted = this.gameTime - plot.plantedTime;
                
                // Calculate growth progress
                let growthTime = crop.growthTime;
                
                // Apply bonuses
                if (plot.growthBonus) {
                    growthTime /= plot.growthBonus;
                }
                
                // Weather effects
                if (weatherSystem) {
                    const weatherEffect = weatherSystem.getWeatherEffect();
                    growthTime /= weatherEffect.growthMultiplier;
                    
                    // Weather affects water consumption
                    if (this.gameTime % 1000 === 0) { // Every second
                        plot.waterLevel -= weatherEffect.waterConsumption;
                    }
                }
                
                // Water affects growth
                const waterMultiplier = plot.waterLevel > 50 ? 1.2 : (plot.waterLevel > 20 ? 1.0 : 0.7);
                growthTime /= waterMultiplier;
                
                // Update growth stage
                const expectedStage = Math.floor((timeSincePlanted / growthTime) * crop.growthStages.length);
                const newStage = Math.min(expectedStage, crop.growthStages.length - 1);
                
                if (newStage > plot.growthStage) {
                    plot.growthStage = newStage;
                    plot.state = newStage === crop.growthStages.length - 1 ? 'ready' : 'growing';
                    this.updatePlotDisplay(index);
                    
                    if (plot.state === 'ready') {
                        showToast(`${crop.name} is ready for harvest!`, 'success');
                    }
                }
                
                // Water evaporation
                if (this.gameTime % 2000 === 0) { // Every 2 seconds
                    plot.waterLevel = Math.max(0, plot.waterLevel - 5);
                }
                
                // Health degradation due to lack of water
                if (plot.waterLevel < 20) {
                    plot.health = Math.max(0, plot.health - 0.5);
                } else if (plot.waterLevel > 60 && plot.health < 100) {
                    plot.health = Math.min(100, plot.health + 0.2);
                }
                
                this.updatePlotDisplay(index);
            }
        });
    }
    
    updateSeason() {
        const seasonOrder = ['spring', 'summer', 'monsoon', 'winter'];
        const currentSeasonIndex = seasonOrder.indexOf(this.season);
        const seasonDuration = this.seasons[this.season].duration;
        
        if (this.gameTime % seasonDuration === 0 && this.gameTime > 0) {
            const nextSeasonIndex = (currentSeasonIndex + 1) % seasonOrder.length;
            this.season = seasonOrder[nextSeasonIndex];
            
            document.getElementById('currentSeason').textContent = t(this.season) || this.season;
            document.getElementById('seasonIcon').textContent = this.seasons[this.season].emoji;
            
            showToast(`Season changed to ${t(this.season) || this.season}!`, 'info');
        }
    }
    
    regenerateWater() {
        // Natural water regeneration
        if (this.gameTime % 1000 === 0) { // Every second
            this.waterLevel = Math.min(100, this.waterLevel + 1);
            
            // Rain provides extra water
            if (weatherSystem && (weatherSystem.getCurrentWeather() === 'rainy' || weatherSystem.getCurrentWeather() === 'storm')) {
                this.waterLevel = Math.min(100, this.waterLevel + 5);
            }
            
            this.updateWaterDisplay();
        }
    }
    
    updateWaterDisplay() {
        const waterProgress = document.getElementById('waterProgress');
        const waterPercentage = document.getElementById('waterPercentage');
        
        if (waterProgress) {
            waterProgress.style.width = `${this.waterLevel}%`;
        }
        
        if (waterPercentage) {
            waterPercentage.textContent = `${Math.round(this.waterLevel)}%`;
        }
    }
    
    updateStats(statName, value) {
        const stats = JSON.parse(localStorage.getItem('farmStats') || '{}');
        stats[statName] = (stats[statName] || 0) + value;
        localStorage.setItem('farmStats', JSON.stringify(stats));
        
        // Update display
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        const stats = JSON.parse(localStorage.getItem('farmStats') || '{}');
        
        const elements = {
            totalCrops: document.getElementById('totalCrops'),
            waterUsed: document.getElementById('waterUsed'),
            experiencePoints: document.getElementById('experiencePoints')
        };
        
        if (elements.totalCrops) {
            elements.totalCrops.textContent = stats.cropsHarvested || 0;
        }
        
        if (elements.waterUsed) {
            elements.waterUsed.textContent = `${stats.waterUsed || 0}L`;
        }
        
        if (elements.experiencePoints) {
            elements.experiencePoints.textContent = stats.totalXP || 0;
        }
    }
}

// Tool selection functions
function selectTool(tool) {
    if (window.farmGame) {
        window.farmGame.selectedTool = tool;
        
        const cropSelector = document.getElementById('cropSelector');
        cropSelector.style.display = tool === 'plant' ? 'block' : 'none';
    }
}

function updateCropSelection() {
    if (window.farmGame) {
        const select = document.getElementById('selectedCrop');
        window.farmGame.selectedCrop = select.value;
    }
}

// Initialize farm game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('farmRow')) {
        window.farmGame = new FarmGame();
    }
});