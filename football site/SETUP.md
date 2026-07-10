# Football Ticketing Site - Setup Guide

## Getting Live Matches

To display real live football matches, you need to configure an API key. Here are the steps:

### Option 1: API-Football (Recommended) ⭐

1. **Visit RapidAPI**
   - Go to https://rapidapi.com/api-sports/api/api-football
   - Click "Sign Up" and create a free account

2. **Subscribe to API-Football**
   - Look for the "Subscribe" button
   - Select the Free tier (1500 requests/month)
   - Click "Subscribe"

3. **Get Your API Key**
   - After subscribing, go to your dashboard
   - Find "API Keys" section
   - Copy the API key (looks like a long random string)

4. **Configure in the App**
   - Open the football ticketing site in your browser
   - Click the ⚙️ (settings) button in the top navigation
   - Paste your API key in the input field
   - Click "Save API Key"
   - The site will automatically load live matches

### Option 2: Football-Data.org

1. **Visit Football-Data.org**
   - Go to https://www.football-data.org
   - Click "Register" to create a free account

2. **Get API Token**
   - After registration, go to your profile/account section
   - Find your API Token
   - Copy it

3. **Use in App**
   - Click ⚙️ settings button
   - Paste the token in the input field
   - Click "Save API Key"

## Features

✅ **Browse Upcoming Matches** - See Premier League and other league matches
✅ **Interactive Stadium** - View seat layouts and select your seats
✅ **Smart Pricing** - Standard and VIP seat options
✅ **Shopping Cart** - Manage multiple bookings
✅ **Checkout System** - Simulated payment processing
✅ **Live Data** - Auto-refreshes every 5 minutes
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## File Structure

```
football site/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript functionality
└── SETUP.md        # This file
```

## API Data Displayed

When connected to a live API, the site will show:
- **Team Names** - From live schedules
- **Match Dates & Times** - Real fixture dates
- **Stadiums** - Venue information
- **Available Seats** - Dynamic seat availability
- **Competitions** - League/cup information

## Troubleshooting

### "Using sample data - no API key configured"
- You need to add an API key first
- Click ⚙️ and follow the setup steps above

### "Rate limited"
- Free API tiers have request limits
- The site will automatically fall back to sample data
- Try again in a few minutes

### "Failed to load live API"
- Check your API key is correct
- Make sure you've subscribed to the API service
- Try copying your API key again

## Sample Data

If no API key is configured, the site uses sample Premier League matches for demonstration.

## Security Note

Your API key is stored locally in your browser using localStorage. It is never sent to any external server except the API service you're using.

---

**Ready to book?** Configure your API key and start exploring matches!
