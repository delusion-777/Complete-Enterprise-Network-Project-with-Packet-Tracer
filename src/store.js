// Enhanced Store System with Government Subsidies and Bio Fertilizers
class KishanMitraStore {
    constructor() {
        this.categories = {
            tools: 'tools',
            seeds: 'seeds',
            fertilizers: 'fertilizers',
            government: 'government'
        };
        
        this.currentCategory = 'tools';
        this.playerCoins = parseInt(localStorage.getItem('playerCoins') || '100');
        this.purchasedItems = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
        
        this.storeItems = {
            tools: [
                {
                    id: 'modern-plow',
                    name: 'Modern Plow',
                    description: 'Advanced plowing equipment for faster soil preparation',
                    price: 150,
                    coinPrice: 150,
                    icon: '🚜',
                    tags: ['equipment'],
                    effect: '+50% plowing speed'
                },
                {
                    id: 'drip-irrigation',
                    name: 'Drip Irrigation Kit',
                    description: 'Water-efficient irrigation system for sustainable farming',
                    price: 250,
                    coinPrice: 250,
                    icon: '💧',
                    tags: ['water-saving'],
                    effect: '50% less water consumption'
                },
                {
                    id: 'solar-pump',
                    name: 'Solar Water Pump',
                    description: 'Eco-friendly solar-powered water pump',
                    price: 400,
                    coinPrice: 400,
                    icon: '☀️',
                    tags: ['renewable'],
                    effect: 'Unlimited water pumping'
                },
                {
                    id: 'harvest-machine',
                    name: 'Mini Harvester',
                    description: 'Compact harvesting machine for small farms',
                    price: 600,
                    coinPrice: 600,
                    icon: '🌾',
                    tags: ['automation'],
                    effect: 'Harvest 5 crops at once'
                }
            ],
            
            seeds: [
                {
                    id: 'hybrid-rice',
                    name: 'Hybrid Rice Seeds',
                    description: 'High-yield rice variety with disease resistance',
                    price: 80,
                    coinPrice: 80,
                    icon: '🌾',
                    tags: ['high-yield'],
                    effect: '+40% yield, disease resistant'
                },
                {
                    id: 'drought-wheat',
                    name: 'Drought-Resistant Wheat',
                    description: 'Wheat variety that thrives in low-water conditions',
                    price: 100,
                    coinPrice: 100,
                    icon: '🌽',
                    tags: ['drought-resistant'],
                    effect: '70% less water needed'
                },
                {
                    id: 'organic-cotton',
                    name: 'Organic Cotton Seeds',
                    description: 'Premium organic cotton for sustainable farming',
                    price: 120,
                    coinPrice: 120,
                    icon: '🤍',
                    tags: ['organic'],
                    effect: '3x coin value when sold'
                },
                {
                    id: 'super-tomato',
                    name: 'Super Tomato Seeds',
                    description: 'Enhanced tomato variety with extended shelf life',
                    price: 90,
                    coinPrice: 90,
                    icon: '🍅',
                    tags: ['premium'],
                    effect: '+60% growth speed'
                }
            ],
            
            fertilizers: [
                {
                    id: 'compost-fertilizer',
                    name: 'Organic Compost',
                    description: 'Natural compost made from organic waste',
                    price: 60,
                    coinPrice: 60,
                    icon: '🌱',
                    tags: ['organic', 'bio'],
                    effect: '+25% soil health'
                },
                {
                    id: 'bio-npk',
                    name: 'Bio-NPK Fertilizer',
                    description: 'Biological NPK fertilizer with beneficial microbes',
                    price: 80,
                    coinPrice: 80,
                    icon: '🧪',
                    tags: ['bio', 'npk'],
                    effect: '+30% growth rate'
                },
                {
                    id: 'vermicompost',
                    name: 'Premium Vermicompost',
                    description: 'High-quality earthworm compost for organic farming',
                    price: 70,
                    coinPrice: 70,
                    icon: '🪱',
                    tags: ['organic', 'premium'],
                    effect: '+35% crop quality'
                },
                {
                    id: 'liquid-fertilizer',
                    name: 'Liquid Bio-Fertilizer',
                    description: 'Fast-acting liquid fertilizer with organic nutrients',
                    price: 90,
                    coinPrice: 90,
                    icon: '🧴',
                    tags: ['liquid', 'fast-acting'],
                    effect: 'Instant nutrient boost'
                }
            ],
            
            government: [
                {
                    id: 'subsidized-seeds',
                    name: 'Subsidized Seed Kit',
                    description: 'Government subsidized premium seeds package',
                    originalPrice: 200,
                    price: 150, // 25% discount
                    coinPrice: 50, // Heavily subsidized
                    cashPrice: 100,
                    icon: '🏛️',
                    tags: ['government', 'subsidy'],
                    effect: 'Mixed premium seeds kit',
                    isGovernment: true,
                    subsidyPercent: 25
                },
                {
                    id: 'pm-kisan-fertilizer',
                    name: 'PM-Kisan Bio-Fertilizer',
                    description: 'Government scheme bio-fertilizer with 75% subsidy',
                    originalPrice: 400,
                    price: 100, // 75% discount
                    coinPrice: 30,
                    cashPrice: 70,
                    icon: '🇮🇳',
                    tags: ['government', 'bio', 'pm-kisan'],
                    effect: '+50% yield with organic certification',
                    isGovernment: true,
                    subsidyPercent: 75
                },
                {
                    id: 'solar-subsidy',
                    name: 'Solar Equipment Subsidy',
                    description: 'Government solar equipment with 60% subsidy',
                    originalPrice: 1000,
                    price: 400, // 60% discount
                    coinPrice: 150,
                    cashPrice: 250,
                    icon: '☀️',
                    tags: ['government', 'solar', 'renewable'],
                    effect: 'Free solar-powered irrigation',
                    isGovernment: true,
                    subsidyPercent: 60
                },
                {
                    id: 'crop-insurance',
                    name: 'Pradhan Mantri Fasal Bima',
                    description: 'Government crop insurance scheme',
                    originalPrice: 300,
                    price: 45, // 85% subsidy
                    coinPrice: 15,
                    cashPrice: 30,
                    icon: '🛡️',
                    tags: ['government', 'insurance'],
                    effect: 'Full crop protection against natural disasters',
                    isGovernment: true,
                    subsidyPercent: 85
                },
                {
                    id: 'organic-certification',
                    name: 'Organic Certification Kit',
                    description: 'Government supported organic farming certification',
                    originalPrice: 500,
                    price: 125, // 75% subsidy
                    coinPrice: 40,
                    cashPrice: 85,
                    icon: '📜',
                    tags: ['government', 'organic', 'certification'],
                    effect: '2x price for all organic crops',
                    isGovernment: true,
                    subsidyPercent: 75
                }
            ]
        };
        
        this.initializeStore();
    }
    
