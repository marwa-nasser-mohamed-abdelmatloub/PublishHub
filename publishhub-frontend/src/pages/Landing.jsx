import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NavBar } from "../components/Common";
import {
  FaArrowRight,
  FaPenFancy,
  FaEye,
  FaTachometerAlt,
  FaBook,
  FaCheckCircle,
  FaStar,
  FaRocket,
  FaShieldAlt,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaGem,
  FaCrown,
  FaPlayCircle,
  FaChartLine,
  FaArrowUp,
} from "react-icons/fa";

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={counterRef}>{count}</span>;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "990",
        animation: "slideUp 0.3s ease",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(37, 99, 235, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(37, 99, 235, 0.4)";
      }}
    >
      <FaArrowUp />
    </button>
  ) : null;
};

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "reviewer") {
        navigate("/reviewer/dashboard");
      } else {
        navigate("/author/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Inject global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }

      .landing-page {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        background: white;
        overflow-x: hidden;
      }

      /* Animations */
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }
        50% {
          box-shadow: 0 0 40px rgba(37, 99, 235, 0.5);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Hero badge */
      .hero-badge {
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.1));
        border: 1px solid rgba(37, 99, 235, 0.3);
        color: #2563eb;
        padding: 10px 24px;
        border-radius: 50px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        animation: slideDown 0.6s ease;
        backdrop-filter: blur(10px);
      }

      /* Hero title */
      .hero-title {
        font-size: clamp(2.5rem, 8vw, 4.5rem);
        font-weight: 800;
        line-height: 1.1;
        background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: fadeInUp 0.8s ease 0.2s backwards;
        margin: 0 0 1.5rem 0;
      }

      /* Hero subtitle */
      .hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        color: #64748b;
        line-height: 1.8;
        animation: fadeInUp 0.8s ease 0.4s backwards;
        max-width: 600px;
      }

      /* Buttons */
      .btn-primary-custom {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        border: none;
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .btn-primary-custom:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(37, 99, 235, 0.4);
      }

      .btn-primary-custom:active {
        transform: translateY(-1px);
      }

      .btn-secondary-custom {
        border: 2px solid #2563eb;
        color: #2563eb;
        background: white;
        padding: 12px 30px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .btn-secondary-custom:hover {
        background: #2563eb;
        color: white;
        transform: translateY(-3px);
      }

      /* Feature card */
      .feature-card {
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        padding: 2rem;
        transition: all 0.3s ease;
        background: white;
        height: 100%;
        display: flex;
        flex-direction: column;
        animation: fadeInUp 0.6s ease backwards;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        border-color: #2563eb;
      }

      /* Feature icon */
      .feature-icon {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
      }

      .feature-card:hover .feature-icon {
        transform: scale(1.15) rotate(5deg);
      }

      /* Stat card */
      .stat-card {
        text-align: center;
        padding: 2rem;
        border-radius: 16px;
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease backwards;
      }

      .stat-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      }

      /* Pricing card */
      .pricing-card {
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 20px;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        animation: fadeInUp 0.6s ease backwards;
      }

      .pricing-card.popular {
        border: 2px solid #2563eb;
        transform: translateY(-15px);
        box-shadow: 0 25px 60px rgba(37, 99, 235, 0.2);
      }

      .pricing-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      }

      .pricing-card.popular:hover {
        transform: translateY(-18px);
        box-shadow: 0 30px 70px rgba(37, 99, 235, 0.25);
      }

      .popular-badge {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        color: white;
        padding: 8px 24px;
        border-radius: 0 0 12px 12px;
        font-weight: 600;
        font-size: 0.85rem;
        animation: slideDown 0.6s ease;
      }

      /* Testimonial card */
      .testimonial-card {
        border-radius: 16px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        padding: 2rem;
        background: white;
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease backwards;
      }

      .testimonial-card:hover {
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        transform: translateY(-8px);
      }

      .testimonial-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }

      /* Section title */
      .section-title {
        font-size: clamp(1.75rem, 5vw, 3rem);
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 1rem;
        color: #0f172a;
      }

      .section-subtitle {
        color: #64748b;
        font-size: clamp(1rem, 2vw, 1.1rem);
        line-height: 1.8;
        max-width: 600px;
        margin: 0 auto 3rem;
      }

      /* Hero section */
      .hero-section {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        position: relative;
        overflow: hidden;
        padding: 120px 2rem 80px;
        min-height: 100vh;
        display: flex;
        align-items: center;
      }

      .hero-section::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 200%;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
        z-index: 0;
      }

      .hero-content {
        position: relative;
        z-index: 1;
      }

      /* CTA section */
      .cta-section {
        background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
        color: white;
        padding: 80px 2rem;
        position: relative;
        overflow: hidden;
      }

      .cta-section::after {
        content: '';
        position: absolute;
        top: 0;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        z-index: 0;
      }

      .cta-content {
        position: relative;
        z-index: 1;
      }

      /* Footer */
      .footer-section {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        padding: 60px 2rem 20px;
      }

      .footer-link {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .footer-link:hover {
        color: #2563eb;
        transform: translateX(4px);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-section {
          padding: 100px 1.5rem 60px;
          min-height: auto;
        }

        .hero-grid {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
        }

        .dashboard-container {
          display: none !important;
        }

        .stat-card,
        .feature-card,
        .pricing-card,
        .testimonial-card {
          animation-delay: 0s;
        }

        .section-title {
          font-size: 2rem;
        }

        .cta-section {
          padding: 60px 1.5rem;
        }

        .footer-section {
          padding: 40px 1.5rem 15px;
        }
      }

      @media (max-width: 480px) {
        .hero-section {
          padding: 80px 1rem 50px;
        }

        .dashboard-container {
          display: none !important;
        }

        .hero-badge {
          font-size: 0.75rem;
          padding: 8px 16px;
        }

        .section-subtitle {
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section">
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            position: "relative",
            zIndex: "1",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left content */}
            <div className="hero-content">
              <div className="hero-badge">
                <FaRocket />
                Trusted by 5000+ Organizations
              </div>
              <h1 className="hero-title">Publish Smarter, Not Harder</h1>
              <p className="hero-subtitle">
                The all-in-one platform for academic publishing, peer review,
                and content management. Empower your team to create, review, and
                publish with unprecedented efficiency.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginTop: "2.5rem",
                }}
              >
                <button
                  className="btn-primary-custom"
                  onClick={() => navigate("/register")}
                >
                  Start Free Trial
                  <FaArrowRight />
                </button>
                <button
                  className="btn-secondary-custom"
                  onClick={() => navigate("/demo")}
                >
                  <FaPlayCircle />
                  Watch Demo
                </button>
              </div>
              <div
                style={{
                  marginTop: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} color="#fbbf24" />
                  ))}
                </div>
                <span style={{ color: "#64748b", fontWeight: "500" }}>
                  Rated 4.9/5 by 500+ institutions
                </span>
              </div>
            </div>

            {/* Right visual */}
            <div
              className="dashboard-container"
              style={{
                position: "relative",
                animation: "float 6s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  borderRadius: "24px",
                  padding: "2.5rem",
                  color: "white",
                  boxShadow: "0 30px 60px rgba(37, 99, 235, 0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                      }}
                    >
                      Dashboard Preview
                    </h5>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.9rem",
                        opacity: "0.9",
                      }}
                    >
                      Real-time analytics
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  >
                    Live
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "10px",
                        borderRadius: "10px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <FaPenFancy />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                        Articles Published
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        1,234
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "85%",
                        background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                        animation: "slideInLeft 1s ease backwards",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "1rem",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                      Reviews
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      89
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "1rem",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                      In Progress
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      12
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 2rem", background: "white" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              { number: 10000, label: "Articles Published", color: "#2563eb" },
              { number: 5000, label: "Active Writers", color: "#f59e0b" },
              {
                number: 2000,
                label: "Professional Reviewers",
                color: "#10b981",
              },
              { number: 98.7, label: "User Satisfaction %", color: "#8b5cf6" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s backwards`,
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: stat.color,
                    marginBottom: "0.5rem",
                  }}
                >
                  <AnimatedCounter target={stat.number} />
                  {stat.label === "User Satisfaction %"
                    ? "%"
                    : stat.number > 1000
                      ? "K+"
                      : "+"}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{ padding: "100px 2rem", background: "#f8fafc" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              className="hero-badge"
              style={{ justifyContent: "center", margin: "0 auto 1.5rem" }}
            >
              <FaGem />
              POWERFUL FEATURES
            </div>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Comprehensive tools designed to streamline your publishing
              workflow from start to finish
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: <FaPenFancy />,
                title: "Advanced Editor",
                description:
                  "Rich text editor with formatting, citations, and version control built-in",
                color: "#2563eb",
              },
              {
                icon: <FaEye />,
                title: "Smart Review System",
                description:
                  "Streamlined peer review process with real-time feedback and discussions",
                color: "#f59e0b",
              },
              {
                icon: <FaChartLine />,
                title: "Deep Analytics",
                description:
                  "Comprehensive insights into article performance and reader engagement",
                color: "#10b981",
              },
              {
                icon: <FaRocket />,
                title: "One-Click Publishing",
                description:
                  "Publish across multiple platforms simultaneously with full format support",
                color: "#8b5cf6",
              },
              {
                icon: <FaCheckCircle />,
                title: "Version Control",
                description:
                  "Track all revisions and changes with the ability to revert anytime",
                color: "#ec4899",
              },
              {
                icon: <FaShieldAlt />,
                title: "Secure & Compliant",
                description:
                  "Enterprise-grade security with GDPR, HIPAA, and SOC2 compliance",
                color: "#06b6d4",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s backwards`,
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h5
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "#1e293b",
                  }}
                >
                  {feature.title}
                </h5>
                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6",
                    marginBottom: "1rem",
                    flex: 1,
                  }}
                >
                  {feature.description}
                </p>
                <a
                  href="#features"
                  style={{
                    color: feature.color,
                    textDecoration: "none",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  Learn More <FaArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="solutions"
        style={{ padding: "100px 2rem", background: "white" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title">Built for Every Role</h2>
            <p className="section-subtitle">
              Tailored solutions that adapt to your specific needs and workflow
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                role: "For Authors",
                icon: <FaPenFancy />,
                color: "#2563eb",
                features: [
                  "Draft & Format",
                  "Submit Reviews",
                  "Track Feedback",
                  "Publish Directly",
                  "Analytics Dashboard",
                ],
              },
              {
                role: "For Reviewers",
                icon: <FaEye />,
                color: "#f59e0b",
                features: [
                  "Manage Queue",
                  "Annotate Articles",
                  "Submit Reviews",
                  "Collaborate Notes",
                  "Track History",
                ],
              },
              {
                role: "For Admins",
                icon: <FaTachometerAlt />,
                color: "#10b981",
                features: [
                  "Manage Users",
                  "Monitor Activity",
                  "Generate Reports",
                  "Control Settings",
                  "Team Management",
                ],
              },
            ].map((solution, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  borderColor: `${solution.color}30`,
                  borderWidth: "2px",
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s backwards`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", color: solution.color }}>
                    {solution.icon}
                  </div>
                  <h5
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      fontSize: "1.25rem",
                    }}
                  >
                    {solution.role}
                  </h5>
                </div>
                <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                  {solution.features.map((feature, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "1rem",
                        color: "#64748b",
                      }}
                    >
                      <FaCheckCircle color={solution.color} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{ padding: "100px 2rem", background: "#f8fafc" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              className="hero-badge"
              style={{ justifyContent: "center", margin: "0 auto 1.5rem" }}
            >
              <FaCrown />
              SIMPLE PRICING
            </div>
            <h2 className="section-title">Choose Your Perfect Plan</h2>
            <p className="section-subtitle">
              Start for free, upgrade as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/month",
                features: [
                  "Up to 10 articles",
                  "Basic editor",
                  "Email support",
                  "Public dashboard",
                ],
                cta: "Get Started Free",
                popular: false,
                color: "#3b82f6",
              },
              {
                name: "Professional",
                price: "$99",
                period: "/month",
                features: [
                  "Unlimited articles",
                  "Advanced editor",
                  "Priority support",
                  "Analytics",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
                color: "#2563eb",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                features: [
                  "Everything",
                  "Custom branding",
                  "Dedicated support",
                  "SLA guarantee",
                  "Custom integrations",
                ],
                cta: "Contact Sales",
                popular: false,
                color: "#1e40af",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
                style={{
                  padding: "2rem",
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s backwards`,
                }}
              >
                {plan.popular && (
                  <div className="popular-badge">MOST POPULAR</div>
                )}
                <h5
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    marginTop: plan.popular ? "1rem" : "0",
                    color: plan.color,
                  }}
                >
                  {plan.name}
                </h5>
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "800",
                      color: plan.color,
                    }}
                  >
                    {plan.price}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    {plan.period}
                  </div>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: "0",
                    margin: "0 0 2rem",
                  }}
                >
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "1rem",
                        color: "#64748b",
                      }}
                    >
                      <FaCheckCircle color={plan.color} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: "100%",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: plan.popular ? "none" : `2px solid ${plan.color}`,
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background: plan.popular
                      ? `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}80 100%)`
                      : "white",
                    color: plan.popular ? "white" : plan.color,
                  }}
                  onClick={() => navigate("/register")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        style={{ padding: "100px 2rem", background: "white" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title">Loved by Industry Leaders</h2>
            <p className="section-subtitle">
              See what our users say about their experience with PublishHub
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                name: "Dr. Sarah Mitchell",
                role: "Journal Editor",
                content:
                  "PublishHub transformed our publishing process. We reduced review time by 40% and improved author satisfaction significantly.",
                avatar: "SM",
                rating: 5,
              },
              {
                name: "Prof. James Chen",
                role: "Research Director",
                content:
                  "The best platform for academic publishing. Intuitive interface, powerful features, and excellent customer support.",
                avatar: "JC",
                rating: 5,
              },
              {
                name: "Dr. Emma Thompson",
                role: "Editorial Manager",
                content:
                  "We've been using PublishHub for 18 months. It's reliable, scalable, and has helped us streamline our entire workflow.",
                avatar: "ET",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="testimonial-card"
                style={{
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s backwards`,
                }}
              >
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <h6 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {testimonial.name}
                </h6>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  {testimonial.role}
                </p>
                <div
                  style={{ marginBottom: "1rem", display: "flex", gap: "4px" }}
                >
                  {[...Array(5)].map((_, j) => (
                    <FaStar
                      key={j}
                      color={j < testimonial.rating ? "#fbbf24" : "#e5e7eb"}
                    />
                  ))}
                </div>
                <p
                  style={{
                    color: "#64748b",
                    fontStyle: "italic",
                    lineHeight: "1.6",
                  }}
                >
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div
          className="cta-content"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            Ready to Transform Publishing?
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              marginBottom: "2rem",
              opacity: "0.95",
              lineHeight: "1.6",
            }}
          >
            Join thousands of organizations accelerating their publishing
            workflows with PublishHub.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/register")}
              className="btn-primary-custom"
              style={{ background: "white", color: "#2563eb" }}
            >
              <FaRocket />
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/demo")}
              className="btn-secondary-custom"
              style={{
                borderColor: "white",
                color: "white",
                backgroundColor: "transparent",
              }}
            >
              <FaPlayCircle />
              Schedule Demo
            </button>
          </div>
          <p style={{ marginTop: "2rem", opacity: "0.8", fontSize: "0.9rem" }}>
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-section">
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "3rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    borderRadius: "8px",
                    padding: "6px 8px",
                    color: "white",
                  }}
                >
                  <FaBook />
                </div>
                PublishHub
              </div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: "1.6",
                }}
              >
                The all-in-one platform for academic publishing and content
                management. Empower your team to create, review, and publish
                with efficiency.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <a
                  href="#"
                  className="footer-link"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="footer-link"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="footer-link"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaGithub />
                </a>
              </div>
            </div>

            <div>
              <h6 style={{ fontWeight: "600", marginBottom: "1.5rem" }}>
                Product
              </h6>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Features",
                  "Solutions",
                  "Pricing",
                  "Security",
                  "Roadmap",
                ].map((link, i) => (
                  <li key={i} style={{ marginBottom: "0.75rem" }}>
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 style={{ fontWeight: "600", marginBottom: "1.5rem" }}>
                Resources
              </h6>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Documentation",
                  "Blog",
                  "Guides",
                  "Webinars",
                  "API Docs",
                ].map((link, i) => (
                  <li key={i} style={{ marginBottom: "0.75rem" }}>
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 style={{ fontWeight: "600", marginBottom: "1.5rem" }}>
                Company
              </h6>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {["About", "Blog", "Careers", "Contact", "Legal"].map(
                  (link, i) => (
                    <li key={i} style={{ marginBottom: "0.75rem" }}>
                      <a href="#" className="footer-link">
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              © 2026 PublishHub. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "2rem" }}>
              <a
                href="#"
                className="footer-link"
                style={{ fontSize: "0.9rem" }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="footer-link"
                style={{ fontSize: "0.9rem" }}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="footer-link"
                style={{ fontSize: "0.9rem" }}
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Button */}
      <button
        onClick={() => navigate("/register")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "989",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow =
            "0 15px 40px rgba(37, 99, 235, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(37, 99, 235, 0.4)";
        }}
      >
        <FaRocket />
      </button>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Landing;
