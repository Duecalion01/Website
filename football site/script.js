// Match Data - Will be populated from API
let matches = [];

// Team logos mapping
const teamLogos = {
    'Manchester United': '🔴', 'Man United': '🔴', 'Manchester City': '🔵', 'Man City': '🔵',
    'Liverpool': '❤️', 'Arsenal': '🔴🟡', 'Chelsea': '🔵', 'Tottenham': '⚪', 'Spurs': '⚪',
    'Newcastle United': '🖤⚪', 'Newcastle': '🖤⚪', 'Brighton': '⚪🔵', 'Everton': '🔵',
    'West Ham United': '⚒️', 'West Ham': '⚒️', 'Aston Villa': '🔴🔵', 'Fulham': '⚪',
    'Brentford': '🤍', 'Bournemouth': '🔴⚪', 'Nottingham Forest': '🔴', 'Forest': '🔴',
    'Luton Town': '🟠⚪', 'Ipswich Town': '🔵⚪', 'Southampton': '🔴⚪', 'Leicester City': '🔵',
    'Leeds': '⚪', 'Middlesbrough': '🔴', 'Blackburn': '🔵⚪', 'Watford': '🟡⚪',
    'Real Madrid': '⚪', 'Barcelona': '🔴🔵', 'Bayern Munich': '🔴⚪', 'PSG': '🔵⚪',
    'AC Milan': '🔴⚪', 'Inter Milan': '🔵⚫', 'Juventus': '🤍🖤', 'AS Roma': '🟡🔴'
};

// Stadium data
const stadiumData = {
    'Old Trafford': 76000,
    'Anfield': 61276,
    'Emirates Stadium': 60260,
    'Etihad Stadium': 55097,
    'Tottenham Hotspur Stadium': 62850,
    'Goodison Park': 52888,
    'Villa Park': 42785,
    'London Stadium': 62500,
    'Ashton Gate Stadium': 27312,
    'Brightton and Hove Albion Stadium': 31707,
    'King Power Stadium': 32261,
    'Elland Road': 37890,
    'St James\' Park': 52305,
    'Bramall Lane': 32125,
    'Craven Cottage': 25700,
    'The Hawthorns': 26688,
    'Ewood Park': 31367,
    'Vicarage Road': 30827,
    'Ulysses McInally Stadium': 20961,
    'Portman Road': 30311
};

// Fetch live matches from API
async function fetchLiveMatches() {
    try {
        if (apiKey) {
            // Try API-Football first (RapidAPI)
            await fetchFromApiFootball();
        } else {
            loadSampleMatches();
            updateApiStatus('Using sample data - no API key configured');
        }
    } catch (error) {
        console.log('Fetch error:', error);
        loadSampleMatches();
    }
}

// Fetch from API-Football (RapidAPI)
async function fetchFromApiFootball() {
    try {
        const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?next=20', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        });

        if (response.status === 429) {
            console.log('Rate limited, using sample data');
            loadSampleMatches();
            return;
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.response && data.response.length > 0) {
            processApiFootballMatches(data.response);
            updateApiStatus('✅ Connected to live API');
        } else {
            loadSampleMatches();
            updateApiStatus('No live matches found, showing sample data');
        }
    } catch (error) {
        console.log('API-Football error:', error);
        loadSampleMatches();
        updateApiStatus('Failed to load live API - showing sample data');
    }
}

// Process matches from API-Football
function processApiFootballMatches(apiMatches) {
    matches = apiMatches.slice(0, 20).map((match) => {
        const homeTeam = match.teams.home.name;
        const awayTeam = match.teams.away.name;
        const matchDate = new Date(match.fixture.date);
        
        return {
            id: match.fixture.id,
            team1: homeTeam,
            team2: awayTeam,
            date: matchDate.toISOString().split('T')[0],
            time: matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            stadium: match.fixture.venue?.name || 'TBA',
            capacity: stadiumData[match.fixture.venue?.name] || Math.floor(Math.random() * 20000 + 40000),
            availableSeats: Math.floor(Math.random() * 15000 + 5000),
            competition: match.league?.name || 'Football Match',
            logo1: teamLogos[homeTeam] || '⚽',
            logo2: teamLogos[awayTeam] || '⚽'
        };
    });

    // Refresh the UI
    if (document.getElementById('matches-grid')) {
        loadMatches('all');
    }
}

