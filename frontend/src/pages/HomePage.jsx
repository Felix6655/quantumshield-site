import { Link } from "react-router-dom";
import { Shield, AlertTriangle, Lock, Key, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="py-16 lg:py-24" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">QuantumShield</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              A research initiative exploring post-quantum cryptographic 
              solutions for non-custodial digital asset protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/wallet"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                data-testid="cta-wallet"
              >
                View Prototype
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
      <section className="py-16 bg-secondary/30" data-testid="problem-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Quantum Threat</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Why current cryptographic standards face an existential risk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl bg-background border border-border">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Current Vulnerabilities</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ECDSA signatures breakable by Shor's algorithm</li>
                <li>• RSA key derivation vulnerable to quantum factoring</li>
                <li>• "Harvest now, decrypt later" attacks already occurring</li>
                <li>• Most cryptocurrency wallets use vulnerable algorithms</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <Cpu className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Timeline Uncertainty</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cryptographically-relevant QC: 10-20 year estimates</li>
                <li>• Rapid advances may shorten timeline</li>
                <li>• Cryptographic migrations take years to implement</li>
                <li>• Early preparation is essential</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16" data-testid="approach-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Research methodology for post-quantum wallet security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">NIST Standards</h3>
              <p className="text-sm text-muted-foreground">
                Evaluating ML-KEM and ML-DSA (CRYSTALS-Kyber/Dilithium) 
                for practical wallet implementation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Key className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Hybrid Signatures</h3>
              <p className="text-sm text-muted-foreground">
                Combining classical ECDSA with post-quantum algorithms 
                for defense-in-depth during transition.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Non-Custodial</h3>
              <p className="text-sm text-muted-foreground">
                Maintaining user-controlled keys with no third-party 
                custody or trust requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phase I Focus */}
      <section className="py-16 bg-secondary/30" data-testid="phase1-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <span className="text-sm text-green-400">Phase I</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Current Research Focus</h2>
              <p className="text-muted-foreground mb-6">
                Establishing technical feasibility and identifying optimal 
                cryptographic configurations.
              </p>

              <ul className="space-y-3">
                {[
                  "Algorithm selection and benchmarking",
                  "Hybrid signature scheme prototype",
                  "Key management architecture",
                  "Security analysis and threat modeling",
                  "Technical feasibility documentation"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Research Status</h3>
              <div className="space-y-4">
                {[
                  { label: "Algorithm Evaluation", progress: 75 },
                  { label: "Prototype Development", progress: 50 },
                  { label: "Security Analysis", progress: 25 },
                  { label: "Documentation", progress: 20 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-blue-400">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Research prototype • Not for production use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" data-testid="cta-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore Our Research</h2>
          <p className="text-muted-foreground mb-6">
            Learn more about our wallet prototype, roadmap, and team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/wallet"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Wallet Prototype
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary text-foreground font-medium transition-colors"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
