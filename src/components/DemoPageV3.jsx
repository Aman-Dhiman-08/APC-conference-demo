import React from 'react';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  User,
  Building2,
  Mail,
  Phone,
  HardHat,
  CalendarDays
} from 'lucide-react';
import wyreLogoSrc from '../assets/wyre-ai-logo.svg';
import './DemoPage.css';
import './DemoPageV3.css';

const testimonials = [
  {
    quote: "We identified a major conflict where the drawings showed a new ATS switch, but the specifications required the existing switch to remain. Wyre Check surfaced that immediately. When the first issues you review are legitimate, it builds confidence right away. If the system consistently delivers that level of accuracy, it builds trust fast.",
    person: "Sunil Cheriyan",
    company: "DiPasquale Construction (DCI)",
    product: "Using Wyre Check by Wyre AI"
  },
  {
    quote: "That's awesome! It's like a scope delineation already done for me. Incredible. Such a time saver.",
    person: "Selena Belluscio",
    company: "MCN Build",
    product: "Using Wyre Scopes by Wyre AI"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = React.useState(0);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
      setKey(prev => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <div className="testimonial-section">
      <p className="testimonial-label">CUSTOMER VOICE</p>
      <div key={key} className="testimonial-fade">
        <p className="testimonial-quote">"{t.quote}"</p>
        <p className="testimonial-person">— {t.person}</p>
        <p className="testimonial-org">{t.company}</p>
        <p className="testimonial-product">{t.product}</p>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testimonial-dot ${i === current ? 'active' : ''}`}
            onClick={() => { setCurrent(i); setKey(prev => prev + 1); }}
          />
        ))}
      </div>
    </div>
  );
};

const DemoPageV3 = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    notes: ''
  });
  const [status, setStatus] = React.useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/request-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', company: '', phone: '', notes: '' });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="v3">
      <div className="demo-container">
        {/* Left Section */}
        <div className="left-content">
          <a href="https://www.wyreai.io" target="_blank" rel="noopener noreferrer" className="logo-link">
            <img src={wyreLogoSrc} alt="Wyre AI" className="logo-img" />
          </a>

          <h1 className="title">See Wyre AI in Action</h1>
          <p className="subtitle">
            Share your details and we'll connect with you.
          </p>

          <div className="pills-container">
            <span className="pill">Catch scope gaps</span>
            <span className="pill">Faster bid turnaround</span>
            <span className="pill">Spot conflicts early</span>
            <span className="pill">Protect your margins</span>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="icon-wrapper">
                <ShieldCheck size={26} />
              </div>
              <h3>Reduce risk before construction begins</h3>
              <p>Detect scope gaps, conflicts, and inconsistencies in your construction documents.</p>
            </div>

            <div className="benefit-card">
              <div className="icon-wrapper">
                <Clock size={26} />
              </div>
              <h3>Build scopes and bid items faster</h3>
              <p>Wyre AI analyzes your full document set accelerating scope review and bid preparation.</p>
            </div>

            <div className="benefit-card">
              <div className="icon-wrapper">
                <Sparkles size={26} />
              </div>
              <h3>Improve bid confidence</h3>
              <p>Deliver complete, traceable scopes backed by source references.</p>
            </div>
          </div>

          {/* Built by Builders */}
          <div className="built-by-builders">
            <div className="builders-icon-wrap">
              <HardHat size={20} />
            </div>
            <div>
              <h3 className="builders-title">Built by Builders</h3>
              <p className="builders-desc">Founded by <strong>ex-co-founder of Pype, Sunil Dorairajan</strong>, Wyre AI is built based on real field experience — managing real projects, real deadlines, and real risk.</p>
            </div>
          </div>

          {/* Testimonials */}
          <Testimonials />
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="form-card">
            <div className="form-header">
              <div className="header-icon">
                <CalendarDays size={24} />
              </div>
              <div className="header-text">
                <p>Wyre AI</p>
                <h2>Request a Demo</h2>
              </div>
            </div>

            <form className="demo-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field-group">
                  <label>Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Company <span className="optional-label">(optional)</span></label>
                  <div className="input-wrapper">
                    <Building2 className="input-icon" />
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      type="text"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Phone <span className="optional-label">(optional)</span></label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="field-group" style={{ marginTop: '20px' }}>
                <label>Notes <span className="optional-label">(optional)</span></label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Anything you want us to know."
                ></textarea>
              </div>

              <p className="footer-text" style={{ marginTop: '12px' }}>
                Our team will reach out to schedule a personalized walkthrough.
              </p>

              <button
                type="submit"
                className="submit-btn"
                disabled={status.loading}
                style={{ marginTop: '24px', width: '100%', opacity: status.loading ? 0.7 : 1 }}
              >
                {status.loading ? 'Processing...' : 'Request Demo'}
              </button>

              {status.success && (
                <p style={{ color: '#2ecc71', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                  ✓ Request sent successfully! Check your email.
                </p>
              )}
              {status.error && (
                <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                  ⚠ Error: {status.error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPageV3;