// Load sample matches (fallback)
function loadSampleMatches() {
    matches = [
        // Premier League - England
        {
            id: 1,
            team1: 'Manchester United',
            team2: 'Liverpool',
            date: '2026-06-03',
            time: '20:00',
            stadium: 'Old Trafford',
            capacity: 76000,
            availableSeats: 15000,
            competition: 'Premier League',
            logo1: '🔴',
            logo2: '❤️'
        },
        // La Liga - Spain
        {
            id: 2,
            team1: 'Real Madrid',
            team2: 'Barcelona',
            date: '2026-06-04',
            time: '21:00',
            stadium: 'Santiago Bernabéu',
            capacity: 81044,
            availableSeats: 8000,
            competition: 'La Liga',
            logo1: '⚪',
            logo2: '🔴🔵'
        },
        // Serie A - Italy
        {
            id: 3,
            team1: 'AC Milan',
            team2: 'Inter Milan',
            date: '2026-06-05',
            time: '20:30',
            stadium: 'San Siro',
            capacity: 80018,
            availableSeats: 12000,
            competition: 'Serie A',
            logo1: '🔴⚪',
            logo2: '🔵⚫'
        },
        // Bundesliga - Germany
        {
            id: 4,
            team1: 'Bayern Munich',
            team2: 'Borussia Dortmund',
            date: '2026-06-06',
            time: '19:30',
            stadium: 'Allianz Arena',
            capacity: 75024,
            availableSeats: 5000,
            competition: 'Bundesliga',
            logo1: '🔴⚪',
            logo2: '🟡⚫'
        },
        // Ligue 1 - France
        {
            id: 5,
            team1: 'Paris Saint-Germain',
            team2: 'Olympique Marseille',
            date: '2026-06-07',
            time: '20:00',
            stadium: 'Parc des Princes',
            capacity: 47929,
            availableSeats: 18000,
            competition: 'Ligue 1',
            logo1: '🔵⚪',
            logo2: '⚪🔵'
        },
        // Premier League - England
        {
            id: 6,
            team1: 'Arsenal',
            team2: 'Paris Saint-German',
            date: '2026-06-08',
            time: '15:00',
            stadium: 'Budapest Stadium',
            capacity: 60260,
            availableSeats: 8000,
            competition: 'Champions League',
            logo1: '🔴🟡',
            logo2: '🔵'
        },
        // Série A - Brazil
        {
            id: 7,
            team1: 'Flamengo',
            team2: 'Corinthians',
            date: '2026-06-09',
            time: '19:00',
            stadium: 'Estádio do Maracanã',
            capacity: 78838,
            availableSeats: 22000,
            competition: 'Série A',
            logo1: '🔴⚫',
            logo2: '⚪'
        },
        // La Liga - Spain
        {
            id: 8,
            team1: 'Atlético Madrid',
            team2: 'Sevilla',
            date: '2026-06-10',
            time: '18:30',
            stadium: 'Wanda Metropolitano',
            capacity: 68456,
            availableSeats: 10000,
            competition: 'La Liga',
            logo1: '🔴⚪',
            logo2: '🔴⚪'
        },
        // Liga MX - Mexico
        {
            id: 9,
            team1: 'Guadalajara',
            team2: 'América',
            date: '2026-06-11',
            time: '20:00',
            stadium: 'Estadio Akron',
            capacity: 46652,
            availableSeats: 19000,
            competition: 'Liga MX',
            logo1: '🔴⚪🔵',
            logo2: '🟡🔵'
        },
        // Serie A - Italy
        {
            id: 10,
            team1: 'Juventus',
            team2: 'AS Roma',
            date: '2026-06-12',
            time: '20:45',
            stadium: 'Allianz Stadium',
            capacity: 41507,
            availableSeats: 14000,
            competition: 'Serie A',
            logo1: '🤍🖤',
            logo2: '🟡🔴'
        },
        // Premier League - England
        {
            id: 11,
            team1: 'Manchester City',
            team2: 'Newcastle United',
            date: '2026-06-13',
            time: '19:30',
            stadium: 'Etihad Stadium',
            capacity: 55097,
            availableSeats: 12000,
            competition: 'Premier League',
            logo1: '🔵',
            logo2: '🖤⚪'
        },
        // K League - South Korea
        {
            id: 12,
            team1: 'FC Seoul',
            team2: 'Ulsan Hyundai',
            date: '2026-06-14',
            time: '18:30',
            stadium: 'Seoul World Cup Stadium',
            capacity: 66806,
            availableSeats: 20000,
            competition: 'K League 1',
            logo1: '🔴⚪',
            logo2: '🔵'
        },
        // J League - Japan
        {
            id: 13,
            team1: 'FC Tokyo',
            team2: 'Yokohama F. Marinos',
            date: '2026-06-15',
            time: '19:00',
            stadium: 'Tokyo Stadium',
            capacity: 49970,
            availableSeats: 16000,
            competition: 'J League 1',
            logo1: '🔴⚪',
            logo2: '🔵⚪'
        },
        // Bundesliga - Germany
        {
            id: 14,
            team1: 'RB Leipzig',
            team2: 'Hamburg SV',
            date: '2026-06-16',
            time: '20:00',
            stadium: 'Red Bull Arena',
            capacity: 47661,
            availableSeats: 25000,
            competition: 'Bundesliga',
            logo1: '🔴⚪',
            logo2: '🔵⚪'
        },
        // Ligue 1 - France
        {
            id: 15,
            team1: 'Lyon',
            team2: 'Monaco',
            date: '2026-06-17',
            time: '19:45',
            stadium: 'Parc de la Tête d\'Or',
            capacity: 59286,
            availableSeats: 21000,
            competition: 'Ligue 1',
            logo1: '🔴⚪🔵',
            logo2: '🔴⚪'
        },
        // Série A - Brazil
        {
            id: 16,
            team1: 'São Paulo FC',
            team2: 'Santos',
            date: '2026-06-18',
            time: '20:30',
            stadium: 'Estádio do Morumbi',
            capacity: 66795,
            availableSeats: 18000,
            competition: 'Série A',
            logo1: '🔴⚪',
            logo2: '⚪🖤'
        },
        // Premier League - England
        {
            id: 17,
            team1: 'Tottenham Hotspur',
            team2: 'Brighton & Hove',
            date: '2026-06-19',
            time: '17:30',
            stadium: 'Tottenham Hotspur Stadium',
            capacity: 62850,
            availableSeats: 9000,
            competition: 'Premier League',
            logo1: '⚪',
            logo2: '⚪🔵'
        },
        // Argentine Superliga
        {
            id: 18,
            team1: 'Boca Juniors',
            team2: 'River Plate',
            date: '2026-06-20',
            time: '19:00',
            stadium: 'La Bombonera',
            capacity: 56000,
            availableSeats: 11000,
            competition: 'Argentine Superliga',
            logo1: '🔵🟡',
            logo2: '🔴⚪'
        },
        // La Liga - Spain
        {
            id: 19,
            team1: 'Valencia',
            team2: 'Real Sociedad',
            date: '2026-06-21',
            time: '19:30',
            stadium: 'Mestalla',
            capacity: 55000,
            availableSeats: 13000,
            competition: 'La Liga',
            logo1: '⚪🔵',
            logo2: '🔵⚪'
        },
        // UEFA Champions League - European
        {
            id: 20,
            team1: 'Liverpool',
            team2: 'Bayern Munich',
            date: '2026-06-22',
            time: '20:00',
            stadium: 'Anfield',
            capacity: 61276,
            availableSeats: 7000,
            competition: 'UEFA Champions League',
            logo1: '❤️',
            logo2: '🔴⚪'
        }
    ];

    if (document.getElementById('matches-grid')) {
        loadMatches('all');
    }
}

