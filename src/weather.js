// Weather system with realistic animations
class WeatherSystem {
    constructor() {
        this.canvas = document.getElementById('weatherCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.currentWeather = 'sunny';
        this.weatherDuration = 0;
        this.weatherChangeInterval = 30000; // 30 seconds
        
        this.setupCanvas();
        this.startWeatherCycle();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    startWeatherCycle() {
        // Change weather every 30 seconds
        setInterval(() => {
            this.changeWeather();
        }, this.weatherChangeInterval);
        
        // Initial weather setup
        this.changeWeather();
    }
    
    changeWeather() {
        const weatherTypes = ['sunny', 'cloudy', 'rainy', 'storm'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Probability weights
        
        let random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weatherTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                this.setWeather(weatherTypes[i]);
                break;
            }
        }
    }
    
    setWeather(weatherType) {
        this.currentWeather = weatherType;
        this.particles = []; // Clear existing particles
        this.weatherDuration = 0;
        
        // Update UI
        this.updateWeatherUI();
        
        // Create particles based on weather
        switch (weatherType) {
            case 'rainy':
                this.createRainParticles();
                break;
            case 'storm':
                this.createStormParticles();
                break;
            case 'cloudy':
                this.createCloudParticles();
                break;
            case 'sunny':
                this.createSunParticles();
                break;
        }
        
        // Show weather notification
        this.showWeatherNotification(weatherType);
    }
    
    updateWeatherUI() {
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherCondition = document.getElementById('weatherCondition');
        const weatherTemp = document.getElementById('weatherTemp');
        
        const weatherData = {
            sunny: { 
                icon: '☀️', 
                condition: t('sunny'), 
                temp: '28°C' 
            },
            cloudy: { 
                icon: '☁️', 
                condition: t('cloudy'), 
                temp: '24°C' 
            },
            rainy: { 
                icon: '🌧️', 
                condition: t('rainy'), 
                temp: '22°C' 
            },
            storm: { 
                icon: '⛈️', 
                condition: 'Storm', 
                temp: '20°C' 
            }
        };
        
        const data = weatherData[this.currentWeather];
        if (weatherIcon) weatherIcon.textContent = data.icon;
        if (weatherCondition) weatherCondition.textContent = data.condition;
        if (weatherTemp) weatherTemp.textContent = data.temp;
    }
    
    createRainParticles() {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                velocity: Math.random() * 3 + 5,
                length: Math.random() * 20 + 10,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    createStormParticles() {
        // Heavy rain
        for (let i = 0; i < 300; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                velocity: Math.random() * 5 + 8,
                length: Math.random() * 30 + 15,
                opacity: Math.random() * 0.7 + 0.3,
                type: 'rain'
            });
        }
        
        // Lightning flashes occasionally
        if (Math.random() < 0.1) {
            this.particles.push({
                type: 'lightning',
                duration: 0,
                maxDuration: 100
            });
        }
    }
    
    createCloudParticles() {
        // Floating cloud particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 200 + 50,
                velocity: Math.random() * 0.5 + 0.2,
                size: Math.random() * 60 + 40,
                opacity: Math.random() * 0.3 + 0.1,
                type: 'cloud'
            });
        }
    }
    
    createSunParticles() {
        // Sun rays and sparkles
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                velocity: Math.random() * 0.5 + 0.1,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                twinkle: Math.random() * Math.PI * 2,
                type: 'sparkle'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.weatherDuration++;
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (particle.type === 'lightning') {
                this.drawLightning(particle);
                particle.duration++;
                if (particle.duration >= particle.maxDuration) {
                    this.particles.splice(i, 1);
                }
            } else if (particle.type === 'cloud') {
                this.drawCloud(particle);
                particle.x += particle.velocity;
                if (particle.x > this.canvas.width + particle.size) {
                    particle.x = -particle.size;
                }
            } else if (particle.type === 'sparkle') {
                this.drawSparkle(particle);
                particle.y += particle.velocity;
                particle.twinkle += 0.1;
                if (particle.y > this.canvas.height) {
                    particle.y = -10;
                    particle.x = Math.random() * this.canvas.width;
                }
            } else {
                // Rain particles
                this.drawRain(particle);
                particle.y += particle.velocity;
                if (particle.y > this.canvas.height) {
                    particle.y = -particle.length;
                    particle.x = Math.random() * this.canvas.width;
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawRain(particle) {
        this.ctx.strokeStyle = `rgba(100, 150, 255, ${particle.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(particle.x, particle.y + particle.length);
        this.ctx.stroke();
    }
    
    drawLightning(particle) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - particle.duration / particle.maxDuration})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Lightning bolt
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - particle.duration / particle.maxDuration})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        let x = this.canvas.width / 2 + (Math.random() - 0.5) * 200;
        let y = 0;
        this.ctx.moveTo(x, y);
        
        while (y < this.canvas.height) {
            x += (Math.random() - 0.5) * 50;
            y += Math.random() * 50 + 20;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
    }
    
    drawCloud(particle) {
        this.ctx.fillStyle = `rgba(200, 200, 200, ${particle.opacity})`;
        this.ctx.beginPath();
        
        // Draw cloud shape
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = particle.size * (0.7 + Math.sin(angle * 3) * 0.3);
            const x = particle.x + Math.cos(angle) * radius;
            const y = particle.y + Math.sin(angle) * radius * 0.6;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawSparkle(particle) {
        const twinkleIntensity = Math.sin(particle.twinkle) * 0.5 + 0.5;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity * twinkleIntensity})`;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sparkle rays
        this.ctx.strokeStyle = `rgba(255, 215, 0, ${particle.opacity * twinkleIntensity})`;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + particle.twinkle;
            const length = particle.size * 3;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(
                particle.x + Math.cos(angle) * length,
                particle.y + Math.sin(angle) * length
            );
            this.ctx.stroke();
        }
    }
    
    showWeatherNotification(weatherType) {
        const messages = {
            sunny: t('weatherConditions')?.sunny || 'Perfect for planting!',
            cloudy: t('weatherConditions')?.cloudy || 'Mild conditions for crops',
            rainy: t('weatherConditions')?.rainy || 'Great natural watering!',
            storm: t('weatherConditions')?.storm || 'Protect your crops!'
        };
        
        showToast(messages[weatherType], 'info');
    }
    
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    getWeatherEffect() {
        const effects = {
            sunny: { growthMultiplier: 1.2, waterConsumption: 1.5 },
            cloudy: { growthMultiplier: 1.0, waterConsumption: 1.0 },
            rainy: { growthMultiplier: 1.5, waterConsumption: 0.5 },
            storm: { growthMultiplier: 0.8, waterConsumption: 0.3 }
        };
        
        return effects[this.currentWeather] || effects.sunny;
    }
}

// Initialize weather system
let weatherSystem;
document.addEventListener('DOMContentLoaded', function() {
    weatherSystem = new WeatherSystem();
});