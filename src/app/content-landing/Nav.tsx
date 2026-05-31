import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import Logo from "../components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OutlineButtonComponent from "@/app/components/content-button/outlile-btn";

export default function Nav() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const router = useRouter();

    const redirectToAuth = () => router.push("/authentication");

    return(
      <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 glass-panel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="font-display font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100">
              triplit
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-stone-500 dark:text-stone-400">
            <a href="#features" className="hover:text-gold transition-colors duration-200">Features</a>
            <a href="#peek" className="hover:text-gold transition-colors duration-200">Live Preview</a>
            <a href="#testimonials" className="hover:text-gold transition-colors duration-200">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <OutlineButtonComponent
                label="Sign In"
                onClick={redirectToAuth}
              />
            </div>
      
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card text-stone-600 dark:text-stone-300 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-pearl-border/50 dark:border-obsidian-border/50 pt-4 flex flex-col gap-3 animate-text-reveal">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-gold transition-colors px-2 py-1.5">Features</a>
            <a href="#peek" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-gold transition-colors px-2 py-1.5">Live Preview</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-gold transition-colors px-2 py-1.5">Testimonials</a>
            <OutlineButtonComponent
              label="Sign In"
              onClick={() => {
                redirectToAuth();
                setMobileMenuOpen(false);
              }}
            />
          </div>
        )}
      </nav>
    )
}