import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";
import { NavLink } from "./NavLink";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-navy-deep/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <img
          src="/luxus_logo.jpg"
          alt="Luxus"
          className="h-10 w-auto object-contain rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
        />

        <div className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground font-semibold"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/analytics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground font-semibold"
          >
            Analytics
          </NavLink>
          <NavLink
            to="/reports"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground font-semibold"
          >
            Reports
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass/50 md:flex">
            <span className="text-sm font-semibold text-gold">JD</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
