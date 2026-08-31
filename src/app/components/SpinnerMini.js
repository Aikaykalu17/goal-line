import { LoaderCircle } from "lucide-react";

function SpinnerMini({ className = "" }) {
  return (
    <LoaderCircle size={14} className={`animate-spin w-4 h-4 ${className}`} />
  );
}

export default SpinnerMini;
