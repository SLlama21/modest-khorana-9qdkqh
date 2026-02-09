import React, { useState, useEffect } from "react";

export default function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("fortnite-wins");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Player 1", wins: 0 },
          { name: "Player 2", wins: 0 }
        ];
  });
  const [newPlayer, setNewPlayer] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("fortnite-wins", JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    setPlayers([...players, { name: newPlayer, wins: 0 }]);
    setNewPlayer("");
  };

  const updateWins = (index, delta) => {
    setPlayers(players.map((p, i) => {
      if (i === index) {
        return { ...p, wins: Math.max(0, p.wins + delta), bump: delta > 0 };
      }
      return p;
    }));

    setTimeout(() => {
      setPlayers(p => p.map(pl => ({ ...pl, bump: false })));
    }, 250);
  };

  const deletePlayer = (index) => {
    if (!window.confirm("Remove this player?")) return;
    setPlayers(players.filter((_, i) => i !== index));
  };

  const renamePlayer = (index, name) => {
    setPlayers(players.map((p, i) => (i === index ? { ...p, name } : p)));
  };

  const resetSeason = () => {
    if (!window.confirm("Reset all wins for everyone?")) return;
    setPlayers(players.map(p => ({ ...p, wins: 0 })));
  };

  const maxWins = Math.max(...players.map(p => p.wins), 0);
  const totalWins = players.reduce((sum, p) => sum + p.wins, 0);

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}
      </style>

      <div style={styles.titleRow}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0e/FortniteLogo.svg"
          alt="Fortnite"
          style={styles.logo}
        />
        <h1 style={styles.titleText}>Wins</h1>
      </div>

      <div style={styles.statsBar}>
        <span>Total Household Wins: {totalWins}</span>
        <button style={styles.resetButton} onClick={resetSeason}>
          Reset Season
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.addRow}>
          <input
            style={styles.input}
            placeholder="Add player"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
          />
          <button style={styles.addButton} onClick={addPlayer}>
            + Add
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {players.map((player, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              ...(player.wins === maxWins && maxWins > 0 ? styles.leader : {}),
              ...(player.bump ? styles.bump : {})
            }}
          >
            {editingIndex === index ? (
              <input
                style={styles.renameInput}
                value={player.name}
                onChange={(e) => renamePlayer(index, e.target.value)}
                onBlur={() => setEditingIndex(null)}
                autoFocus
              />
            ) : (
              <h2
                style={styles.playerName}
                onClick={() => setEditingIndex(index)}
              >
                {player.name}
                {player.wins === maxWins && maxWins > 0 && (
                  <span style={styles.crown}>👑</span>
                )}
              </h2>
            )}

            <p style={styles.wins}>{player.wins} Wins</p>

            <div style={styles.buttonRow}>
              <button
                style={styles.minusButton}
                onClick={() => updateWins(index, -1)}
              >
                −
              </button>
              <button
                style={styles.plusButton}
                onClick={() => updateWins(index, 1)}
              >
                + Win
              </button>
            </div>

            <button
              style={styles.deleteButton}
              onClick={() => deletePlayer(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <p style={styles.hint}>Tap a name to rename • Crown = leader</p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Bebas Neue, Arial, sans-serif",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #00B3FF, #0077FF)",
    maxWidth: "900px",
    margin: "0 auto"
  },
  titleRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px"
  },
  logo: {
    height: "48px"
  },
  titleText: {
    color: "white",
    fontSize: "36px",
    letterSpacing: "2px"
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "18px"
  },
  resetButton: {
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#FF4D4D",
    color: "white",
    fontSize: "16px"
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
  },
  addRow: {
    display: "flex",
    gap: "10px",
    width: "100%"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    flex: 1,
    borderRadius: "8px",
    border: "none"
  },
  addButton: {
    padding: "10px 18px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FFD800"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  },
  card: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
    textAlign: "center"
  },
  leader: {
    boxShadow: "0 0 28px gold",
    border: "3px solid gold"
  },
  bump: {
    transform: "scale(1.07)"
  },
  playerName: {
    fontSize: "22px",
    cursor: "pointer"
  },
  crown: {
    marginLeft: "6px"
  },
  renameInput: {
    fontSize: "20px",
    textAlign: "center",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  wins: {
    fontSize: "24px",
    color: "#0077FF"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px"
  },
  minusButton: {
    padding: "8px 14px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#FF4D4D",
    color: "white"
  },
  plusButton: {
    padding: "8px 14px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2ECC71",
    color: "white"
  },
  deleteButton: {
    marginTop: "8px",
    background: "transparent",
    border: "none",
    color: "#777",
    cursor: "pointer"
  },
  hint: {
    marginTop: "18px",
    textAlign: "center",
    color: "white",
    fontSize: "14px",
    opacity: 0.9
  }
};
