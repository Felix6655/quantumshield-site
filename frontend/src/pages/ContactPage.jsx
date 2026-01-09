import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since no backend, we'll use mailto as fallback
    const mailtoLink = `mailto:research@quantumshield.io?subject=${encodeURIComponent(formData.subject || 'Research Inquiry')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" data-testid="contact-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Mail className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Contact Us</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Questions about our research? We welcome inquiries from 
              researchers, grant reviewers, and potential collaborators.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Research Inquiries</h2>
              <p className="text-muted-foreground mb-8">
                We're happy to discuss our research methodology, findings, or 
                potential collaboration opportunities. For grant-related inquiries, 
                please include relevant program information in your message.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:research@quantumshield.io" 
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      data-testid="email-link"
                    >
                      research@quantumshield.io
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 2-3 business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">San Francisco Bay Area</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remote-first research team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Inquiry Types */}
              <div className="mt-12 p-6 rounded-xl bg-secondary/30 border border-border">
                <h3 className="text-lg font-semibold mb-4">Inquiry Categories</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong className="text-foreground">Grant Review:</strong> Questions about technical approach, methodology, or project scope</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong className="text-foreground">Research Collaboration:</strong> Potential partnerships with academic institutions or research labs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong className="text-foreground">Technical Inquiries:</strong> Questions about our cryptographic approach or architecture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong className="text-foreground">Media/Press:</strong> Interview requests or publication inquiries</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-xl bg-background border border-border">
              {submitted ? (
                <div className="text-center py-12" data-testid="form-success">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-2">Message Prepared</h3>
                  <p className="text-muted-foreground mb-6">
                    Your email client should have opened with your message. 
                    If not, please send your inquiry directly to:
                  </p>
                  <a 
                    href="mailto:research@quantumshield.io" 
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    research@quantumshield.io
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="block mx-auto mt-6 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <h3 className="text-xl font-semibold mb-6">Send a Message</h3>

                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                      <p className="text-sm text-red-400">Please fill in all required fields.</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Your name"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="your@email.com"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="University, Company, or Agency"
                        data-testid="input-organization"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        data-testid="input-subject"
                      >
                        <option value="">Select a subject</option>
                        <option value="Grant Review Inquiry">Grant Review Inquiry</option>
                        <option value="Research Collaboration">Research Collaboration</option>
                        <option value="Technical Question">Technical Question</option>
                        <option value="Media/Press Inquiry">Media/Press Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        placeholder="Please describe your inquiry in detail..."
                        data-testid="input-message"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center"
                      data-testid="submit-btn"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      This form will open your email client. Alternatively, email us directly at{" "}
                      <a href="mailto:research@quantumshield.io" className="text-blue-400 hover:text-blue-300">
                        research@quantumshield.io
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "Is QuantumShield available for production use?",
                a: "No. QuantumShield is a research prototype intended for evaluation and academic purposes only. It has not undergone the security audits required for production deployment and should not be used with real cryptocurrency assets."
              },
              {
                q: "What stage is the project currently in?",
                a: "We are in Phase I of development, focusing on technical feasibility research. This includes algorithm evaluation, prototype architecture development, and preliminary security analysis."
              },
              {
                q: "Can we review your technical documentation?",
                a: "Technical documentation will be made available upon completion of Phase I milestones. Grant reviewers and qualified researchers may request early access by contacting us directly."
              },
              {
                q: "Are you seeking additional funding or partnerships?",
                a: "We are open to discussions with research institutions, grant programs, and organizations interested in post-quantum cryptography research. Please reach out with details about potential collaboration."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-xl bg-background border border-border" data-testid={`faq-${index}`}>
                <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
