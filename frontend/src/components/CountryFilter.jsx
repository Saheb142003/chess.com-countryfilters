import { useState } from "react";

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
  "ZW": { name: "Zimbabwe", flag: "🇿🇼" }, "XA": { name: "International", flag: "🌍" }, "XX": { name: "Unknown", flag: "🏳️" }
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

function CountryFilter({ countries, selectedCountry, setSelectedCountry, gameData, selectedResult, setSelectedResult, selectedType, setSelectedType }) {
  const [countryQuery, setCountryQuery] = useState("");
  const allGames = Object.values(gameData).flat();
  const getCountByType = (typeId) => allGames.filter(g => typeId === "" || g.timeClass === typeId).length;

  const filteredCountries = countries.filter(code => {
    const info = getCountryInfo(code);
    return info.name.toLowerCase().includes(countryQuery.toLowerCase());
  }).sort((a, b) => (gameData[b]?.length || 0) - (gameData[a]?.length || 0));

  return (
    <div className="sidebar">
      <div className="filter-container">
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

      <div className="filter-container" style={{ marginTop: '1rem' }}>
        <h2 className="filter-title">Countries</h2>
        
        <input
          type="text"
          placeholder="Filter Countries..."
          value={countryQuery}
          onChange={(e) => setCountryQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            background: 'var(--bg-dark)',
            border: '1px solid var(--glass-border)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            outline: 'none'
          }}
        />

        <div className="countries-grid">
          <div 
            className={`country-item ${selectedCountry === "" ? 'active' : ''}`}
            onClick={() => setSelectedCountry("")}
          >
            <div className="flag-box">🌍</div>
            <div style={{ flex: 1 }}>
              <span className="country-name">Global Origin</span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                {countries.length} Regions
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{allGames.length}</span>
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
                <div className="flag-box">{info.flag}</div>
                <span className="country-name">{info.name}</span>
                <div className="country-stats">
                  <span style={{ color: 'var(--success)' }}>{w}</span>
                  <span style={{ color: 'var(--danger)' }}>{l}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{d}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CountryFilter;
