
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const NavigationLink = ({ to, className, children }: NavigationLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-healthcare-600",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
