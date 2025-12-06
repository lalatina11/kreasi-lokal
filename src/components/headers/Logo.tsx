import { Link } from "@tanstack/react-router";

const Logo = () => {
  return (
    <Link to="/" className="text-lg font-semibold flex items-center">
      <img src="/kl-simple.png" className="h-15 w-auto" />
      <span className="text-lg font-semibold">Kreasi Lokasl</span>
    </Link>
  );
};

export default Logo;
