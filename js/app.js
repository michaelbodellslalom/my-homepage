// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function nextSlide() {
    currentSlideIndex++;
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Auto-advance every 5 seconds
setInterval(nextSlide, 5000);

// Weather API Integration
async function fetchWeather() {
    try {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Fetch weather from Open-Meteo API
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`
                );
                const weatherData = await weatherResponse.json();
                
                // Fetch location name using reverse geocoding
                const geoResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`
                );
                const geoData = await geoResponse.json();
                
                // Update UI
                const location = geoData.results?.[0]?.name || 'Your Location';
                const temp = Math.round(weatherData.current.temperature_2m);
                const feelsLike = Math.round(weatherData.current.apparent_temperature);
                const weatherCode = weatherData.current.weather_code;
                
                document.getElementById('location').textContent = location;
                document.getElementById('temperature').textContent = `${temp}°F`;
                document.getElementById('feels-like').textContent = `Feels like ${feelsLike}°F`;
                document.getElementById('description').textContent = getWeatherDescription(weatherCode);
                updateWeatherIcon(weatherCode);
            }, (error) => {
                // Fallback to default location if geolocation fails
                document.getElementById('location').textContent = 'Seattle, WA';
                document.getElementById('temperature').textContent = '72°F';
                document.getElementById('feels-like').textContent = 'Feels like 70°F';
                document.getElementById('description').textContent = 'Partly Cloudy';
                updateWeatherIcon(2);
            });
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        document.getElementById('location').textContent = 'Weather unavailable';
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear Sky',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light Drizzle',
        61: 'Light Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Light Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        95: 'Thunderstorm'
    };
    return weatherCodes[code] || 'Partly Cloudy';
}

function updateWeatherIcon(code) {
    const iconSvg = document.getElementById('weather-icon');
    let iconHTML = '';
    
    // Clear/Sunny
    if (code === 0 || code === 1) {
        iconHTML = `
            <circle cx="50" cy="50" r="20"/>
            <line x1="50" y1="10" x2="50" y2="20"/>
            <line x1="50" y1="80" x2="50" y2="90"/>
            <line x1="10" y1="50" x2="20" y2="50"/>
            <line x1="80" y1="50" x2="90" y2="50"/>
            <line x1="20" y1="20" x2="28" y2="28"/>
            <line x1="72" y1="72" x2="80" y2="80"/>
            <line x1="20" y1="80" x2="28" y2="72"/>
            <line x1="72" y1="28" x2="80" y2="20"/>
        `;
    }
    // Partly Cloudy
    else if (code === 2) {
        iconHTML = `
            <circle cx="35" cy="35" r="15"/>
            <path d="M 50 55 Q 45 45, 55 45 T 75 45 Q 80 45, 80 55 T 75 65 Q 70 65, 65 65 L 55 65 Q 50 65, 50 55" fill="currentColor"/>
        `;
    }
    // Overcast/Cloudy
    else if (code === 3) {
        iconHTML = `
            <path d="M 20 50 Q 15 40, 25 40 T 45 40 Q 50 40, 50 50 T 45 60 Q 40 60, 35 60 L 25 60 Q 20 60, 20 50" fill="currentColor"/>
            <path d="M 35 55 Q 30 45, 40 45 T 60 45 Q 65 45, 65 55 T 60 65 Q 55 65, 50 65 L 40 65 Q 35 65, 35 55" fill="currentColor"/>
            <path d="M 50 60 Q 45 50, 55 50 T 75 50 Q 80 50, 80 60 T 75 70 Q 70 70, 65 70 L 55 70 Q 50 70, 50 60" fill="currentColor"/>
        `;
    }
    // Rain
    else if (code >= 51 && code <= 65) {
        iconHTML = `
            <path d="M 30 40 Q 25 30, 35 30 T 55 30 Q 60 30, 60 40 T 55 50 Q 50 50, 45 50 L 35 50 Q 30 50, 30 40" fill="currentColor"/>
            <line x1="35" y1="55" x2="32" y2="65"/>
            <line x1="45" y1="55" x2="42" y2="65"/>
            <line x1="55" y1="55" x2="52" y2="65"/>
            <line x1="40" y1="60" x2="37" y2="70"/>
            <line x1="50" y1="60" x2="47" y2="70"/>
        `;
    }
    // Snow
    else if (code >= 71 && code <= 75) {
        iconHTML = `
            <path d="M 30 40 Q 25 30, 35 30 T 55 30 Q 60 30, 60 40 T 55 50 Q 50 50, 45 50 L 35 50 Q 30 50, 30 40" fill="currentColor"/>
            <line x1="35" y1="60" x2="35" y2="70"/>
            <line x1="30" y1="65" x2="40" y2="65"/>
            <line x1="45" y1="60" x2="45" y2="70"/>
            <line x1="40" y1="65" x2="50" y2="65"/>
            <line x1="55" y1="60" x2="55" y2="70"/>
            <line x1="50" y1="65" x2="60" y2="65"/>
        `;
    }
    // Thunderstorm
    else if (code === 95) {
        iconHTML = `
            <path d="M 30 35 Q 25 25, 35 25 T 55 25 Q 60 25, 60 35 T 55 45 Q 50 45, 45 45 L 35 45 Q 30 45, 30 35" fill="currentColor"/>
            <path d="M 42 50 L 38 60 L 44 60 L 40 72" stroke="currentColor" stroke-width="3" fill="none"/>
        `;
    }
    
    iconSvg.innerHTML = iconHTML;
}

// Load weather on page load
fetchWeather();
