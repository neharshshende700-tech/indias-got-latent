
import React, { useMemo, useState } from "react";

const seasons = [
  "All",
  "Season 1",
  "Season 1 Bonus",
  "Season 2",
  "Season 2 Bonus",
  "Season 3",
];

const episodes = [
  { id: 1, season: "Season 1", title: "Episode 01", number: "01" },
  { id: 2, season: "Season 1", title: "Episode 02", number: "02" },
  { id: 3, season: "Season 1", title: "Episode 03", number: "03" },
  { id: 4, season: "Season 1 Bonus", title: "Bonus Special 01", number: "B1" },
  { id: 5, season: "Season 2", title: "Episode 01", number: "01" },
  { id: 6, season: "Season 2", title: "Episode 02", number: "02" },
  { id: 7, season: "Season 2 Bonus", title: "Bonus Special 01", number: "B1" },
];

export default function App() {
  const [activeSeason, setActiveSeason] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => {
      const seasonMatch =
        activeSeason === "All" || episode.season === activeSeason;

      const searchMatch =
        `${episode.title} ${episode.season}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return seasonMatch && searchMatch;
    });
  }, [activeSeason, search]);

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

        <a href="#episodes" className="nav-button">Explore ↗</a>
      </header>

      <main>
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
              {seasons.map((season) => (
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
                <div className="episode-thumbnail">
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

                  <span className="episode-type">
                    {episode.season}
                  </span>
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
              <span>▶</span>
              <p>VIDEO PLAYER COMING SOON</p>
            </div>

            <p className="modal-note">
              Our video player will be connected in the next development phase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
