import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold gradient-text">QuantumShield</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A research initiative developing post-quantum cryptographic solutions 
              for digital asset protection. This project is in prototype stage and 
              intended for research and evaluation purposes only.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Research Project • Not for Production Use
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/wallet" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">Wallet Concept</Link></li>
              <li><Link to="/roadmap" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">Roadmap</Link></li>
              <li><Link to="/team" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">Team</Link></li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Research</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><span className="text-sm text-muted-foreground">Publications (Coming)</span></li>
              <li><span className="text-sm text-muted-foreground">Documentation (Coming)</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} QuantumShield Research Project. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
            Prototype Status • Research Use Only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