// Teams Data
const teams = [
    { name: 'Manchester United', logo: '🔴', wins: 25, draws: 7, losses: 6 },
    { name: 'Liverpool', logo: '❤️', wins: 24, draws: 8, losses: 6 },
    { name: 'Arsenal', logo: '🔴🟡', wins: 23, draws: 9, losses: 6 },
    { name: 'Manchester City', logo: '🔵', wins: 26, draws: 7, losses: 5 },
    { name: 'Chelsea', logo: '🔵', wins: 21, draws: 9, losses: 8 },
    { name: 'Tottenham', logo: '⚪', wins: 20, draws: 8, losses: 10 },
    { name: 'Brighton', logo: '⚪🔵', wins: 18, draws: 10, losses: 10 },
    { name: 'Newcastle', logo: '🖤⚪', wins: 19, draws: 9, losses: 10 },
    { name: 'Everton', logo: '🔵', wins: 17, draws: 7, losses: 14 },
    { name: 'West Ham', logo: '⚒️', wins: 16, draws: 8, losses: 14 },
    { name: 'Aston Villa', logo: '🔴🔵', wins: 18, draws: 9, losses: 11 },
    { name: 'Fulham', logo: '⚪', wins: 15, draws: 10, losses: 13 }
];

// State Management
let cart = [];
let selectedSeats = [];
let currentMatch = null;
let seatPrices = {
    standard: 50,
    vip: 100
};
let apiKey = localStorage.getItem('footballApiKey') || '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load API key from storage
    const savedApiKey = localStorage.getItem('footballApiKey');
    if (savedApiKey) {
        document.getElementById('api-key-input').value = savedApiKey;
        apiKey = savedApiKey;
    }
    
    // Fetch live matches from API
    fetchLiveMatches();
    
    // Also load teams
    loadTeams();
    updateCartCount();
    
    // Refresh matches every 5 minutes
    setInterval(fetchLiveMatches, 5 * 60 * 1000);
});

