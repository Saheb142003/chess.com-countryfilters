import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import SidebarFilters from "./components/SidebarFilters";
import GameList from "./components/GameList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedOpening, setSelectedOpening] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [filterMode, setFilterMode] = useState("country"); // "country" or "opening"
  const [opponentQuery, setOpponentQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverReady, setServerReady] = useState(
    API_URL.includes("localhost") || API_URL.includes("127.0.0.1")
  );

  useEffect(() => {
    if (serverReady) return;

    let interval;
    const checkServer = async () => {
      try {
        await axios.get(`${API_URL}/`);
        setServerReady(true);
        if (interval) clearInterval(interval);
      } catch (err) {
        console.log("Waiting for server to wake up...");
      }
    };
    
    checkServer();
    interval = setInterval(checkServer, 3000);

    return () => clearInterval(interval);
  }, [serverReady]);

  const fetchGames = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setSelectedCountry("");
    setSelectedOpening("");
    setSelectedTimeRange("all");
    setSelectedResult("");
    setSelectedType("");
    setOpponentQuery("");
    try {
      const res = await axios.get(
        `${API_URL}/api/chess/${username}`
      );
      setData(res.data);
      if (Object.keys(res.data).length === 0) {
        setError("No games found for this user in recent archives.");
      }
    } catch (err) {
      console.error(err);
      setError("User not found or Chess.com API error.");
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    let games = Object.values(data).flat();
    
    // Time Range Filter
    const now = Math.floor(Date.now() / 1000);
    if (selectedTimeRange === "week") {
      games = games.filter(g => g.timestamp >= now - (7 * 24 * 60 * 60));
    } else if (selectedTimeRange === "month") {
      games = games.filter(g => g.timestamp >= now - (30 * 24 * 60 * 60));
    } else if (selectedTimeRange === "3months") {
      games = games.filter(g => g.timestamp >= now - (90 * 24 * 60 * 60));
    }

    if (selectedCountry) {
      games = games.filter(g => g.country === selectedCountry);
    }

    if (selectedOpening) {
      games = games.filter(g => (g.baseOpening || g.opening) === selectedOpening);
    }

    if (selectedResult) {
      games = games.filter(g => {
        const res = g.result;
        let category = "loss";
        if (res === "win") category = "win";
        else if (["draw", "stalemate", "repetition", "insufficient", "50move", "agreed", "timevsinsufficient"].includes(res)) category = "draw";
        
        return category === selectedResult;
      });
    }

    if (selectedType) {
      games = games.filter(g => g.timeClass === selectedType);
    }

    if (opponentQuery) {
      games = games.filter(g => g.opponent.toLowerCase().includes(opponentQuery.toLowerCase()));
    }

    return games.sort((a, b) => b.timestamp - a.timestamp);
  }, [data, selectedCountry, selectedOpening, selectedResult, selectedType, opponentQuery]);

  return (
    <div className="container">
      <header>
        <h1 className="title">Chess.com <span>Analysis</span></h1>
      </header>

      {!serverReady ? (
        <div className="loader-box" style={{ marginTop: '4rem' }}>
          <div className="chess-loader"></div>
          <p style={{ fontWeight: '600' }}>Waking up server...</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>This may take up to 50 seconds on free hosting.</p>
        </div>
      ) : (
        <>
          <div className="search-box">
        <input
          type="text"
          placeholder="Chess.com Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchGames()}
        />
        <button onClick={fetchGames} disabled={loading}>
          {loading ? "..." : "Analyze"}
        </button>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="chess-loader"></div>
          <p style={{ fontWeight: '600' }}>Fetching game archives...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', color: 'var(--danger)', marginBottom: '2rem', padding: '1rem', background: 'rgba(250, 49, 45, 0.1)', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {!loading && Object.keys(data).length > 0 && (
        <div className="main-layout">
          <SidebarFilters
            countries={Object.keys(data)}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedOpening={selectedOpening}
            setSelectedOpening={setSelectedOpening}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            selectedResult={selectedResult}
            setSelectedResult={setSelectedResult}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            gameData={data}
          />

          <div className="content-area">
            <div className="local-search-bar" style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search Opponent Username..."
                value={opponentQuery}
                onChange={(e) => setOpponentQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  background: 'var(--bg-sidebar)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
            <GameList
              games={filteredGames}
              selectedCountry={selectedCountry}
              selectedResult={selectedResult}
              selectedType={selectedType}
            />
          </div>
        </div>
      )}

      {!loading && !error && Object.keys(data).length === 0 && !username && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
          <p>Enter a username to analyze their global performance.</p>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default App;
