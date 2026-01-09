import { useState } from "react";
import { Mail, Send, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:research@quantumshield.io?subject=${encodeURIComponent(formData.subject || 'Research Inquiry')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "Is QuantumShield available for production use?",
      a: "No. QuantumShield is a research prototype for evaluation purposes only. It has not been audited and should not be used with real assets."
    },
    {
      q: "What stage is the project in?",
      a: "We are in Phase I, focusing on technical feasibility including algorithm evaluation and prototype development."
    },
    {
      q: "Can I review technical documentation?",
      a: "Documentation will be available upon Phase I completion. Grant reviewers may request early access."
    },
    {
      q: "Are you seeking partnerships?",
      a: "We welcome collaboration discussions with research institutions and organizations interested in post-quantum cryptography."
    }
  ];

  return (
    <div className="min-h-screen" data-testid="contact-page">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Mail className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Contact</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Questions about our research? We welcome inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12" data-testid="contact-form-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Research Inquiries</h2>
              <p className="text-muted-foreground mb-6">
                We're happy to discuss our methodology, findings, or collaboration opportunities.
              </p>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email directly</p>
                    <a 
                      href="mailto:research@quantumshield.io" 
                      className="text-blue-400 hover:text-blue-300 font-medium"
                      data-testid="email-link"
                    >
                      research@quantumshield.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Response time:</strong> 2-3 business days</p>
                <p><strong className="text-foreground">For grant reviewers:</strong> Include program details in your message</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 rounded-xl bg-background border border-border">
              {submitted ? (
                <div className="text-center py-8" data-testid="form-success">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Client Opened</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete sending in your email app, or email us directly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <h3 className="text-lg font-semibold mb-4">Send a Message</h3>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Your name"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="you@email.com"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        data-testid="input-subject"
                      >
                        <option value="">Select subject</option>
                        <option value="Grant Review Inquiry">Grant Review</option>
                        <option value="Research Collaboration">Collaboration</option>
                        <option value="Technical Question">Technical Question</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        placeholder="Your message..."
                        data-testid="input-message"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center"
                      data-testid="submit-btn"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-secondary/30" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-lg bg-background border border-border overflow-hidden"
                data-testid={`faq-${index}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
