import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock, ArrowRight, Target, Flag } from "lucide-react";

const RoadmapPage = () => {
  const phase1Milestones = [
    { title: "Literature review & algorithm selection", status: "complete" },
    { title: "Architecture design document", status: "complete" },
    { title: "Key generation module", status: "in-progress" },
    { title: "Signature engine prototype", status: "in-progress" },
    { title: "Performance benchmarking", status: "planned" },
    { title: "Security analysis report", status: "planned" },
    { title: "Phase I technical report", status: "planned" }
  ];

  const phase2Directions = [
    "Testnet integration and transaction broadcasting",
    "Multi-signature scheme research",
    "Hardware security module (HSM) study",
    "Formal verification of critical components",
    "Third-party security audit",
    "Migration tooling development"
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "complete":
        return <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">Done</span>;
      case "in-progress":
        return <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">In Progress</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">Planned</span>;
    }
  };

  return (
    <div className="min-h-screen" data-testid="roadmap-page">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Target className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Research Timeline</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Phased approach to post-quantum wallet research.
            </p>
          </div>
        </div>
      </section>

      {/* Phase I */}
      <section className="py-12" data-testid="phase1-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Flag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase I: Technical Feasibility</h2>
              <p className="text-muted-foreground text-sm">6-9 month research period</p>
            </div>
          </div>

          <div className="space-y-3">
            {phase1Milestones.map((milestone, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background border border-border flex items-center justify-between"
                data-testid={`milestone-${index}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <span>{milestone.title}</span>
                </div>
                {getStatusLabel(milestone.status)}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
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

      {/* Phase II */}
      <section className="py-12 bg-secondary/30" data-testid="phase2-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Flag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase II: Extended Development</h2>
              <p className="text-muted-foreground text-sm">Contingent on Phase I success</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
            <p className="text-sm text-amber-200">
              Phase II objectives are contingent on Phase I completion and continued funding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {phase2Directions.map((direction, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background border border-border flex items-start gap-3"
              >
                <Circle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{direction}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="py-12" data-testid="timeline-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-8">Timeline Overview</h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-8">
              <div className="flex items-center gap-4 pl-8 relative">
                <div className="absolute left-2 h-4 w-4 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Phase I Start</p>
                  <p className="text-sm text-green-400">Research initiated</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-8 relative">
                <div className="absolute left-2 h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
                <div>
                  <p className="font-medium">Current</p>
                  <p className="text-sm text-blue-400">Prototype development</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-8 relative">
                <div className="absolute left-2 h-4 w-4 rounded-full bg-secondary border-2 border-muted-foreground" />
                <div>
                  <p className="font-medium">Phase I Complete</p>
                  <p className="text-sm text-muted-foreground">Target: Q2 2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-8 relative">
                <div className="absolute left-2 h-4 w-4 rounded-full bg-secondary border-2 border-purple-500/50" />
                <div>
                  <p className="font-medium text-purple-400">Phase II (Contingent)</p>
                  <p className="text-sm text-muted-foreground">Pending Phase I results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold mb-4">Questions About Our Research?</h2>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            data-testid="roadmap-cta-contact"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RoadmapPage;
