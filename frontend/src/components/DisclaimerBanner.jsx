import { AlertTriangle } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div 
      className="bg-amber-500/10 border-b border-amber-500/30 py-2 px-4"
      data-testid="disclaimer-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-200 font-medium">
          Research prototype. Not a production wallet. No custody.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
