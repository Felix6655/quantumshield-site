import { Link } from "react-router-dom";
import { Users, ArrowRight, Mail, User, Code, ShieldCheck } from "lucide-react";

const TeamPage = () => {
  const teamMembers = [
    {
      role: "Founder & Principal Investigator",
      icon: User,
      color: "blue",
      responsibilities: [
        "Research direction and strategy",
        "Grant writing and stakeholder relations",
        "Technical architecture oversight",
        "Publications and academic outreach"
      ],
      placeholder: "[Name TBD]"
    },
    {
      role: "Crypto Engineer",
      icon: Code,
      color: "green",
      responsibilities: [
        "Post-quantum algorithm implementation",
        "Hybrid signature scheme development",
        "Performance optimization",
        "Code review and security hardening"
      ],
      placeholder: "[Name TBD]"
    },
    {
      role: "Security Advisor",
      icon: ShieldCheck,
      color: "purple",
      responsibilities: [
        "Threat modeling and risk assessment",
        "Security architecture review",
        "Side-channel attack analysis",
        "External audit coordination"
      ],
      placeholder: "[Name TBD]"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
      green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen" data-testid="team-page">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Users className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">Research Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              The researchers and engineers behind QuantumShield.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16" data-testid="team-members-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {teamMembers.map((member, index) => {
              const colors = getColorClasses(member.color);
              const Icon = member.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl bg-background border ${colors.border} card-hover`}
                  data-testid={`team-member-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className={`h-16 w-16 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{member.role}</h3>
                        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {member.placeholder}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Responsibilities:</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {member.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <span className={`${colors.text} mr-2`}>•</span>
                              <span className="text-muted-foreground">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}]
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in Contributing?</h2>
          <p className="text-muted-foreground mb-6">
            We welcome collaboration inquiries from researchers and engineers 
            with expertise in cryptography, security, or blockchain technology.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            data-testid="team-cta-contact"
          >
            <Mail className="mr-2 h-4 w-4" />
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
