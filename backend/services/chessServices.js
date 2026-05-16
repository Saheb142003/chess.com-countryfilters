import axios from "axios";

// Chess.com strongly enforces User-Agent headers, especially from cloud IPs like Render.
const chessApi = axios.create({
  headers: {
    "User-Agent": "ChessCountryFilterApp/1.0 (https://github.com/Saheb142003/chess.com-countryfilters)"
  }
});

const countryCache = new Map();

async function getPlayerArchives(username) {
  const archivesRes = await chessApi.get(
    "https://api.chess.com/pub/player/" + username + "/games/archives"
  );
  return archivesRes.data.archives || [];
}

async function getGamesFromArchive(url) {
  const res = await chessApi.get(url);
  return res.data.games || [];
}

async function getOpponentCountry(oppo) {
  if (countryCache.has(oppo)) return countryCache.get(oppo);

  try {
    const profileRes = await chessApi.get("https://api.chess.com/pub/player/" + oppo);
    const countryUrl = profileRes.data.country;
    if (!countryUrl) return "Unknown";
    const parts = countryUrl.split("/");
    const countryCode = parts[parts.length - 1];
    countryCache.set(oppo, countryCode);
    return countryCode;
  } catch (err) {
    console.error(`Error fetching profile for ${oppo}:`, err.message);
    return "Unknown";
  }
}

export async function fetchGamesByCountry(username) {
  const archives = await getPlayerArchives(username);
  
  // Fetch last 6 archives (6 months of data)
  const recentArchives = archives.slice(-6);
  const archivePromises = recentArchives.map(url => getGamesFromArchive(url));
  const gamesArrays = await Promise.all(archivePromises);
  const allGamesData = gamesArrays.flat();

  // Sort ASCENDING for rating calculation
  allGamesData.sort((a, b) => a.end_time - b.end_time);

  // Step 1: Deduplicate opponents
  const uniqueOpponents = new Set();
  allGamesData.forEach(game => {
    const white = game.white.username.toLowerCase();
    const black = game.black.username.toLowerCase();
    uniqueOpponents.add(white === username.toLowerCase() ? black : white);
  });

  // Step 2: Fetch countries in parallel batches
  const opponentsToFetch = Array.from(uniqueOpponents).filter(oppo => !countryCache.has(oppo));
  const batchSize = 15;
  for (let i = 0; i < opponentsToFetch.length; i += batchSize) {
    const batch = opponentsToFetch.slice(i, i + batchSize);
    await Promise.all(batch.map(oppo => getOpponentCountry(oppo)));
  }

  // Step 3: Process games
  const lastRatings = {};
  let allGames = [];

  for (const game of allGamesData) {
    const white = game.white.username.toLowerCase();
    const black = game.black.username.toLowerCase();
    const isWhite = white === username.toLowerCase();
    
    const opponent = isWhite ? black : white;
    const userRating = isWhite ? game.white.rating : game.black.rating;
    const opponentRating = isWhite ? game.black.rating : game.white.rating;
    const timeClass = game.time_class;
    
    let ratingChange = null;
    if (lastRatings[timeClass] !== undefined) {
      ratingChange = userRating - lastRatings[timeClass];
    }
    lastRatings[timeClass] = userRating;

    const country = countryCache.get(opponent) || "Unknown";
    const userResultCode = isWhite ? game.white.result : game.black.result;
    
    // Extract Opening from PGN (More robust regex)
    let opening = "Standard Opening";
    if (game.pgn) {
      const openingMatch = game.pgn.match(/\[Opening\s+"(.*?)"\]/);
      const ecoUrlMatch = game.pgn.match(/\[ECOUrl\s+"https:\/\/www\.chess\.com\/openings\/(.*?)"\]/);
      
      if (openingMatch && openingMatch[1] && openingMatch[1] !== "Unknown Opening") {
        opening = openingMatch[1];
      } else if (ecoUrlMatch && ecoUrlMatch[1]) {
        // Convert URL-slug (Sicilian-Defense) to readable name (Sicilian Defense)
        opening = ecoUrlMatch[1].split('/').pop().replace(/-/g, ' ');
      }
    }
    
    // Intelligent Base Opening extraction
    let baseOpening = opening;
    const majorWords = ["Defense", "Game", "Opening", "Gambit", "System", "Attack", "Countergambit", "Counterattack", "Counter-Attack"];
    
    // Split into words and find the first major word
    const words = opening.split(/\s+/);
    let majorIdx = -1;
    for (let i = 0; i < words.length; i++) {
      // Clean word of punctuation for matching
      const cleanWord = words[i].replace(/[:\(\)\[\]\-\d\.]/g, "");
      if (majorWords.includes(cleanWord)) {
        majorIdx = i;
        break;
      }
    }

    if (majorIdx !== -1) {
      baseOpening = words.slice(0, majorIdx + 1).join(" ").replace(/[:\(\)\[\]\-\d\.]/g, "").trim();
    } else {
      // Fallback: take first 2-3 words or split by common punctuation
      baseOpening = opening.split(/[:\(\d\-\[\]]/)[0].trim();
    }

    // Special case normalization
    if (baseOpening.toLowerCase().includes("kings indian")) baseOpening = "Kings Indian Defense";
    if (baseOpening.toLowerCase().includes("queens indian")) baseOpening = "Queens Indian Defense";
    if (baseOpening.toLowerCase().includes("caro kann")) baseOpening = "Caro-Kann Defense";
    if (baseOpening.toLowerCase().includes("sicilian")) baseOpening = "Sicilian Defense";
    if (baseOpening.toLowerCase().includes("french")) baseOpening = "French Defense";
    if (baseOpening.toLowerCase().includes("scandinavian")) baseOpening = "Scandinavian Defense";
    if (baseOpening.toLowerCase().includes("ruy lopez")) baseOpening = "Ruy Lopez";
    if (baseOpening.toLowerCase().includes("giuoco piano")) baseOpening = "Giuoco Piano";
    
    allGames.push({
      opponent,
      country,
      result: userResultCode,
      userRating,
      opponentRating,
      ratingChange,
      timeClass,
      opening,
      baseOpening,
      fen: game.fen,
      date: new Date(game.end_time * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      timestamp: game.end_time,
      url: game.url,
    });
  }

  allGames.sort((a, b) => b.timestamp - a.timestamp);

  const grouped = {};
  for (const game of allGames) {
    if (!grouped[game.country]) grouped[game.country] = [];
    grouped[game.country].push(game);
  }

  return grouped;
}