// Filter Matches
function filterMatches(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    updateFilterStatus(filter);
    loadMatches(filter);
}

function updateFilterStatus(filter) {
    const statusElement = document.getElementById('filter-status');
    if (!statusElement) return;

    const statusText = {
        all: 'Showing: All matches',
        today: 'Showing: Today\'s matches',
        week: 'Showing: This week\'s matches',
        upcoming: 'Showing: Upcoming fixtures'
    };

    statusElement.textContent = statusText[filter] || statusText.all;
}

// Load Matches
function loadMatches(filter) {
    const matchesGrid = document.getElementById('matches-grid');
    if (!matchesGrid) return;

    matchesGrid.innerHTML = '';

    if (matches.length === 0) {
        matchesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #6b7280;">Loading matches...</div>';
        return;
    }

    let filteredMatches = matches;

    if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredMatches = matches.filter(m => m.date === today);
    } else if (filter === 'week') {
        const today = new Date();
        const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        filteredMatches = matches.filter(m => {
            const matchDate = new Date(m.date);
            return matchDate >= today && matchDate <= weekLater;
        });
    } else if (filter === 'upcoming') {
        const today = new Date();
        filteredMatches = matches.filter(m => new Date(m.date) > today);
    }

    if (filteredMatches.length === 0) {
        matchesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #6b7280;">No matches found for this filter.</div>';
        return;
    }

    filteredMatches.forEach(match => {
        const matchCard = createMatchCard(match);
        matchesGrid.appendChild(matchCard);
    });
}

