import { useState, useEffect } from "react";
import "./Premium.css";
import { FaCrown, FaCheck, FaTimes, FaPlay, FaDownload, FaMusic, FaBan } from "react-icons/fa";

const Premium = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
      if (user.premiumPlan) {
        setSubscribedPlan(user.premiumPlan);
      }
    }
  }, []);

  const handleSubscribe = (planName) => {
    if (!currentUser) {
      alert("Please login first to subscribe to YelTube Premium.");
      window.location.href = "/login";
      return;
    }

    const updatedUser = {
      ...currentUser,
      isPremium: true,
      premiumPlan: planName,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setSubscribedPlan(planName);

    // Update in users database
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.email === currentUser.email ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert(`Congratulations! You have successfully subscribed to YelTube Premium ${planName} (Demo Mode). Enjoy your ad-free experience!`);
    window.location.reload();
  };

  const handleCancelSubscription = () => {
    if (!window.confirm("Are you sure you want to cancel your Premium subscription?")) return;

    const updatedUser = {
      ...currentUser,
      isPremium: false,
      premiumPlan: "",
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setSubscribedPlan("");

    // Update in users database
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.email === currentUser.email ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Your subscription has been canceled (Demo Mode).");
    window.location.reload();
  };

  return (
    <div className="premium-page">
      <div className="premium-container">
        {/* Hero Banner */}
        <div className="premium-hero">
          <div className="premium-hero-glow"></div>
          <FaCrown className="crown-hero-icon" />
          <h1>YelTube Premium</h1>
          <p className="hero-lead">YelTube you love, uninterrupted. Ad-free, background play, and offline downloads.</p>
          {subscribedPlan && (
            <div className="active-badge-card">
              <span>You are currently subscribed to <strong>{subscribedPlan}</strong></span>
              <button className="cancel-sub-btn" onClick={handleCancelSubscription}>Cancel Plan</button>
            </div>
          )}
        </div>

        {/* Features list */}
        <h2 className="premium-section-title">Premium Benefits</h2>
        <div className="premium-features-grid">
          {[
            {
              icon: <FaBan />,
              title: "Ad-free playback",
              desc: "Watch videos without interruptions. Enjoy viewing your favorite creators ad-free.",
            },
            {
              icon: <FaDownload />,
              title: "Downloads & Offline",
              desc: "Save videos for when you're low on data or can't get online.",
            },
            {
              icon: <FaMusic />,
              title: "Background play",
              desc: "Keep videos playing in the background even when you lock your screen or open other apps.",
            },
            {
              icon: <FaPlay />,
              title: "Premium Originals",
              desc: "Gain instant access to exclusive series, documentaries, and bonus contents.",
            },
          ].map((item, i) => (
            <div key={i} className="premium-feature-card">
              <div className="feature-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing Switcher */}
        <h2 className="premium-section-title text-center">Flexible Plans</h2>
        <div className="billing-switcher-wrap">
          <span className={!isAnnual ? "active-period" : ""}>Monthly</span>
          <label className="switch">
            <input type="checkbox" checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} />
            <span className="slider round"></span>
          </label>
          <span className={isAnnual ? "active-period" : ""}>
            Annually <span className="save-badge">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price-box">
              <span className="currency">$</span>
              <span className="price-number">0</span>
              <span className="period">/month</span>
            </div>
            <p className="pricing-desc">Access normal YelTube features with occasional ad breaks.</p>
            <hr />
            <ul className="pricing-features">
              <li><FaCheck className="check-ok" /> Normal video streaming</li>
              <li><FaCheck className="check-ok" /> Live stream chat</li>
              <li><FaTimes className="check-no" /> Ad-free videos</li>
              <li><FaTimes className="check-no" /> Background playback</li>
              <li><FaTimes className="check-no" /> Offline downloads</li>
            </ul>
            <button className="pricing-btn free-btn" disabled={!subscribedPlan} onClick={() => window.location.href = "/"}>
              {subscribedPlan ? "Downgrade" : "Current Plan"}
            </button>
          </div>

          {/* Individual Premium */}
          <div className="pricing-card featured">
            <div className="popular-badge">POPULAR</div>
            <h3>Individual</h3>
            <div className="price-box">
              <span className="currency">$</span>
              <span className="price-number">{isAnnual ? "9.59" : "11.99"}</span>
              <span className="period">/month</span>
            </div>
            <p className="pricing-desc">Ideal for single users. Cancel anytime.</p>
            <hr />
            <ul className="pricing-features">
              <li><FaCheck className="check-ok" /> Full Ad-free video viewing</li>
              <li><FaCheck className="check-ok" /> Offline downloads</li>
              <li><FaCheck className="check-ok" /> Background play supported</li>
              <li><FaCheck className="check-ok" /> Premium Original content</li>
              <li><FaTimes className="check-no" /> Multiple account devices</li>
            </ul>
            <button
              className="pricing-btn premium-btn"
              onClick={() => handleSubscribe("Individual")}
            >
              {subscribedPlan === "Individual" ? "Active Plan" : "Try Premium"}
            </button>
          </div>

          {/* Family Premium */}
          <div className="pricing-card">
            <h3>Family</h3>
            <div className="price-box">
              <span className="currency">$</span>
              <span className="price-number">{isAnnual ? "14.39" : "17.99"}</span>
              <span className="period">/month</span>
            </div>
            <p className="pricing-desc">Up to 5 family members in the same household.</p>
            <hr />
            <ul className="pricing-features">
              <li><FaCheck className="check-ok" /> All Individual features</li>
              <li><FaCheck className="check-ok" /> Up to 5 family profiles</li>
              <li><FaCheck className="check-ok" /> Shared offline media</li>
              <li><FaCheck className="check-ok" /> Kid-friendly filters</li>
              <li><FaCheck className="check-ok" /> Simultaneous streams</li>
            </ul>
            <button
              className="pricing-btn premium-btn"
              onClick={() => handleSubscribe("Family")}
            >
              {subscribedPlan === "Family" ? "Active Plan" : "Try Family"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
