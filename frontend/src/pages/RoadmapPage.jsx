import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock, ArrowRight, Target, Calendar, Flag } from "lucide-react";

const RoadmapPage = () => {
  const phase1Milestones = [
    {
      title: "Literature Review & Algorithm Selection",
      status: "completed",
      description: "Comprehensive review of NIST PQC standards and selection of ML-DSA for signature scheme evaluation."
    },
    {
      title: "Architecture Design Document",
      status: "completed",
      description: "Technical specification for hybrid wallet architecture combining classical and post-quantum cryptography."
    },
    {
      title: "Key Generation Module",
      status: "in-progress",
      description: "Implementation of hybrid key generation supporting both secp256k1 and ML-DSA-65 key pairs."
    },
    {
      title: "Signature Engine Prototype",
      status: "in-progress",
      description: "Development of signature creation and verification logic for hybrid ECDSA + ML-DSA signatures."
    },
    {
      title: "Performance Benchmarking",
      status: "planned",
      description: "Systematic measurement of signing/verification times across hardware configurations."
    },
    {
      title: "Security Analysis Report",
      status: "planned",
      description: "Threat modeling and preliminary security evaluation of the prototype implementation."
    },
    {
      title: "Phase I Technical Report",
      status: "planned",
      description: "Comprehensive documentation of findings, feasibility assessment, and recommendations."
    }
  ];

  const phase2Objectives = [
    "Extended prototype with testnet integration",
    "Multi-signature scheme research and implementation",
    "Hardware security module (HSM) integration study",
    "Formal verification of critical components",
    "Third-party security audit",
    "User interface refinement and usability testing",
    "Migration tooling development",
    "Comprehensive technical documentation"
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">Completed</span>;
      case "in-progress":
        return <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">In Progress</span>;
      default:
        return <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">Planned</span>;
    }
  };

  return (
    <div className="min-h-screen" data-testid="roadmap-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Target className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Research Milestones</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Development Roadmap</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Our phased approach to researching and developing post-quantum 
              cryptographic solutions for digital asset protection.
            </p>
          </div>
        </div>
      </section>

      {/* Phase I Section */}
      <section className="py-20" data-testid="phase1-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4">
              <Flag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Phase I: Technical Feasibility</h2>
              <p className="text-muted-foreground">Establish foundational research and prototype development</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <Calendar className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Timeline</h3>
              <p className="text-muted-foreground text-sm">6-9 months research period</p>
            </div>
            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <Target className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Objective</h3>
              <p className="text-muted-foreground text-sm">Demonstrate technical feasibility of hybrid PQ wallet architecture</p>
            </div>
            <div className="p-6 rounded-xl bg-secondary/30 border border-border">
              <CheckCircle2 className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Deliverables</h3>
              <p className="text-muted-foreground text-sm">Prototype, benchmarks, security analysis, technical report</p>
            </div>
          </div>

          <div className="space-y-4">
            {phase1Milestones.map((milestone, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border flex items-start gap-4"
                data-testid={`milestone-${index}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    {getStatusLabel(milestone.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  M{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase II Section */}
      <section className="py-20 bg-secondary/30" data-testid="phase2-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mr-4">
              <Flag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Phase II: Extended Development</h2>
              <p className="text-muted-foreground">Contingent on Phase I success and continued funding</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground mb-6">
                Phase II research objectives are contingent upon successful completion 
                of Phase I milestones and availability of continued research funding. 
                These objectives represent potential directions for extended development 
                and should not be considered committed deliverables.
              </p>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-200">
                  <strong>Note:</strong> Phase II scope and timeline will be refined 
                  based on Phase I findings and recommendations.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="text-lg font-semibold mb-6">Potential Research Directions</h3>
              <ul className="space-y-3">
                {phase2Objectives.map((objective, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Circle className="h-4 w-4 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Visualization */}
      <section className="py-20" data-testid="timeline-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Research Timeline Overview</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border" />

            <div className="space-y-12">
              {/* Phase I Start */}
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-lg font-semibold">Phase I Initiation</h3>
                  <p className="text-sm text-muted-foreground">Literature review, architecture design</p>
                </div>
                <div className="h-4 w-4 rounded-full bg-green-500 z-10" />
                <div className="flex-1 pl-8">
                  <span className="text-sm text-green-400">Completed</span>
                </div>
              </div>

              {/* Current */}
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <span className="text-sm text-blue-400">In Progress</span>
                </div>
                <div className="h-4 w-4 rounded-full bg-blue-500 z-10 animate-pulse" />
                <div className="flex-1 pl-8">
                  <h3 className="text-lg font-semibold">Prototype Development</h3>
                  <p className="text-sm text-muted-foreground">Key generation, signature engine</p>
                </div>
              </div>

              {/* Phase I End */}
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-lg font-semibold">Phase I Completion</h3>
                  <p className="text-sm text-muted-foreground">Benchmarks, security analysis, report</p>
                </div>
                <div className="h-4 w-4 rounded-full bg-secondary border-2 border-muted-foreground z-10" />
                <div className="flex-1 pl-8">
                  <span className="text-sm text-muted-foreground">Planned</span>
                </div>
              </div>

              {/* Phase II */}
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <span className="text-sm text-muted-foreground">Contingent</span>
                </div>
                <div className="h-4 w-4 rounded-full bg-secondary border-2 border-purple-500/50 z-10" />
                <div className="flex-1 pl-8">
                  <h3 className="text-lg font-semibold text-purple-400">Phase II (Potential)</h3>
                  <p className="text-sm text-muted-foreground">Extended development pending Phase I success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-950/30 via-background to-purple-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Questions About Our Research?</h2>
          <p className="text-muted-foreground mb-8">
            We welcome inquiries from researchers, grant reviewers, and collaborators.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            data-testid="roadmap-cta-contact"
          >
            Contact Research Team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RoadmapPage;