// Create Match Card
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.onclick = () => openMatchModal(match);

    const availableClass = match.availableSeats < 5000 ? 'low' : '';

    card.innerHTML = `
        <div class="match-card-header">
            <div class="match-teams">
                <div class="team-short">${match.logo1}</div>
                <div class="vs-text">VS</div>
                <div class="team-short">${match.logo2}</div>
            </div>
            <div class="match-date">${formatDate(match.date)} at ${match.time}</div>
        </div>
        <div class="match-card-body">
            <h3>${match.team1} vs ${match.team2}</h3>
            <div class="match-card-info">
                <strong>Stadium:</strong> ${match.stadium}
            </div>
            <div class="match-card-info">
                <strong>Competition:</strong> ${match.competition}
            </div>
            <div class="available-seats ${availableClass}">
                ${match.availableSeats.toLocaleString()} seats available
            </div>
            <button class="btn-primary">View Details</button>
        </div>
    `;

    return card;
}

// Open Match Modal
function openMatchModal(match) {
    currentMatch = match;
    document.getElementById('team1-name').textContent = match.team1;
    document.getElementById('team1-logo').textContent = match.logo1;
    document.getElementById('team2-name').textContent = match.team2;
    document.getElementById('team2-logo').textContent = match.logo2;
    document.getElementById('match-date').textContent = formatDate(match.date) + ' at ' + match.time;
    document.getElementById('match-stadium').textContent = match.stadium;
    document.getElementById('match-capacity').textContent = match.capacity.toLocaleString();
    document.getElementById('match-competition').textContent = match.competition;

    openModal('match-modal');
}

// Close Match Modal
function closeMatchModal() {
    closeModal('match-modal');
}

// Open Seat Selection
function openSeatSelection() {
    if (!currentMatch) return;

    closeMatchModal();
    selectedSeats = [];
    generateSeats();
    updateSeatSummary();
    openModal('seat-modal');
}

// Generate Seats
function generateSeats() {
    const stadiumView = document.getElementById('stadium-view');
    stadiumView.innerHTML = '';

    const sections = ['North Stand', 'South Stand', 'East Stand', 'West Stand'];
    const rowsPerSection = 10;
    const seatsPerRow = 15;

    sections.forEach((section, sectionIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'stadium-section';
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = section;
        sectionDiv.appendChild(sectionTitle);

        for (let row = 1; row <= rowsPerSection; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seats-row';

            for (let seat = 1; seat <= seatsPerRow; seat++) {
                const seatBtn = document.createElement('button');
                seatBtn.className = 'seat available';
                seatBtn.textContent = seat;
                seatBtn.type = 'button';

                const seatId = `${sectionIndex}-${row}-${seat}`;
                const isVip = (sectionIndex === 0 || sectionIndex === 1) && row <= 2;
                const isBooked = Math.random() > 0.7;

                if (isBooked) {
                    seatBtn.classList.remove('available');
                    seatBtn.classList.add('booked');
                    seatBtn.disabled = true;
                } else if (isVip) {
                    seatBtn.classList.add('vip');
                }

                seatBtn.dataset.seatId = seatId;
                seatBtn.dataset.seatNumber = `${section} - Row ${row}, Seat ${seat}`;
                seatBtn.dataset.vip = isVip;
                seatBtn.dataset.price = isVip ? seatPrices.vip : seatPrices.standard;

                seatBtn.onclick = (e) => {
                    e.preventDefault();
                    toggleSeat(seatBtn);
                };

                rowDiv.appendChild(seatBtn);
            }

            sectionDiv.appendChild(rowDiv);
        }

        stadiumView.appendChild(sectionDiv);
    });
}

// Toggle Seat Selection
function toggleSeat(seatBtn) {
    if (seatBtn.classList.contains('booked')) return;

    const seatId = seatBtn.dataset.seatId;
    const seatNumber = seatBtn.dataset.seatNumber;
    const price = parseFloat(seatBtn.dataset.price);

    if (seatBtn.classList.contains('selected')) {
        seatBtn.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s.id !== seatId);
    } else {
        seatBtn.classList.add('selected');
        selectedSeats.push({
            id: seatId,
            number: seatNumber,
            price: price,
            isVip: seatBtn.dataset.vip === 'true'
        });
    }

    updateSeatSummary();
}

