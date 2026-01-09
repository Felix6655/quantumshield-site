import { Link } from "react-router-dom";
import { Shield, Key, Lock, Layers, FileCode, ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";

const WalletPage = () => {
  const features = [
    {
      category: "Key Management",
      icon: Key,
      color: "blue",
      items: [
        { name: "ML-DSA-65 key pair generation", status: "in-progress" },
        { name: "Hybrid seed phrase derivation", status: "in-progress" },
        { name: "Encrypted local key storage", status: "planned" },
        { name: "Key backup and recovery", status: "planned" }
      ]
    },
    {
      category: "Signature Engine",
      icon: Lock,
      color: "green",
      items: [
        { name: "ECDSA signature generation", status: "complete" },
        { name: "ML-DSA signature generation", status: "in-progress" },
        { name: "Hybrid signature aggregation", status: "planned" },
        { name: "Signature verification", status: "in-progress" }
      ]
    },
    {
      category: "Architecture",
      icon: Layers,
      color: "purple",
      items: [
        { name: "Non-custodial design", status: "complete" },
        { name: "Modular cryptographic layer", status: "in-progress" },
        { name: "Network interface abstraction", status: "planned" },
        { name: "Hardware wallet support", status: "planned" }
      ]
    },
    {
      category: "Security",
      icon: Shield,
      color: "amber",
      items: [
        { name: "Threat model documentation", status: "in-progress" },
        { name: "Side-channel resistance", status: "planned" },
        { name: "Memory safety analysis", status: "planned" },
        { name: "Third-party audit", status: "planned" }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "complete":
        return "Done";
      case "in-progress":
        return "In Progress";
      default:
        return "Planned";
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
      green: { bg: "bg-green-500/10", text: "text-green-500" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-500" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen" data-testid="wallet-page">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Wallet Prototype</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A research prototype exploring post-quantum cryptographic 
              implementations for non-custodial wallet architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Concept Overview */}
      <section className="py-12" data-testid="concept-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-secondary/30 border border-border">
            <h2 className="text-xl font-semibold mb-4">Concept Overview</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h3 className="text-foreground font-medium mb-2">What This Is</h3>
                <ul className="space-y-1">
                  <li>• Research prototype for PQ cryptography evaluation</li>
                  <li>• Hybrid signature scheme implementation study</li>
                  <li>• Architecture reference for quantum-safe wallets</li>
                  <li>• Performance benchmarking platform</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">What This Is NOT</h3>
                <ul className="space-y-1">
                  <li>• NOT a production-ready wallet</li>
                  <li>• NOT for use with real cryptocurrency</li>
                  <li>• NOT audited or certified for security</li>
                  <li>• NOT a custodial service of any kind</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features + Status Grid */}
      <section className="py-12 bg-secondary/20" data-testid="features-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Features & Status</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((section, index) => {
              const colors = getColorClasses(section.color);
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-background border border-border"
                  data-testid={`feature-section-${index}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <h3 className="text-lg font-semibold">{section.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {getStatusLabel(item.status)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Status Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Planned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-12" data-testid="architecture-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Architecture Layers</h2>
          
          <div className="space-y-3">
            {[
              { layer: "UI Layer", desc: "React-based interface for key management and signing" },
              { layer: "Crypto Engine", desc: "ML-DSA + ECDSA hybrid signature implementation", highlight: true },
              { layer: "Key Store", desc: "Encrypted local storage with seed derivation" },
              { layer: "Network Layer", desc: "Abstracted blockchain communication (future)" }
            ].map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.highlight 
                    ? "bg-blue-500/10 border-blue-500/30" 
                    : "bg-secondary/30 border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Layer {index + 1}</span>
                    <h3 className={`font-semibold ${item.highlight ? "text-blue-400" : ""}`}>
                      {item.layer}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground text-right max-w-xs">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold mb-4">View Development Timeline</h2>
          <p className="text-muted-foreground mb-6">
            See our research milestones and Phase I/II objectives.
          </p>
          <Link
            to="/roadmap"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            data-testid="wallet-cta-roadmap"
          >
            View Roadmap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
