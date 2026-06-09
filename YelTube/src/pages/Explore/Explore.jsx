import "./Explore.css";
import { Link } from "react-router-dom";
import { FaFire, FaGamepad, FaMusic, FaNewspaper, FaBook, FaTv } from "react-icons/fa";

const EXPLORE_CARDS = [
  {
    title: "Trending",
    icon: <FaFire />,
    desc: "See the most popular videos on YelTube",
    link: "/trending",
    color: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
  },
  {
    title: "Gaming",
    icon: <FaGamepad />,
    desc: "Watch top games and live walkthroughs",
    link: "/trending",
    color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    title: "Music",
    icon: <FaMusic />,
    desc: "Listen to the latest releases and playlists",
    link: "/trending",
    color: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  },
  {
    title: "News",
    icon: <FaNewspaper />,
    desc: "Stay informed with top news and stories",
    link: "/trending",
    color: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
  },
  {
    title: "Learning",
    icon: <FaBook />,
    desc: "Expand your mind with educational courses",
    link: "/trending",
    color: "linear-gradient(135deg, #8a2be2 0%, #4a00e0 100%)",
  },
  {
    title: "Live",
    icon: <FaTv />,
    desc: "Join real-time broadcasts and live chat",
    link: "/livestream",
    color: "linear-gradient(135deg, #e55d87 0%, #5fc3e4 100%)",
  },
];

const Explore = () => {
  return (
    <div className="explore-page">
      <div className="explore-container">
        <h2 className="explore-title">Explore YelTube</h2>
        <p className="explore-subtitle">Discover new content, watch live broadcasts, and stay up to date.</p>

        <div className="explore-grid">
          {EXPLORE_CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="explore-card"
              style={{ "--card-grad": card.color }}
            >
              <div className="explore-card-glow"></div>
              <div className="explore-card-icon-wrap">
                {card.icon}
              </div>
              <div className="explore-card-details">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