// Update Seat Summary
function updateSeatSummary() {
    const count = selectedSeats.length;
    const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('ticket-count').textContent = count;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);

    if (count === 0) {
        document.getElementById('selected-seats-list').textContent = 'No seats selected';
    } else {
        const seatsList = selectedSeats.map(s => s.number).join(', ');
        document.getElementById('selected-seats-list').textContent = seatsList;
    }
}

// Add to Cart
function addToCart() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat');
        return;
    }

    const cartItem = {
        id: Date.now(),
        match: `${currentMatch.team1} vs ${currentMatch.team2}`,
        date: currentMatch.date,
        seats: [...selectedSeats],
        total: selectedSeats.reduce((sum, s) => sum + s.price, 0) * 1.1
    };

    cart.push(cartItem);
    updateCartCount();
    closeSeatModal();
    
    alert(`Added ${selectedSeats.length} ticket(s) to cart!`);
}

// Close Seat Modal
function closeSeatModal() {
    closeModal('seat-modal');
    selectedSeats = [];
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.seats.length, 0);
    document.getElementById('cart-count').textContent = count;
}

// Open Cart
function openCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        document.querySelector('#cart-modal .btn-primary').disabled = true;
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';

            const seatsText = item.seats.map(s => s.number.split(' - ')[1]).join(', ');
            const itemTotal = item.total;
            total += itemTotal;

            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.match}</h3>
                    <p>Date: ${formatDate(item.date)}</p>
                    <p>Seats: ${seatsText}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;

            cartItems.appendChild(itemDiv);
        });

        document.getElementById('cart-total').textContent = total.toFixed(2);
        document.querySelector('#cart-modal .btn-primary').disabled = false;
    }

    openModal('cart-modal');
}

// Close Cart
function closeCart() {
    closeModal('cart-modal');
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    closeCart();
    openModal('checkout-modal');
}

// Close Checkout
function closeCheckout() {
    closeModal('checkout-modal');
}

// Process Payment
function processPayment(event) {
    event.preventDefault();

    const total = cart.reduce((sum, item) => sum + item.total, 0);

    // Simulate payment processing
    alert(`Payment of $${total.toFixed(2)} processed successfully!\n\nTickets have been sent to your email. Thank you for your purchase!`);

    // Clear cart
    cart = [];
    updateCartCount();
    closeCheckout();

    // Reset form
    document.getElementById('checkout-form').reset();
}

// Load Teams
function loadTeams() {
    const teamsGrid = document.querySelector('.teams-grid');
    teamsGrid.innerHTML = '';

    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';

        teamCard.innerHTML = `
            <div class="team-card-header">
                <div class="team-card-logo">${team.logo}</div>
                <div class="team-card-name">${team.name}</div>
            </div>
            <div class="team-card-body">
                <p><strong>W:</strong> ${team.wins}</p>
                <p><strong>D:</strong> ${team.draws}</p>
                <p><strong>L:</strong> ${team.losses}</p>
                <p>Tickets: <strong>$50</strong></p>
            </div>
        `;

        teamsGrid.appendChild(teamCard);
    });
}

// Handle Contact Submit
function handleContactSubmit(event) {
    event.preventDefault();

    alert('Thank you for contacting us! We will get back to you soon.');
    event.target.reset();
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Search Functionality
document.getElementById('search-box').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const matchCards = document.querySelectorAll('.match-card');

    matchCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});

// Settings Functions
function openSettings() {
    openModal('settings-modal');
}

function closeSettings() {
    closeModal('settings-modal');
}

function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input').value.trim();
    
    if (!apiKeyInput) {
        alert('Please enter an API key');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('footballApiKey', apiKeyInput);
    apiKey = apiKeyInput;
    
    alert('API key saved successfully! Reloading matches...');
    
    // Reload matches with new API key
    fetchLiveMatches();
    closeSettings();
}

function reloadMatches() {
    alert('Reloading matches...');
    fetchLiveMatches();
}

function updateApiStatus(status) {
    const statusElement = document.getElementById('api-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
}
