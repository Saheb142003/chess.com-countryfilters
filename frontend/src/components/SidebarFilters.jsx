import { useState, useMemo } from "react";

// Mapping of Chess.com country codes to names and flags
const COUNTRY_MAP = {
  "AF": { name: "Afghanistan", flag: "🇦🇫" }, "AX": { name: "Aland Islands", flag: "🇦🇽" }, "AL": { name: "Albania", flag: "🇦🇱" }, 
  "DZ": { name: "Algeria", flag: "🇩🇿" }, "AS": { name: "American Samoa", flag: "🇦🇸" }, "AD": { name: "Andorra", flag: "🇦🇩" }, 
  "AO": { name: "Angola", flag: "🇦🇴" }, "AI": { name: "Anguilla", flag: "🇦🇮" }, "AQ": { name: "Antarctica", flag: "🇦🇶" }, 
  "AG": { name: "Antigua and Barbuda", flag: "🇦🇬" }, "AR": { name: "Argentina", flag: "🇦🇷" }, "AM": { name: "Armenia", flag: "🇦🇲" }, 
  "AW": { name: "Aruba", flag: "🇦🇼" }, "AU": { name: "Australia", flag: "🇦🇺" }, "AT": { name: "Austria", flag: "🇦🇹" }, 
  "AZ": { name: "Azerbaijan", flag: "🇦🇿" }, "BS": { name: "Bahamas", flag: "🇧🇸" }, "BH": { name: "Bahrain", flag: "🇧🇭" }, 
  "BD": { name: "Bangladesh", flag: "🇧🇩" }, "BB": { name: "Barbados", flag: "🇧🇧" }, "BY": { name: "Belarus", flag: "🇧🇾" }, 
  "BE": { name: "Belgium", flag: "🇧🇪" }, "BZ": { name: "Belize", flag: "🇧🇿" }, "BJ": { name: "Benin", flag: "🇧🇯" }, 
  "BM": { name: "Bermuda", flag: "🇧🇲" }, "BT": { name: "Bhutan", flag: "🇧🇹" }, "BO": { name: "Bolivia", flag: "🇧🇴" }, 
  "BA": { name: "Bosnia and Herzegovina", flag: "🇧🇦" }, "BW": { name: "Botswana", flag: "🇧🇼" }, "BV": { name: "Bouvet Island", flag: "🇧🇻" }, 
  "BR": { name: "Brazil", flag: "🇧🇷" }, "IO": { name: "British Indian Ocean Territory", flag: "🇮🇴" }, "BN": { name: "Brunei Darussalam", flag: "🇧🇳" }, 
  "BG": { name: "Bulgaria", flag: "🇧🇬" }, "BF": { name: "Burkina Faso", flag: "🇧🇫" }, "BI": { name: "Burundi", flag: "🇧🇮" }, 
  "KH": { name: "Cambodia", flag: "🇰🇭" }, "CM": { name: "Cameroon", flag: "🇨🇲" }, "CA": { name: "Canada", flag: "🇨🇦" }, 
  "CV": { name: "Cape Verde", flag: "🇨🇻" }, "KY": { name: "Cayman Islands", flag: "🇰🇾" }, "CF": { name: "Central African Republic", flag: "🇨🇫" }, 
  "TD": { name: "Chad", flag: "🇹🇩" }, "CL": { name: "Chile", flag: "🇨🇱" }, "CN": { name: "China", flag: "🇨🇳" }, 
  "CX": { name: "Christmas Island", flag: "🇨🇽" }, "CC": { name: "Cocos (Keeling) Islands", flag: "🇨🇨" }, "CO": { name: "Colombia", flag: "🇨🇴" }, 
  "KM": { name: "Comoros", flag: "🇰🇲" }, "CG": { name: "Congo", flag: "🇨🇬" }, "CD": { name: "Congo, Democratic Republic of the", flag: "🇨🇩" }, 
  "CK": { name: "Cook Islands", flag: "🇨🇰" }, "CR": { name: "Costa Rica", flag: "🇨🇷" }, "CI": { name: "Cote d'Ivoire", flag: "🇨🇮" }, 
  "HR": { name: "Croatia", flag: "🇭🇷" }, "CU": { name: "Cuba", flag: "🇨🇺" }, "CY": { name: "Cyprus", flag: "🇨🇾" }, 
  "CZ": { name: "Czech Republic", flag: "🇨🇿" }, "DK": { name: "Denmark", flag: "🇩🇰" }, "DJ": { name: "Djibouti", flag: "🇩🇯" }, 
  "DM": { name: "Dominica", flag: "🇩🇲" }, "DO": { name: "Dominican Republic", flag: "🇩🇴" }, "EC": { name: "Ecuador", flag: "🇪🇨" }, 
  "EG": { name: "Egypt", flag: "🇪🇬" }, "SV": { name: "El Salvador", flag: "🇸🇻" }, "GQ": { name: "Equatorial Guinea", flag: "🇬🇶" }, 
  "ER": { name: "Eritrea", flag: "🇪🇷" }, "EE": { name: "Estonia", flag: "🇪🇪" }, "ET": { name: "Ethiopia", flag: "🇪🇹" }, 
  "FK": { name: "Falkland Islands (Malvinas)", flag: "🇫🇰" }, "FO": { name: "Faroe Islands", flag: "🇫🇴" }, "FJ": { name: "Fiji", flag: "🇫🇯" }, 
  "FI": { name: "Finland", flag: "🇫🇮" }, "FR": { name: "France", flag: "🇫🇷" }, "GF": { name: "French Guiana", flag: "🇬🇫" }, 
  "PF": { name: "French Polynesia", flag: "🇵🇫" }, "TF": { name: "French Southern Territories", flag: "🇹🇫" }, "GA": { name: "Gabon", flag: "🇬🇦" }, 
  "GM": { name: "Gambia", flag: "🇬🇲" }, "GE": { name: "Georgia", flag: "🇬🇪" }, "DE": { name: "Germany", flag: "🇩🇪" }, 
  "GH": { name: "Ghana", flag: "🇬🇭" }, "GI": { name: "Gibraltar", flag: "🇬🇮" }, "GR": { name: "Greece", flag: "🇬🇷" }, 
  "GL": { name: "Greenland", flag: "🇬🇱" }, "GD": { name: "Grenada", flag: "🇬🇩" }, "GP": { name: "Guadeloupe", flag: "🇬🇵" }, 
  "GU": { name: "Guam", flag: "🇬🇺" }, "GT": { name: "Guatemala", flag: "🇬🇹" }, "GG": { name: "Guernsey", flag: "🇬🇬" }, 
  "GN": { name: "Guinea", flag: "🇬🇳" }, "GW": { name: "Guinea-Bissau", flag: "🇬🇼" }, "GY": { name: "Guyana", flag: "🇬🇾" }, 
  "HT": { name: "Haiti", flag: "🇭🇹" }, "HM": { name: "Heard Island and McDonald Islands", flag: "🇭🇲" }, 
  "VA": { name: "Holy See (Vatican City State)", flag: "🇻🇦" }, "HN": { name: "Honduras", flag: "🇭🇳" }, "HK": { name: "Hong Kong", flag: "🇭🇰" }, 
  "HU": { name: "Hungary", flag: "🇭🇺" }, "IS": { name: "Iceland", flag: "🇮🇸" }, "IN": { name: "India", flag: "🇮🇳" }, 
  "ID": { name: "Indonesia", flag: "🇮🇩" }, "IR": { name: "Iran", flag: "🇮🇷" }, "IQ": { name: "Iraq", flag: "🇮🇶" }, 
  "IE": { name: "Ireland", flag: "🇮🇪" }, "IM": { name: "Isle of Man", flag: "🇮🇲" }, "IL": { name: "Israel", flag: "🇮🇱" }, 
  "IT": { name: "Italy", flag: "🇮🇹" }, "JM": { name: "Jamaica", flag: "🇯🇲" }, "JP": { name: "Japan", flag: "🇯🇵" }, 
  "JE": { name: "Jersey", flag: "🇯🇪" }, "JO": { name: "Jordan", flag: "🇯🇴" }, "KZ": { name: "Kazakhstan", flag: "🇰🇿" }, 
  "KE": { name: "Kenya", flag: "🇰🇪" }, "KI": { name: "Kiribati", flag: "🇰🇮" }, 
  "KP": { name: "Korea, Democratic People's Republic of", flag: "🇰🇵" }, "KR": { name: "Korea, Republic of", flag: "🇰🇷" }, 
  "KW": { name: "Kuwait", flag: "🇰🇼" }, "KG": { name: "Kyrgyzstan", flag: "🇰🇬" }, 
  "LA": { name: "Lao People's Democratic Republic", flag: "🇱🇦" }, "LV": { name: "Latvia", flag: "🇱🇻" }, 
  "LB": { name: "Lebanon", flag: "🇱🇧" }, "LS": { name: "Lesotho", flag: "🇱🇸" }, "LR": { name: "Liberia", flag: "🇱🇷" }, 
  "LY": { name: "Libyan Arab Jamahiriya", flag: "🇱🇾" }, "LI": { name: "Liechtenstein", flag: "🇱🇮" }, "LT": { name: "Lithuania", flag: "🇱🇹" }, 
  "LU": { name: "Luxembourg", flag: "🇱🇺" }, "MO": { name: "Macao", flag: "🇲🇴" }, "MK": { name: "Macedonia", flag: "🇲🇰" }, 
  "MG": { name: "Madagascar", flag: "🇲🇬" }, "MW": { name: "Malawi", flag: "🇲🇼" }, "MY": { name: "Malaysia", flag: "🇲🇾" }, 
  "MV": { name: "Maldives", flag: "🇲🇻" }, "ML": { name: "Mali", flag: "🇲🇱" }, "MT": { name: "Malta", flag: "🇲🇹" }, 
  "MH": { name: "Marshall Islands", flag: "🇲🇭" }, "MQ": { name: "Martinique", flag: "🇲🇶" }, "MR": { name: "Mauritania", flag: "🇲🇷" }, 
  "MU": { name: "Mauritius", flag: "🇲🇺" }, "YT": { name: "Mayotte", flag: "🇾🇹" }, "MX": { name: "Mexico", flag: "🇲🇽" }, 
  "FM": { name: "Micronesia", flag: "🇫🇲" }, "MD": { name: "Moldova", flag: "🇲🇩" }, "MC": { name: "Monaco", flag: "🇲🇨" }, 
  "MN": { name: "Mongolia", flag: "🇲🇳" }, "ME": { name: "Montenegro", flag: "🇲🇪" }, "MS": { name: "Montserrat", flag: "🇲🇸" }, 
  "MA": { name: "Morocco", flag: "🇲🇦" }, "MZ": { name: "Mozambique", flag: "🇲🇿" }, "MM": { name: "Myanmar", flag: "🇲🇲" }, 
  "NA": { name: "Namibia", flag: "🇳🇦" }, "NR": { name: "Nauru", flag: "🇳🇷" }, "NP": { name: "Nepal", flag: "🇳🇵" }, 
  "NL": { name: "Netherlands", flag: "🇳🇱" }, "AN": { name: "Netherlands Antilles", flag: "🇳🇱" }, "NC": { name: "New Caledonia", flag: "🇳🇨" }, 
  "NZ": { name: "New Zealand", flag: "🇳🇿" }, "NI": { name: "Nicaragua", flag: "🇳🇮" }, "NE": { name: "Niger", flag: "🇳🇪" }, 
  "NG": { name: "Nigeria", flag: "🇳🇬" }, "NU": { name: "Niue", flag: "🇳🇺" }, "NF": { name: "Norfolk Island", flag: "🇳🇫" }, 
  "MP": { name: "Northern Mariana Islands", flag: "🇲🇵" }, "NO": { name: "Norway", flag: "🇳🇴" }, "OM": { name: "Oman", flag: "🇴🇲" }, 
  "PK": { name: "Pakistan", flag: "🇵🇰" }, "PW": { name: "Palau", flag: "🇵🇼" }, "PS": { name: "Palestinian Territory", flag: "🇵🇸" }, 
  "PA": { name: "Panama", flag: "🇵🇦" }, "PG": { name: "Papua New Guinea", flag: "🇵🇬" }, "PY": { name: "Paraguay", flag: "🇵🇾" }, 
  "PA": { name: "Panama", flag: "🇵🇦" }, "PG": { name: "Papua New Guinea", flag: "🇵🇬" }, "PY": { name: "Paraguay", flag: "🇵🇾" }, 
  "PE": { name: "Peru", flag: "🇵🇪" }, "PH": { name: "Philippines", flag: "🇵🇭" }, "PN": { name: "Pitcairn", flag: "🇵🇳" }, 
  "PL": { name: "Poland", flag: "🇵🇱" }, "PT": { name: "Portugal", flag: "🇵🇹" }, "PR": { name: "Puerto Rico", flag: "🇵🇷" }, 
  "QA": { name: "Qatar", flag: "🇶🇦" }, "RE": { name: "Reunion", flag: "🇷🇪" }, "RO": { name: "Romania", flag: "🇷🇴" }, 
  "RU": { name: "Russia", flag: "🇷🇺" }, "RW": { name: "Rwanda", flag: "🇷🇼" }, "SH": { name: "Saint Helena", flag: "🇸🇭" }, 
  "KN": { name: "Saint Kitts and Nevis", flag: "🇰🇳" }, "LC": { name: "Saint Lucia", flag: "🇱🇨" }, "PM": { name: "Saint Pierre and Miquelon", flag: "🇵🇲" }, 
  "VC": { name: "Saint Vincent and the Grenadines", flag: "🇻🇨" }, "WS": { name: "Samoa", flag: "🇼🇸" }, "SM": { name: "San Marino", flag: "🇸🇲" }, 
  "ST": { name: "Sao Tome and Principe", flag: "🇸🇹" }, "SA": { name: "Saudi Arabia", flag: "🇸🇦" }, "SN": { name: "Senegal", flag: "🇸🇳" }, 
  "RS": { name: "Serbia", flag: "🇷🇸" }, "SC": { name: "Seychelles", flag: "🇸🇨" }, "SL": { name: "Sierra Leone", flag: "🇸🇱" }, 
  "SG": { name: "Singapore", flag: "🇸🇬" }, "SK": { name: "Slovakia", flag: "🇸🇰" }, "SI": { name: "Slovenia", flag: "🇸🇮" }, 
  "SB": { name: "Solomon Islands", flag: "🇸🇧" }, "SO": { name: "Somalia", flag: "🇸🇴" }, "ZA": { name: "South Africa", flag: "🇿🇦" }, 
  "GS": { name: "South Georgia and the South Sandwich Islands", flag: "🇬🇸" }, "ES": { name: "Spain", flag: "🇪🇸" }, 
  "LK": { name: "Sri Lanka", flag: "🇱🇰" }, "SD": { name: "Sudan", flag: "🇸🇩" }, "SR": { name: "Suriname", flag: "🇸🇷" }, 
  "SJ": { name: "Svalbard and Jan Mayen", flag: "🇸🇯" }, "SZ": { name: "Swaziland", flag: "🇸🇿" }, "SE": { name: "Sweden", flag: "🇸🇪" }, 
  "CH": { name: "Switzerland", flag: "🇨🇭" }, "SY": { name: "Syrian Arab Republic", flag: "🇸🇾" }, "TW": { name: "Taiwan", flag: "🇹🇼" }, 
  "TJ": { name: "Tajikistan", flag: "🇹🇯" }, "TZ": { name: "Tanzania", flag: "🇹🇿" }, "TH": { name: "Thailand", flag: "🇹🇭" }, 
  "TL": { name: "Timor-Leste", flag: "🇹🇱" }, "TG": { name: "Togo", flag: "🇹🇬" }, "TK": { name: "Tokelau", flag: "🇹🇰" }, 
  "TO": { name: "Tonga", flag: "🇹🇴" }, "TT": { name: "Trinidad and Tobago", flag: "🇹🇹" }, "TN": { name: "Tunisia", flag: "🇹🇳" }, 
  "TR": { name: "Turkey", flag: "🇹🇷" }, "TM": { name: "Turkmenistan", flag: "🇹🇲" }, "TC": { name: "Turks and Caicos Islands", flag: "🇹🇨" }, 
  "TV": { name: "Tuvalu", flag: "🇹🇻" }, "UG": { name: "Uganda", flag: "🇺🇬" }, "UA": { name: "Ukraine", flag: "🇺🇦" }, 
  "AE": { name: "United Arab Emirates", flag: "🇦🇪" }, "GB": { name: "United Kingdom", flag: "🇬🇧" }, "US": { name: "United States", flag: "🇺🇸" }, 
  "UM": { name: "United States Minor Outlying Islands", flag: "🇺🇲" }, "UY": { name: "Uruguay", flag: "🇺🇾" }, "UZ": { name: "Uzbekistan", flag: "🇺🇿" }, 
  "VU": { name: "Vanuatu", flag: "🇻🇺" }, "VE": { name: "Venezuela", flag: "🇻🇪" }, "VN": { name: "Vietnam", flag: "🇻🇳" }, 
  "VG": { name: "Virgin Islands, British", flag: "🇻🇬" }, "VI": { name: "Virgin Islands, U.S.", flag: "🇻🇮" }, "WF": { name: "Wallis and Futuna", flag: "🇼🇫" }, 
  "EH": { name: "Western Sahara", flag: "🇪🇭" }, "YE": { name: "Yemen", flag: "🇾🇪" }, "ZM": { name: "Zambia", flag: "🇿🇲" }, 
  "ZW": { name: "Zimbabwe", flag: "🇿🇼" }, "XA": { name: "International", flag: "🌍" }, "XX": { name: "Unknown", flag: "🏳️" },
  "XS": { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, "XW": { name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" }, "XE": { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "XG": { name: "Northern Ireland", flag: "🇬🇧" }, "XC": { name: "Catalonia", flag: "🇪🇸" }
};

const getCountryInfo = (code) => {
  const upperCode = code ? code.toUpperCase() : "XX";
  return COUNTRY_MAP[upperCode] || { name: code, flag: "🏳️" };
};

const getCategory = (res) => {
  if (res === "win") return "win";
  if (["draw", "stalemate", "repetition", "insufficient", "50move", "agreed", "timevsinsufficient"].includes(res)) return "draw";
  return "loss";
};

function SidebarFilters({ 
  countries, 
  selectedCountry, 
  setSelectedCountry, 
  selectedOpening, 
  setSelectedOpening,
  selectedTimeRange,
  setSelectedTimeRange,
  filterMode,
  setFilterMode,
  gameData, 
  selectedResult, 
  setSelectedResult, 
  selectedType, 
  setSelectedType 
}) {
  const [query, setQuery] = useState("");
  
  const contextGames = useMemo(() => {
    let games = Object.values(gameData).flat();
    const now = Math.floor(Date.now() / 1000);

    // Filter by Time
    if (selectedTimeRange === "week") games = games.filter(g => g.timestamp >= now - (7 * 24 * 60 * 60));
    else if (selectedTimeRange === "month") games = games.filter(g => g.timestamp >= now - (30 * 24 * 60 * 60));
    else if (selectedTimeRange === "3months") games = games.filter(g => g.timestamp >= now - (90 * 24 * 60 * 60));

    // Filter by Type
    if (selectedType) games = games.filter(g => g.timeClass === selectedType);

    // Filter by Result
    if (selectedResult) {
      games = games.filter(g => {
        const res = g.result;
        let cat = "loss";
        if (res === "win") cat = "win";
        else if (["draw", "stalemate", "repetition", "insufficient", "50move", "agreed", "timevsinsufficient"].includes(res)) cat = "draw";
        return cat === selectedResult;
      });
    }
    return games;
  }, [gameData, selectedTimeRange, selectedType, selectedResult]);

  const getCountByType = (typeId) => {
    const raw = Object.values(gameData).flat();
    return raw.filter(g => typeId === "" || g.timeClass === typeId).length;
  };

  const openings = useMemo(() => {
    const grouped = contextGames.reduce((acc, game) => {
      const op = game.baseOpening || game.opening || "Unknown Opening";
      if (!acc[op]) acc[op] = [];
      acc[op].push(game);
      return acc;
    }, {});
    
    return Object.entries(grouped)
      .map(([name, games]) => ({ name, games, count: games.length }))
      .sort((a, b) => b.count - a.count);
  }, [contextGames]);

  const filteredCountries = useMemo(() => {
    const counts = contextGames.reduce((acc, g) => {
      acc[g.country] = (acc[g.country] || 0) + 1;
      return acc;
    }, {});

    return countries.filter(code => {
      const info = getCountryInfo(code);
      return info.name.toLowerCase().includes(query.toLowerCase());
    }).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
  }, [countries, contextGames, query]);

  const filteredOpenings = openings.filter(op => 
    op.name.toLowerCase().includes(query.toLowerCase())
  );

  const rawGames = useMemo(() => Object.values(gameData).flat(), [gameData]);
  const now = Math.floor(Date.now() / 1000);
  const getCountByTime = (range) => {
    if (range === "week") return rawGames.filter(g => g.timestamp >= now - (7 * 24 * 60 * 60)).length;
    if (range === "month") return rawGames.filter(g => g.timestamp >= now - (30 * 24 * 60 * 60)).length;
    if (range === "3months") return rawGames.filter(g => g.timestamp >= now - (90 * 24 * 60 * 60)).length;
    return rawGames.length;
  };

  return (
    <div className="sidebar">
      <div className="filter-container">
        <h2 className="filter-title">Time Range</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { id: "week", label: "1 Week" },
            { id: "month", label: "1 Month" },
            { id: "3months", label: "3 Months" },
            { id: "all", label: "All Data" }
          ].map((range) => (
            <button
              key={range.id}
              className={`result-btn ${selectedTimeRange === range.id ? 'active' : ''}`}
              onClick={() => setSelectedTimeRange(range.id)}
              style={{ padding: '0.5rem', fontSize: '0.75rem', justifyContent: 'center', flexDirection: 'column', gap: '2px' }}
            >
              <span style={{ fontWeight: '700' }}>{range.label}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{getCountByTime(range.id)} games</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-container" style={{ marginTop: '1.5rem' }}>
        <h2 className="filter-title">Game Type</h2>
        <div className="result-filters">
          {[
            { id: "blitz", label: "Blitz", icon: "⚡" },
            { id: "bullet", label: "Bullet", icon: "🚄" },
            { id: "rapid", label: "Rapid", icon: "⏲️" },
            { id: "", label: "All Types", icon: "♟️" }
          ].map((type) => (
            <button
              key={type.id}
              className={`result-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{getCountByType(type.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-container" style={{ marginTop: '1.5rem' }}>
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${filterMode === 'country' ? 'active' : ''}`}
            onClick={() => { setFilterMode('country'); setQuery(""); }}
          >
            🌍 Countries
          </button>
          <button 
            className={`tab-btn ${filterMode === 'opening' ? 'active' : ''}`}
            onClick={() => { setFilterMode('opening'); setQuery(""); }}
          >
            ♟️ Openings
          </button>
        </div>
        
        <input
          type="text"
          placeholder={`Search ${filterMode === 'country' ? 'Countries' : 'Openings'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            background: 'var(--bg-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.8rem',
            margin: '1rem 0',
            outline: 'none'
          }}
        />

        <div className="countries-grid">
          {filterMode === 'country' ? (
            <>
              <div 
                className={`country-item ${selectedCountry === "" ? 'active' : ''}`}
                onClick={() => setSelectedCountry("")}
              >
                <div className="flag-box">
              <img 
                src="https://flagcdn.com/w40/un.png" 
                alt="Global"
                style={{ width: '20px', borderRadius: '2px', display: 'block' }}
              />
            </div>
                <div style={{ flex: 1 }}>
                  <span className="country-name">Global Origin</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {countries.length} Regions
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{contextGames.length}</span>
              </div>
              
              {filteredCountries.map((countryCode) => {
                const info = getCountryInfo(countryCode);
                const games = gameData[countryCode] || [];
                const w = games.filter(g => getCategory(g.result) === "win").length;
                const l = games.filter(g => getCategory(g.result) === "loss").length;
                const d = games.length - w - l;

                return (
                  <div
                    key={countryCode}
                    className={`country-item ${selectedCountry === countryCode ? 'active' : ''}`}
                    onClick={() => setSelectedCountry(countryCode)}
                  >
                    <div className="flag-box">
                      {countryCode === "XA" ? (
                         <img 
                          src="https://flagcdn.com/w40/un.png" 
                          alt="International"
                          style={{ width: '20px', borderRadius: '2px', display: 'block' }}
                        />
                      ) : countryCode === "XX" ? (
                        <div style={{ 
                          width: '20px', 
                          height: '14px', 
                          background: '#4a4845', 
                          borderRadius: '2px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '8px',
                          color: 'var(--text-muted)',
                          fontWeight: '800'
                        }}>?</div>
                      ) : (
                        <img 
                          src={
                            (countryCode.toLowerCase() === "xs" || countryCode.toLowerCase() === "gb-sct") ? "https://flagcdn.com/w40/gb-sct.png" :
                            (countryCode.toLowerCase() === "xw" || countryCode.toLowerCase() === "gb-wls") ? "https://flagcdn.com/w40/gb-wls.png" :
                            (countryCode.toLowerCase() === "xe" || countryCode.toLowerCase() === "gb-eng") ? "https://flagcdn.com/w40/gb-eng.png" :
                            (countryCode.toLowerCase() === "xg" || countryCode.toLowerCase() === "gb-nir") ? "https://flagcdn.com/w40/gb-nir.png" :
                            (countryCode.toLowerCase() === "xc" || countryCode.toLowerCase() === "es-ct" || countryCode.toLowerCase() === "es-ca") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/32px-Flag_of_Catalonia.svg.png" :
                            `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
                          } 
                          alt={info.name}
                          style={{ width: '20px', borderRadius: '2px', display: 'block' }}
                        />
                      )}
                    </div>
                    <span className="country-name">{info.name}</span>
                    <div className="country-stats">
                      <span style={{ color: 'var(--success)' }}>{w}</span>
                      <span style={{ color: 'var(--danger)' }}>{l}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{d}</span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div 
                className={`country-item ${selectedOpening === "" ? 'active' : ''}`}
                onClick={() => setSelectedOpening("")}
              >
                <div className="flag-box">♟️</div>
                <div style={{ flex: 1 }}>
                  <span className="country-name">All Openings</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {openings.length} Families
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{contextGames.length}</span>
              </div>

              {filteredOpenings.map((op) => {
                const w = op.games.filter(g => getCategory(g.result) === "win").length;
                const l = op.games.filter(g => getCategory(g.result) === "loss").length;
                const d = op.count - w - l;

                return (
                  <div
                    key={op.name}
                    className={`country-item ${selectedOpening === op.name ? 'active' : ''}`}
                    onClick={() => setSelectedOpening(op.name)}
                  >
                    <div className="flag-box" style={{ fontSize: '1rem' }}>📖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="country-name" title={op.name}>{op.name}</span>
                    </div>
                    <div className="country-stats">
                      <span style={{ color: 'var(--success)' }}>{w}</span>
                      <span style={{ color: 'var(--danger)' }}>{l}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{d}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarFilters;
