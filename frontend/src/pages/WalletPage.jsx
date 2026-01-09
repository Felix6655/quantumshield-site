import { Link } from "react-router-dom";
import { Shield, Key, Lock, Layers, AlertCircle, FileCode, ArrowRight, Info } from "lucide-react";

const WalletPage = () => {
  return (
    <div className="min-h-screen" data-testid="wallet-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <AlertCircle className="h-4 w-4 text-amber-400 mr-2" />
              <span className="text-sm text-amber-400">Prototype / Research Concept Only</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">QuantumShield Wallet</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              A conceptual non-custodial wallet architecture designed to evaluate 
              post-quantum cryptographic implementations for digital asset protection.
            </p>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <section className="py-4 bg-amber-500/10 border-y border-amber-500/20" data-testid="status-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <Info className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-200">
              <strong>Research Status:</strong> This wallet concept is under active development and is 
              <strong> not intended for production use</strong>. No real assets should be used with this prototype.
            </p>
          </div>
        </div>
      </section>

      {/* Wallet Concept */}
      <section className="py-20" data-testid="concept-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6">Wallet Concept Overview</h2>
              <p className="text-muted-foreground mb-6">
                The QuantumShield wallet prototype explores a hybrid cryptographic architecture 
                that combines classical elliptic curve algorithms with NIST-standardized 
                post-quantum schemes. This approach provides defense-in-depth during the 
                transition to quantum-resistant cryptography.
              </p>
              <p className="text-muted-foreground mb-6">
                Our research focuses on maintaining the core principles of non-custodial 
                wallet design: users retain complete control of their private keys, with 
                no third-party custody or trust requirements.
              </p>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Key Research Questions</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• What are the performance implications of hybrid signature schemes?</li>
                  <li>• How can key derivation be adapted for post-quantum algorithms?</li>
                  <li>• What UX considerations arise from larger key and signature sizes?</li>
                  <li>• How can migration from classical to PQ algorithms be handled safely?</li>
                </ul>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border gradient-border">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="h-6 w-6 text-blue-400 mr-3" />
                Architecture Diagram (Conceptual)
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Layer 1</div>
                  <div className="text-sm font-medium">User Interface Layer</div>
                  <div className="text-xs text-muted-foreground">Key generation, transaction signing, address display</div>
                </div>
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-border" />
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-xs text-blue-400 mb-1">Layer 2</div>
                  <div className="text-sm font-medium text-blue-400">Hybrid Cryptographic Engine</div>
                  <div className="text-xs text-muted-foreground">ML-DSA + ECDSA combined signatures</div>
                </div>
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-border" />
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Layer 3</div>
                  <div className="text-sm font-medium">Key Management Module</div>
                  <div className="text-xs text-muted-foreground">Secure key storage, derivation paths</div>
                </div>
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-border" />
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Layer 4</div>
                  <div className="text-sm font-medium">Network Interface</div>
                  <div className="text-xs text-muted-foreground">Blockchain communication (future integration)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Goals */}
      <section className="py-20 bg-secondary/30" data-testid="goals-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Goals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The research objectives guiding our prototype development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-1">
              <Key className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Hybrid Key Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluate methods for generating and managing both classical (secp256k1) 
                and post-quantum (ML-DSA) key pairs from a single seed phrase.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: Under Evaluation
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-2">
              <Lock className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Signature Aggregation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Research efficient methods for combining ECDSA and ML-DSA signatures 
                to minimize transaction size overhead while maintaining security.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: Research Phase
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-3">
              <Layers className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Backward Compatibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Design migration paths that allow existing wallet users to transition 
                to quantum-resistant keys without losing access to funds.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: Architecture Design
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-4">
              <Shield className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Side-Channel Resistance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluate implementation strategies to protect post-quantum signature 
                generation from timing and power analysis attacks.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: Planned
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-5">
              <FileCode className="h-10 w-10 text-cyan-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Performance Benchmarking</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Measure signing and verification times across various hardware 
                configurations to assess practical deployment feasibility.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: In Progress
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border card-hover" data-testid="goal-card-6">
              <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Threat Modeling</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive analysis of attack vectors specific to hybrid 
                cryptographic schemes and post-quantum implementations.
              </p>
              <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                Status: Ongoing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Roadmap */}
      <section className="py-20" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planned Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Features under development for the research prototype.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Phase I (Current)</h3>
              <ul className="space-y-3">
                {[
                  "Post-quantum key pair generation (ML-DSA-65)",
                  "Hybrid signature creation (ECDSA + ML-DSA)",
                  "Basic wallet interface prototype",
                  "Local key storage with encryption",
                  "Seed phrase backup for PQ keys"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 flex-shrink-0 text-xs">{index + 1}</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Phase II (Planned)</h3>
              <ul className="space-y-3">
                {[
                  "Multi-signature support with PQ schemes",
                  "Hardware security module integration research",
                  "Testnet transaction broadcasting",
                  "Migration tooling from classical wallets",
                  "Extended security audit and documentation"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3 flex-shrink-0 text-xs">{index + 1}</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-red-950/20 border-y border-red-500/20" data-testid="disclaimer-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                QuantumShield is a research prototype intended solely for academic and 
                evaluation purposes. This software is <strong>not production-ready</strong> and 
                should <strong>not be used with real cryptocurrency assets</strong>. The cryptographic 
                implementations have not undergone formal security audits. The project 
                team makes no warranties regarding the security or reliability of this software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Learn More About Our Research</h2>
          <p className="text-muted-foreground mb-8">
            Explore our research roadmap and meet the team behind QuantumShield.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              data-testid="wallet-cta-roadmap"
            >
              View Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/team"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary text-foreground font-medium transition-colors"
              data-testid="wallet-cta-team"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
