import { Link } from "react-router-dom";
import { Users, Building2, GraduationCap, Award, ArrowRight, Mail } from "lucide-react";

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Principal Investigator",
      background: "Ph.D. Cryptography, MIT",
      expertise: "Post-quantum cryptography, lattice-based schemes",
      description: "15+ years in cryptographic research with focus on practical PQC implementations."
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Software Engineer",
      background: "M.S. Computer Science, Stanford",
      expertise: "Secure systems, blockchain protocols",
      description: "Former security engineer at major cryptocurrency exchange. Expert in wallet architecture."
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Scientist",
      background: "Ph.D. Mathematics, Cambridge",
      expertise: "Formal verification, security proofs",
      description: "Specializes in formal analysis of cryptographic protocols and security guarantees."
    },
    {
      name: "James Park",
      role: "Security Researcher",
      background: "M.S. Information Security, Georgia Tech",
      expertise: "Side-channel attacks, hardware security",
      description: "Background in hardware security modules and implementation attack resistance."
    }
  ];

  const advisors = [
    {
      name: "Prof. Michael Torres",
      affiliation: "University of California, Berkeley",
      expertise: "Quantum computing, post-quantum migration strategies"
    },
    {
      name: "Dr. Lisa Yamamoto",
      affiliation: "National Institute of Standards and Technology",
      expertise: "Cryptographic standards, algorithm evaluation"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="team-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Users className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Research Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Team & Organization</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Meet the researchers and engineers advancing post-quantum 
              cryptographic solutions for digital asset security.
            </p>
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section className="py-20" data-testid="organization-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-blue-500 mr-4" />
                <h2 className="text-2xl md:text-3xl font-bold">About QuantumShield</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                QuantumShield is a research initiative focused on developing and evaluating 
                post-quantum cryptographic solutions for cryptocurrency wallet security. 
                Our work is driven by the recognition that current cryptographic standards 
                will require migration to quantum-resistant alternatives.
              </p>
              <p className="text-muted-foreground mb-6">
                As a research-stage project, we prioritize rigorous evaluation, transparent 
                methodology, and conservative claims. Our goal is to contribute to the 
                broader ecosystem's preparedness for the post-quantum transition.
              </p>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="text-sm font-semibold mb-2">Research Focus Areas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NIST post-quantum cryptographic standard implementation</li>
                  <li>• Hybrid classical/post-quantum signature schemes</li>
                  <li>• Non-custodial wallet architecture design</li>
                  <li>• Cryptographic migration strategies</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-background border border-border text-center">
                <GraduationCap className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-1">4+</div>
                <div className="text-sm text-muted-foreground">Research Staff</div>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border text-center">
                <Award className="h-10 w-10 text-green-500 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-1">2</div>
                <div className="text-sm text-muted-foreground">Advisory Board</div>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border text-center">
                <Building2 className="h-10 w-10 text-purple-500 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-1">2023</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border text-center">
                <Users className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-1">Phase I</div>
                <div className="text-sm text-muted-foreground">Current Stage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-secondary/30" data-testid="team-members-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Core Research Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team combines expertise in cryptography, software engineering, 
              and security research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border card-hover"
                data-testid={`team-member-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-blue-400 mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground mb-3">{member.background}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.description}</p>
                    <div className="text-xs text-muted-foreground bg-secondary/50 rounded px-2 py-1 inline-block">
                      Expertise: {member.expertise}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-20" data-testid="advisors-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Advisory Board</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guidance from leading experts in cryptography and quantum computing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border"
                data-testid={`advisor-${index}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{advisor.name}</h3>
                    <p className="text-sm text-muted-foreground">{advisor.affiliation}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground">Expertise:</span> {advisor.expertise}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-950/30 via-background to-purple-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Interested in Collaboration?</h2>
          <p className="text-muted-foreground mb-8">
            We welcome inquiries from researchers, academic institutions, 
            and organizations interested in post-quantum cryptography.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              data-testid="team-cta-contact"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-secondary text-foreground font-medium transition-colors"
              data-testid="team-cta-roadmap"
            >
              View Research Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
