
import React, { useEffect, useMemo, useState } from "react";

const seasons = [
  "Season 1",
  "Season 1 Bonus",
  "Season 2",
  "Season 2 Bonus",
  "Season 3",
];

const defaultEpisodes = [
  { id: 1, season: "Season 1", title: "Episode 01", number: "01", thumbnail: "", videoUrl: "" },
  { id: 2, season: "Season 1", title: "Episode 02", number: "02", thumbnail: "", videoUrl: "" },
  { id: 3, season: "Season 1", title: "Episode 03", number: "03", thumbnail: "", videoUrl: "" },
  { id: 4, season: "Season 1 Bonus", title: "Bonus Special 01", number: "B1", thumbnail: "", videoUrl: "" },
  { id: 5, season: "Season 2", title: "Episode 01", number: "01", thumbnail: "", videoUrl: "" },
  { id: 6, season: "Season 2", title: "Episode 02", number: "02", thumbnail: "", videoUrl: "" },
  { id: 7, season: "Season 2 Bonus", title: "Bonus Special 01", number: "B1", thumbnail: "", videoUrl: "" },
];

const emptyForm = {
  season: "Season 1",
  title: "",
  number: "",
  thumbnail: "",
  videoUrl: "",
};

export default function App() {
  const [episodes, setEpisodes] = useState(() => {
    try {
      const saved = localStorage.getItem("igl-episodes");
      return saved ? JSON.parse(saved) : defaultEpisodes;
    } catch {
      return defaultEpisodes;
    }
  });

  const [activeSeason, setActiveSeason] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem("igl-episodes", JSON.stringify(episodes));
  }, [episodes]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => {
      const seasonMatch =
        activeSeason === "All" || episode.season === activeSeason;

      const searchMatch =
        `${episode.title} ${episode.season} ${episode.number}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return seasonMatch && searchMatch;
    });
  }, [episodes, activeSeason, search]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function saveEpisode(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.number.trim()) {
      alert("Please enter an episode title and number.");
      return;
    }

    if (editingId !== null) {
      setEpisodes((previous) =>
        previous.map((episode) =>
          episode.id === editingId
            ? { ...episode, ...form }
            : episode
        )
      );
    } else {
      const newEpisode = {
        ...form,
        id: Date.now(),
      };

      setEpisodes((previous) => [...previous, newEpisode]);
    }

    setForm(emptyForm);
    setEditingId(null);
    alert("Episode saved successfully!");
  }

  function editEpisode(episode) {
    setForm({
      season: episode.season,
      title: episode.title,
      number: episode.number,
      thumbnail: episode.thumbnail || "",
      videoUrl: episode.videoUrl || "",
    });

    setEditingId(episode.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEpisode(id) {
    if (!window.confirm("Are you sure you want to delete this episode?")) {
      return;
    }

    setEpisodes((previous) =>
      previous.filter((episode) => episode.id !== id)
    );

    if (selectedEpisode?.id === id) {
      setSelectedEpisode(null);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">L</span>
          <span>INDIA'S GOT <b>LATENT</b></span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#episodes">Episodes</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="nav-button"
          onClick={() => setAdminOpen(!adminOpen)}
        >
          {adminOpen ? "Close Admin ×" : "Admin ⚙"}
        </button>
      </header>

      <main>
        {adminOpen && (
          <section className="admin-section" id="admin">
            <div className="section-heading">
              <div>
                <span className="section-kicker">CONTROL PANEL</span>
                <h2>Admin <span>Dashboard.</span></h2>
                <p>Manage your authorised episode information.</p>
              </div>

              <span className="episode-count">
                {episodes.length} EPISODES
              </span>
            </div>

            <form className="admin-form" onSubmit={saveEpisode}>
              <h3>{editingId !== null ? "Edit Episode" : "Add New Episode"}</h3>

              <label>Season</label>
              <select
                name="season"
                value={form.season}
                onChange={handleFormChange}
              >
                {seasons.map((season) => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>

              <label>Episode Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Example: Episode 04"
                required
              />

              <label>Episode Number</label>
              <input
                name="number"
                value={form.number}
                onChange={handleFormChange}
                placeholder="Example: 04 or B2"
                required
              />

              <label>Thumbnail Image URL</label>
              <input
                name="thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />

              <label>Authorised Video URL</label>
              <input
                name="videoUrl"
                type="url"
                value={form.videoUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/your-video.m3u8"
              />

              <div className="admin-actions">
                <button className="primary-button" type="submit">
                  {editingId !== null ? "Save Changes" : "+ Add Episode"}
                </button>

                {editingId !== null && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="admin-notice">
                Prototype dashboard: changes are saved in this browser only.
                Do not use this as a secure admin login.
              </p>
            </form>

            <div className="admin-list">
              <h3>Manage Episodes</h3>

              {episodes.map((episode) => (
                <div className="admin-item" key={episode.id}>
                  <div>
                    <strong>{episode.title}</strong>
                    <span>{episode.season} · {episode.number}</span>
                  </div>

                  <div className="admin-item-actions">
                    <button onClick={() => editEpisode(episode)}>
                      Edit
                    </button>
                    <button onClick={() => deleteEpisode(episode.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="hero" id="home">
          <div className="hero-glow" />

          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot" />
              THE COMEDY EXPERIENCE
            </div>

            <h1>
              INDIA'S GOT
              <br />
              <span>LATENT.</span>
            </h1>

            <h2>Unfiltered. Unexpected. Unforgettable.</h2>

            <p className="hero-description">
              Discover the seasons, special episodes and unforgettable
              comedy moments in one place.
            </p>

            <div className="hero-actions">
              <a href="#episodes" className="primary-button">
                Explore Episodes →
              </a>
              <a href="#about" className="secondary-button">
                About Project
              </a>
            </div>

            <p className="hero-credit">
              AN UNOFFICIAL FAN PROJECT · MADE BY NEHARSH SHENDE
            </p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />
            <div className="art-center">
              <span className="mic">THE STAGE</span>
              <div className="mic-symbol">✦</div>
              <span className="stage-text">IS YOURS</span>
            </div>
            <span className="floating-star star-one">✦</span>
            <span className="floating-star star-two">✧</span>
          </div>

          <div className="hero-bottom">
            <span>01 / THE EXPERIENCE</span>
            <a href="#episodes">SCROLL TO EXPLORE ↓</a>
          </div>
        </section>

        <section className="episodes-section" id="episodes">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR ENTERTAINMENT HUB</span>
              <h2>Explore <span>Episodes.</span></h2>
              <p>Choose a season and explore its collection.</p>
            </div>

            <span className="episode-count">
              {filteredEpisodes.length} EPISODES
            </span>
          </div>

          <div className="filters">
            <div className="season-tabs">
              {["All", ...seasons].map((season) => (
                <button
                  key={season}
                  className={
                    activeSeason === season
                      ? "season-tab active"
                      : "season-tab"
                  }
                  onClick={() => setActiveSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Search episodes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search episodes"
            />
          </div>

          <div className="episode-grid">
            {filteredEpisodes.map((episode) => (
              <article className="episode-card" key={episode.id}>
                <div
                  className="episode-thumbnail"
                  style={
                    episode.thumbnail
                      ? { backgroundImage: `url("${episode.thumbnail}")` }
                      : {}
                  }
                >
                  <div className="thumbnail-shade" />
                  <span className="thumbnail-number">{episode.number}</span>
                  <span className="thumbnail-mark">LATENT.</span>

                  <button
                    className="card-play"
                    onClick={() => setSelectedEpisode(episode)}
                    aria-label={`Open ${episode.title}`}
                  >
                    ▶
                  </button>

                  <span className="episode-type">{episode.season}</span>
                </div>

                <div className="episode-info">
                  <span>{episode.season.toUpperCase()}</span>
                  <h3>{episode.title}</h3>
                  <button
                    className="watch-link"
                    onClick={() => setSelectedEpisode(episode)}
                  >
                    View episode ↗
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredEpisodes.length === 0 && (
            <div className="empty-state">
              <h3>No episodes found</h3>
              <p>Try another search or season.</p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <span className="section-kicker">BEHIND THE PROJECT</span>
          <h2>Built with <span>passion.</span></h2>
          <p>
            An independent fan-made website concept created to organise
            authorised entertainment content in one place.
          </p>

          <div className="creator-card">
            <span>DESIGNED & DEVELOPED BY</span>
            <h3>NEHARSH SHENDE</h3>
            <span className="creator-line">CREATIVITY MEETS CODE.</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="brand">
          <span className="brand-icon">L</span>
          <span>INDIA'S GOT <b>LATENT</b></span>
        </a>

        <p>Made by Neharsh Shende · 2026</p>

        <p className="disclaimer">
          Unofficial fan-made project. Not affiliated with the show's
          creators or broadcasters. Only authorised content will be hosted.
        </p>
      </footer>

      {selectedEpisode && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedEpisode(null)}
        >
          <div
            className="episode-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedEpisode(null)}
            >
              ×
            </button>

            <span className="section-kicker">
              {selectedEpisode.season}
            </span>

            <h2>{selectedEpisode.title}</h2>

            <div className="video-placeholder">
              {selectedEpisode.videoUrl ? (
                <video
                  src={selectedEpisode.videoUrl}
                  controls
                  playsInline
                  style={{ width: "100%", maxHeight: "450px" }}
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <>
                  <span>▶</span>
                  <p>VIDEO PLAYER COMING SOON</p>
                </>
              )}
            </div>

            <p className="modal-note">
              Only videos you own or are authorised to distribute should be
              connected here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
