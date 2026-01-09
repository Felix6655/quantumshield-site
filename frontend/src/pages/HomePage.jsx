import { Link } from "react-router-dom";
import { Shield, AlertTriangle, Lock, Key, Cpu, ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <FlaskConical className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Research Prototype • Phase I Development</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Post-Quantum Security</span>
              <br />
              <span className="text-foreground">for Digital Assets</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              QuantumShield is a research initiative exploring post-quantum cryptographic 
              architectures for non-custodial wallet protection. Our work focuses on 
              evaluating NIST-standardized algorithms for practical cryptocurrency security applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/wallet"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                data-testid="cta-wallet"
              >
                View Wallet Concept
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/roadmap"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary text-foreground font-medium transition-colors"
                data-testid="cta-roadmap"
              >
                Research Roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-secondary/30" data-testid="problem-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Quantum Threat</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the cryptographic vulnerabilities that quantum computing poses to current digital asset security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-background border border-border card-hover" data-testid="threat-card-1">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Current Cryptographic Vulnerabilities</h3>
              <p className="text-muted-foreground mb-4">
                Modern cryptocurrency wallets rely on elliptic curve cryptography (ECC), 
                specifically ECDSA for Bitcoin and similar curves for other blockchains. 
                Shor's algorithm, when run on a sufficiently powerful quantum computer, 
                can efficiently solve the discrete logarithm problem underlying these systems.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span>ECDSA signatures vulnerable to quantum attack</li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span>RSA key derivation at risk</li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span>Harvest-now-decrypt-later threat active today</li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border card-hover" data-testid="threat-card-2">
              <Cpu className="h-12 w-12 text-purple-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Quantum Computing Timeline</h3>
              <p className="text-muted-foreground mb-4">
                While cryptographically-relevant quantum computers (CRQC) are not yet 
                available, the timeline for their development is uncertain. Conservative 
                estimates suggest 10-20 years, but accelerated progress could shorten this window.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Nation-state investment accelerating development</li>
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Error correction advances reducing timeline estimates</li>
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Cryptographic agility needed before threat materializes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20" data-testid="approach-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Approach</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our methodology for developing and evaluating post-quantum cryptographic solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="approach-card-1">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">NIST PQC Standards</h3>
              <p className="text-sm text-muted-foreground">
                We evaluate NIST-standardized post-quantum algorithms including ML-KEM 
                (CRYSTALS-Kyber) for key encapsulation and ML-DSA (CRYSTALS-Dilithium) 
                for digital signatures. Our research focuses on their practical application 
                in wallet architectures.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="approach-card-2">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                <Key className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Non-Custodial Architecture</h3>
              <p className="text-sm text-muted-foreground">
                Our prototype maintains the fundamental principle of user-controlled keys. 
                We investigate hybrid signature schemes that combine classical and post-quantum 
                algorithms for defense-in-depth during the transition period.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="approach-card-3">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Security Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Rigorous security analysis including formal verification approaches, 
                side-channel resistance evaluation, and performance benchmarking across 
                different hardware configurations and network conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phase I Focus */}
      <section className="py-20 bg-secondary/30" data-testid="phase1-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <span className="text-sm text-green-400">Phase I Research Focus</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Current Development Objectives</h2>
              <p className="text-muted-foreground mb-8">
                Our Phase I research focuses on establishing technical feasibility and 
                identifying optimal cryptographic configurations for post-quantum wallet protection.
              </p>

              <div className="space-y-4">
                {[
                  "Algorithm selection and performance benchmarking",
                  "Hybrid signature scheme prototype development",
                  "Key management architecture design",
                  "Security analysis and threat modeling",
                  "Technical feasibility documentation"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border">
              <h3 className="text-xl font-semibold mb-6">Research Status</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Algorithm Evaluation</span>
                    <span className="text-blue-400">In Progress</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Prototype Architecture</span>
                    <span className="text-blue-400">In Progress</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Security Analysis</span>
                    <span className="text-amber-400">Planned</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-amber-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Documentation</span>
                    <span className="text-amber-400">Planned</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-amber-500 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Status reflects current Phase I research progress. This is a prototype 
                project and not intended for production use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-20" data-testid="why-now-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why This Research Matters Now</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The urgency of post-quantum cryptography research in the digital asset space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "NIST Standardization",
                description: "NIST has finalized the first post-quantum cryptographic standards, enabling practical implementation research."
              },
              {
                title: "Migration Timeline",
                description: "Cryptographic migrations typically require years. Early research is essential for orderly transition."
              },
              {
                title: "Store-Now Attacks",
                description: "Adversaries may already be collecting encrypted data for future quantum decryption."
              },
              {
                title: "Ecosystem Readiness",
                description: "The cryptocurrency ecosystem needs quantum-resistant solutions before the threat materializes."
              }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-secondary/50 border border-border">
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950/30 via-background to-purple-950/30" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Our Research</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn more about our post-quantum wallet architecture, research roadmap, 
            and the team behind QuantumShield.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/wallet"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Wallet Architecture
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary text-foreground font-medium transition-colors"
            >
              Contact Research Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
