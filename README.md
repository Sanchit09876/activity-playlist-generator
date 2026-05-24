# 🎵 Activity → Playlist Generator

> Tell it what you're doing. Get the perfect soundtrack.

A web app that takes any activity you describe and generates a curated music playlist for it. Groq's LLM picks the songs, iTunes provides album art and 30-second previews, and YouTube links let you play the full track — all in one clean interface.

---

## ✨ Features

- **Activity-based playlist generation** — Type anything: *go to the gym*, *late night coding*, *morning run*, *chill Sunday* — and get a matching playlist.
- **Adjustable playlist length** — Slide between 5 and 10 songs.
- **Random Activity** — Can't decide? Generate a random activity with one click.
- **Album art** — Cover art fetched per song via the iTunes Search API.
- **30-second previews** — Inline audio player for each song using iTunes preview URLs.
- **iTunes links** — Direct link to the song on iTunes for each result.
- **YouTube links** — Full song playback via YouTube Data API.
- **Skeleton loading UI** — Placeholder cards shimmer while results load, keeping the UI smooth.
- **Hover animations** — Dice, music, iTunes, and YouTube icons all animate on hover via Font Awesome.
- **Secure API proxy** — All API keys stay on the server; none are exposed to the browser.

---

## 🛠️ Tech Stack

| Layer       | Technology                      |
|-------------|---------------------------------|
| Frontend    | HTML5, CSS3, Vanilla JavaScript |
| Backend     | PHP (cURL API proxy)            |
| AI          | Groq API — `llama-3.1-8b-instant` |
| Music Data  | iTunes Search API (public)      |
| Video Links | YouTube Data API v3             |
| Icons       | Font Awesome                    |

---

## 📁 Project Structure

```
activity-playlist-generator/
├── index.html
├── assets/
│   └── images/
│       ├── music_disk.png       # Spinning disc in header
│       └── song_beat.png        # Background beat graphic
├── css/
│   ├── variable.css             # CSS custom properties (colors, theme)
│   └── style.css                # All styles + skeleton loader + animations
├── js/
│   └── main.js                  # Slider, activity display, API calls, result rendering
├── php/
│   ├── config/
│   │   └── load_env.php         # Loads .env variables into getenv()
│   └── ajax/
│       ├── random_activity.php  # Calls Groq to generate a random activity
│       ├── generate_playlist.php# Calls Groq to generate song list from activity
│       ├── itunes_search.php    # Fetches artwork, preview URL, iTunes link
│       └── youtube_search.php   # Fetches YouTube video link for a song
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

```
User types an activity + picks song count
              ↓
       js/main.js (frontend)
              ↓
  POST → php/ajax/generate_playlist.php
              ↓
     Groq API (llama-3.1-8b-instant)
     returns JSON array of {title, artist}
              ↓
  Skeleton placeholders shown while loading
              ↓
  For each song — Promise.all() fires simultaneously:
    ├── POST → php/ajax/itunes_search.php
    │         iTunes Search API
    │         → artwork_url, preview_url, track_url
    │
    └── POST → php/ajax/youtube_search.php
              YouTube Data API v3
              → youtube_url
              ↓
  Song card rendered with:
    album art · title · artist
    audio preview · iTunes icon · YouTube icon
```

The PHP files act as a **secure server-side proxy** — API keys never leave the backend.

---

## 🚀 Getting Started

### Prerequisites

- PHP 7.4+ with **cURL** enabled
- A **Groq API key** → [console.groq.com](https://console.groq.com/)
- A **YouTube Data API v3 key** → [console.cloud.google.com](https://console.cloud.google.com/)
- iTunes Search API requires **no key** (public)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Sanchit09876/activity-playlist-generator.git
   cd activity-playlist-generator
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

3. **Serve the project**
   ```bash
   php -S localhost:8000
   ```
   Open [http://localhost:8000](http://localhost:8000) in your browser.

> ⚠️ **Never commit your `.env` file.** It is already covered by `.gitignore`.

---

## 🎮 How to Use

1. Type an activity in the input field — e.g., *"late night drive"*, *"deep focus work"*, *"post-workout cooldown"*.
2. Use the slider to pick how many songs you want (5–10).
3. Hit **Generate Playlist** — skeleton cards appear while results load, then fill in with album art, a 30-second preview, and iTunes + YouTube links.
4. Not sure what to type? Click **Random Activity** to get a surprise suggestion.

---

## 🔐 Environment Variables

| Variable           | Description                        | Required |
|--------------------|------------------------------------|----------|
| `GROQ_API_KEY`     | Groq LLM API key                   | ✅ Yes   |
| `YOUTUBE_API_KEY`  | YouTube Data API v3 key            | ✅ Yes   |

iTunes Search API is public and needs no key.

---

## 📄 License

This project was built for learning purposes. Feel free to explore the code and get inspired, but please don't copy and present it as your own work.

---

## 👤 Author

**Sanchit Maharjan** — [@Sanchit09876](https://github.com/Sanchit09876)
