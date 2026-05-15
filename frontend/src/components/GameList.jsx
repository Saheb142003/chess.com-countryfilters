function GameList({ games, selectedCountry, selectedResult }) {
  const getCategory = (res) => {
    if (res === "win") return "win";
    if (["draw", "stalemate", "repetition", "insufficient", "50move", "agreed", "timevsinsufficient"].includes(res)) return "draw";
    return "loss";
  };

  const totalGames = games.length;
  const wins = games.filter(g => getCategory(g.result) === "win").length;
  const losses = games.filter(g => getCategory(g.result) === "loss").length;
  const draws = totalGames - wins - losses;

  return (
    <div className="content-area">
      <div className="stats-banner">
        <div className="stat-item">
          <div className="stat-label">{selectedCountry ? "Regional Games" : "Total Analyzed"}</div>
          <div className="stat-value">{totalGames}</div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div className="stat-item">
            <div className="stat-label">Wins</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{wins}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Losses</div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{losses}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Draws</div>
            <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{draws}</div>
          </div>
        </div>
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>No games found matching these criteria.</p>
        </div>
      ) : (
        <div className="games-list">
          {games.map((game, index) => {
            const category = getCategory(game.result);
            const indicatorLabel = category === "win" ? "W" : (category === "draw" ? "D" : "L");
            const indicatorClass = category === "win" ? "indicator-win" : (category === "draw" ? "indicator-draw" : "indicator-loss");
            
            const ratingChangeColor = game.ratingChange > 0 ? 'var(--success)' : (game.ratingChange < 0 ? 'var(--danger)' : 'var(--text-muted)');
            const ratingSign = game.ratingChange > 0 ? '+' : '';

            return (
              <a 
                href={game.url} 
                target="_blank" 
                rel="noreferrer" 
                className="game-card" 
                key={index}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div className="game-header">
                  <div className="opponent-box">
                    <div className={`game-result-indicator ${indicatorClass}`}>
                      {indicatorLabel}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{game.opponent}</span>
                        <span className="rating-badge">({game.opponentRating})</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Against {game.country.replace(/-/g, ' ')} • {game.date}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{game.userRating}</span>
                      {game.ratingChange !== null && (
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: ratingChangeColor }}>
                          {ratingSign}{game.ratingChange}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                      {game.timeClass}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '700' }}>Opening</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>{game.opening}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Result: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{game.result}</span>
                  </div>
                  <div className="view-btn" style={{ fontSize: '0.75rem' }}>
                    Click to Analyze ↗
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GameList;
