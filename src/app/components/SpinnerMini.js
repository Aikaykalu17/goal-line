import { LoaderCircle } from "lucide-react";

function SpinnerMini({ className = "" }) {
  return <LoaderCircle className={`animate-spin w-6 h-6 ${className}`} />;
}

export default SpinnerMini;
