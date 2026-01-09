import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="font-semibold gradient-text">QuantumShield</span>
            <span className="text-xs text-muted-foreground">• Research Project</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/wallet" className="text-muted-foreground hover:text-blue-400 transition-colors">Wallet</Link>
            <Link to="/roadmap" className="text-muted-foreground hover:text-blue-400 transition-colors">Roadmap</Link>
            <Link to="/team" className="text-muted-foreground hover:text-blue-400 transition-colors">Team</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-blue-400 transition-colors">Contact</Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} • Prototype Only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
