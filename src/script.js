// Main JavaScript file for Kishan Mitra application
class KishanMitraApp {
    constructor() {
        this.playerStats = {
            level: 1,
            experience: 0,
            coins: 100,
            completedChallenges: 0,
            achievements: []
        };
        
        this.challenges = [
            {
                id: 'first-crop',
                title: 'First Harvest',
                description: 'Plant and harvest your first crop successfully',
                difficulty: 'easy',
                xpReward: 50,
                coinReward: 25,
                completed: false
            },
            {
                id: 'water-conservation',
                title: 'Water Conservation Master',
                description: 'Complete a full crop cycle using less than 200L water',
                difficulty: 'medium',
                xpReward: 100,
                coinReward: 50,
                completed: false
            },
            {
                id: 'organic-farmer',
                title: 'Organic Farming Expert',
                description: 'Grow 5 crops using only bio-fertilizers',
                difficulty: 'medium',
                xpReward: 150,
                coinReward: 75,
                completed: false
            },
            {
                id: 'weather-master',
                title: 'Weather Master',
                description: 'Successfully harvest crops in all 4 seasons',
                difficulty: 'hard',
                xpReward: 200,
                coinReward: 100,
                completed: false
            },
            {
                id: 'government-schemes',
                title: 'Government Scheme Beneficiary',
                description: 'Purchase 3 items using government subsidies',
                difficulty: 'medium',
                xpReward: 120,
                coinReward: 60,
                completed: false
            },
            {
                id: 'sustainable-farming',
                title: 'Sustainable Farming Champion',
                description: 'Maintain 90%+ crop health for 10 consecutive harvests',
                difficulty: 'hard',
                xpReward: 300,
                coinReward: 150,
                completed: false
            }
        ];
        
        this.currentTab = 'dashboard';
        this.loadPlayerData();
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.updatePlayerDisplay();
        this.displayChallenges();
        this.displayAchievements();
        this.updateDashboardStats();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabValue = e.currentTarget.onclick.toString().match(/showTab\('(.+?)'\)/)[1];
                this.showTab(tabValue);
            });
        });
        
        // Language selector
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                changeLanguage(e.target.value);
            });
        }
    }
    
    showTab(tabName) {
        this.currentTab = tabName;
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Reinitialize components if needed
        if (tabName === 'farm-game' && !window.farmGame) {
            setTimeout(() => {
                window.farmGame = new FarmGame();
            }, 100);
        }
        
        if (tabName === 'store' && !window.store) {
            setTimeout(() => {
                window.store = new KishanMitraStore();
            }, 100);
        }
    }
    
    loadPlayerData() {
        const savedData = localStorage.getItem('kishanMitraPlayerData');
        if (savedData) {
            this.playerStats = { ...this.playerStats, ...JSON.parse(savedData) };
        }
        
        const savedChallenges = localStorage.getItem('kishanMitraCompletedChallenges');
        if (savedChallenges) {
            const completedIds = JSON.parse(savedChallenges);
            this.challenges.forEach(challenge => {
                if (completedIds.includes(challenge.id)) {
                    challenge.completed = true;
                }
            });
        }
    }
    
    savePlayerData() {
        localStorage.setItem('kishanMitraPlayerData', JSON.stringify(this.playerStats));
        
        const completedChallenges = this.challenges
            .filter(c => c.completed)
            .map(c => c.id);
        localStorage.setItem('kishanMitraCompletedChallenges', JSON.stringify(completedChallenges));
    }
    
    updatePlayerDisplay() {
        const levelElement = document.getElementById('playerLevel');
        const coinsElement = document.getElementById('playerCoins');
        
        if (levelElement) {
            levelElement.textContent = this.playerStats.level;
        }
        
        if (coinsElement) {
            coinsElement.textContent = this.playerStats.coins;
        }
        
        // Update store coins if store exists
        if (window.store) {
            window.store.playerCoins = this.playerStats.coins;
            window.store.updateCoinsDisplay();
        }
    }
    
    updatePlayerStats(xp, coins) {
        this.playerStats.experience += xp;
        this.playerStats.coins += coins;
        
        // Check for level up
        const oldLevel = this.playerStats.level;
        this.playerStats.level = Math.floor(this.playerStats.experience / 1000) + 1;
        
        if (this.playerStats.level > oldLevel) {
            this.addAchievement(`Level ${this.playerStats.level} Farmer`);
            showToast(`${t('levelUp') || 'Level Up!'} ${t('level')} ${this.playerStats.level}!`, 'success');
        }
        
        this.updatePlayerDisplay();
        this.savePlayerData();
    }
    
    addAchievement(achievementName) {
        if (!this.playerStats.achievements.includes(achievementName)) {
            this.playerStats.achievements.push(achievementName);
            this.displayAchievements();
            showToast(`${t('achievementUnlocked') || 'Achievement unlocked!'} ${achievementName}`, 'success');
        }
    }
    
    displayChallenges() {
        const challengesList = document.getElementById('challengesList');
        if (!challengesList) return;
        
        challengesList.innerHTML = '';
        
        this.challenges.forEach(challenge => {
            const challengeElement = this.createChallengeElement(challenge);
            challengesList.appendChild(challengeElement);
        });
    }
    
    createChallengeElement(challenge) {
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge-card';
        
        if (challenge.completed) {
            challengeDiv.classList.add('completed');
        }
        
        const difficultyClass = `difficulty-${challenge.difficulty}`;
        const difficultyText = t(challenge.difficulty) || challenge.difficulty;
        
        challengeDiv.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-info">
                    <h3>${challenge.title}</h3>
                    <p>${challenge.description}</p>
                </div>
                <div class="challenge-difficulty ${difficultyClass}">
                    ${difficultyText}
                </div>
            </div>
            
            <div class="challenge-rewards">
                <div class="reward">
                    <span>⭐</span>
                    <span>${challenge.xpReward} ${t('xpReward') || 'XP'}</span>
                </div>
                <div class="reward">
                    <span>💰</span>
                    <span>${challenge.coinReward} ${t('coinReward') || 'coins'}</span>
                </div>
            </div>
            
            <button class="complete-btn" 
                    onclick="window.app.completeChallenge('${challenge.id}')"
                    ${challenge.completed ? 'disabled' : ''}>
                ${challenge.completed ? 'Completed ✓' : t('complete') || 'Complete'}
            </button>
        `;
        
        return challengeDiv;
    }
    
    completeChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.completed) return;
        
        challenge.completed = true;
        this.playerStats.completedChallenges++;
        
        this.updatePlayerStats(challenge.xpReward, challenge.coinReward);
        
        // Add specific achievements
        if (challengeId === 'first-crop') {
            this.addAchievement('First Farmer');
        } else if (challengeId === 'water-conservation') {
            this.addAchievement('Water Guardian');
        } else if (challengeId === 'organic-farmer') {
            this.addAchievement('Organic Expert');
        } else if (challengeId === 'weather-master') {
            this.addAchievement('Weather Master');
        }
        
        this.displayChallenges();
        showToast(`${t('challengeCompleted') || 'Challenge completed!'} +${challenge.xpReward} XP, +${challenge.coinReward} coins`, 'success');
    }
    
    displayAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;
        
        const noAchievements = document.getElementById('noAchievements');
        
        if (this.playerStats.achievements.length === 0) {
            if (noAchievements) {
                noAchievements.style.display = 'block';
            }
            return;
        }
        
        if (noAchievements) {
            noAchievements.style.display = 'none';
        }
        
        // Clear existing achievements except no-achievements div
        const existingAchievements = achievementsList.querySelectorAll('.achievement-item');
        existingAchievements.forEach(item => item.remove());
        
        this.playerStats.achievements.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'achievement-item';
            
            achievementDiv.innerHTML = `
                <div class="achievement-icon">🏆</div>
                <div>
                    <h3>${achievement}</h3>
                    <p>${t('achievementUnlocked') || 'Achievement unlocked!'}</p>
                </div>
            `;
            
            achievementsList.appendChild(achievementDiv);
        });
    }
    
    updateDashboardStats() {
        const farmStats = JSON.parse(localStorage.getItem('farmStats') || '{}');
        
        const statsElements = {
            totalCrops: document.getElementById('totalCrops'),
            waterUsed: document.getElementById('waterUsed'),
            challengesComplete: document.getElementById('challengesComplete'),
            experiencePoints: document.getElementById('experiencePoints')
        };
        
        if (statsElements.totalCrops) {
            statsElements.totalCrops.textContent = farmStats.cropsHarvested || 0;
        }
        
        if (statsElements.waterUsed) {
            statsElements.waterUsed.textContent = `${farmStats.waterUsed || 0}L`;
        }
        
        if (statsElements.challengesComplete) {
            statsElements.challengesComplete.textContent = this.playerStats.completedChallenges;
        }
        
        if (statsElements.experiencePoints) {
            statsElements.experiencePoints.textContent = this.playerStats.experience;
        }
    }
}

// Tab navigation function
function showTab(tabName) {
    if (window.app) {
        window.app.showTab(tabName);
    }
}

// Player stats update function (called from other modules)
function updatePlayerStats(xp, coins) {
    if (window.app) {
        window.app.updatePlayerStats(xp, coins);
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main app
    window.app = new KishanMitraApp();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto-refresh dashboard stats every 5 seconds
    setInterval(() => {
        if (window.app && window.app.currentTab === 'dashboard') {
            window.app.updateDashboardStats();
        }
    }, 5000);
    
    // Auto-save player data every 30 seconds
    setInterval(() => {
        if (window.app) {
            window.app.savePlayerData();
        }
    }, 30000);
});