    initializeStore() {
        this.updateCoinsDisplay();
        this.showStoreCategory('tools');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.onclick.toString().match(/showStoreCategory\('(.+?)'\)/)[1];
                this.showStoreCategory(category);
            });
        });
    }
    
    showStoreCategory(category) {
        this.currentCategory = category;
        
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[onclick="showStoreCategory('${category}')"]`).classList.add('active');
        
        // Display items
        this.displayItems(category);
    }
    
    displayItems(category) {
        const storeItems = document.getElementById('storeItems');
        storeItems.innerHTML = '';
        
        const items = this.storeItems[category] || [];
        
        items.forEach(item => {
            const itemElement = this.createItemElement(item);
            storeItems.appendChild(itemElement);
        });
    }
    
    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'store-item';
        
        if (item.isGovernment) {
            itemDiv.classList.add('government');
        }
        
        const isOwned = this.purchasedItems.includes(item.id);
        const canAffordCoins = this.playerCoins >= item.coinPrice;
        
        let tagsHTML = '';
        if (item.tags) {
            tagsHTML = item.tags.map(tag => {
                let tagClass = 'tag';
                if (tag.includes('government') || tag.includes('subsidy')) tagClass += ' government';
                else if (tag.includes('bio') || tag.includes('organic')) tagClass += ' bio';
                else if (tag.includes('discount')) tagClass += ' discount';
                
                return `<span class="${tagClass}">${tag}</span>`;
            }).join('');
        }
        
        let priceHTML = '';
        if (item.isGovernment) {
            priceHTML = `
                <div class="item-price">
                    <div class="original-price">₹${item.originalPrice}</div>
                    <div class="discounted-price">₹${item.price}</div>
                    <div class="coin-price">${item.coinPrice} coins</div>
                    <div class="cash-price">or ₹${item.cashPrice} cash</div>
                </div>
            `;
        } else {
            priceHTML = `
                <div class="item-price">
                    <div class="coin-price">${item.coinPrice} coins</div>
                </div>
            `;
        }
        
        itemDiv.innerHTML = `
            <div class="item-header">
                <div class="item-info">
                    <span class="item-icon">${item.icon}</span>
                    <div>
                        <div class="item-title">${item.name}</div>
                        ${item.isGovernment ? `<div class="subsidy-badge">${item.subsidyPercent}% ${t('govtSubsidy') || 'Govt Subsidy'}</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="item-description">${item.description}</div>
            
            <div class="item-tags">
                ${tagsHTML}
            </div>
            
            <div class="item-effect">
                <strong>Effect:</strong> ${item.effect}
            </div>
            
            <div class="item-footer">
                ${priceHTML}
                <button class="buy-btn ${!canAffordCoins || isOwned ? 'disabled' : ''}" 
                        onclick="window.store.purchaseItem('${item.id}')"
                        ${!canAffordCoins || isOwned ? 'disabled' : ''}>
                    ${isOwned ? t('owned') || 'Owned' : 
                      canAffordCoins ? t('buyNow') || 'Buy Now' : 
                      t('notEnoughCoins') || 'Not Enough Coins'}
                </button>
            </div>
        `;
        
        return itemDiv;
    }
    
    purchaseItem(itemId) {
        // Find item in all categories
        let item = null;
        let category = null;
        
        for (const [cat, items] of Object.entries(this.storeItems)) {
            const foundItem = items.find(i => i.id === itemId);
            if (foundItem) {
                item = foundItem;
                category = cat;
                break;
            }
        }
        
        if (!item) {
            showToast('Item not found!', 'error');
            return;
        }
        
        if (this.purchasedItems.includes(itemId)) {
            showToast(t('owned') || 'You already own this item!', 'info');
            return;
        }
        
        if (this.playerCoins < item.coinPrice) {
            showToast(t('notEnoughCoins') || 'Not enough coins!', 'error');
            return;
        }
        
        // Purchase successful
        this.playerCoins -= item.coinPrice;
        this.purchasedItems.push(itemId);
        
        // Save to localStorage
        localStorage.setItem('playerCoins', this.playerCoins.toString());
        localStorage.setItem('purchasedItems', JSON.stringify(this.purchasedItems));
        
        // Update display
        this.updateCoinsDisplay();
        this.displayItems(this.currentCategory);
        
        // Show success message
        let message = `${t('itemPurchased') || 'Purchased'} ${item.name}!`;
        if (item.isGovernment) {
            message += ` (${item.subsidyPercent}% government subsidy applied)`;
        }
        
        showToast(message, 'success');
        
        // Apply item effects (if any)
        this.applyItemEffects(item);
    }
    
    applyItemEffects(item) {
        // Store purchased item effects in localStorage for game systems to use
        const itemEffects = JSON.parse(localStorage.getItem('activeItemEffects') || '{}');
        itemEffects[item.id] = {
            name: item.name,
            effect: item.effect,
            category: this.currentCategory,
            purchaseTime: Date.now()
        };
        localStorage.setItem('activeItemEffects', JSON.stringify(itemEffects));
        
        // Special handling for government schemes
        if (item.isGovernment) {
            const govtBenefits = JSON.parse(localStorage.getItem('governmentBenefits') || '{}');
            govtBenefits[item.id] = {
                subsidyPercent: item.subsidyPercent,
                benefit: item.effect,
                scheme: item.name
            };
            localStorage.setItem('governmentBenefits', JSON.stringify(govtBenefits));
        }
    }
    
    updateCoinsDisplay() {
        const coinsElement = document.getElementById('playerCoins');
        if (coinsElement) {
            coinsElement.textContent = this.playerCoins;
        }
    }
    
    addCoins(amount) {
        this.playerCoins += amount;
        localStorage.setItem('playerCoins', this.playerCoins.toString());
        this.updateCoinsDisplay();
    }
    
    getPlayerCoins() {
        return this.playerCoins;
    }
    
    getPurchasedItems() {
        return this.purchasedItems;
    }
    
    hasItem(itemId) {
        return this.purchasedItems.includes(itemId);
    }
}

// Store category display functions
function showStoreCategory(category) {
    if (window.store) {
        window.store.showStoreCategory(category);
    }
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('storeItems')) {
        window.store = new KishanMitraStore();
    }
});