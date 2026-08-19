import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FaXTwitter, FaGithub, FaLinkedinIn, FaYoutube, FaHeart } from "react-icons/fa6";

import logo from "../assets/logo.png";

const SOCIALS = [
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

function Footer() {
  const navigate = useNavigate();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="z-10 relative mx-5 mb-6 mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-white/10 shadow-[0_25px_60px_rgba(2,6,23,0.45)]"
    >
      {/* subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

      <div className="relative px-6 py-10 sm:px-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => navigate("/")}>
              <img src={logo} alt="ExamNotes" className="w-9 h-9" />
              <span className="text-lg font-bold">
                ExamNotes <span className="text-purple-300">AI</span>
              </span>
            </div>

            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              ExamNotes AI helps students generate exam-focused notes,
              revision material, diagrams, and printable PDFs using AI.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-lg"
                >
                  <Icon className="text-sm transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">
              Quick Links
            </h2>

            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-300 hover:text-purple-300 transition-colors cursor-pointer group inline-flex items-center gap-1.5"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/notes")}
                  className="text-gray-300 hover:text-purple-300 transition-colors cursor-pointer group inline-flex items-center gap-1.5"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  Generate Notes
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/history")}
                  className="text-gray-300 hover:text-purple-300 transition-colors cursor-pointer group inline-flex items-center gap-1.5"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  History
                </button>
              </li>

              <li>
                <a
                  href="mailto:support@examnotes.com"
                  className="text-gray-300 hover:text-purple-300 transition-colors group inline-flex items-center gap-1.5"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* SUPPORT & ACCOUNT */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">
              Support & Account
            </h2>

            <ul className="space-y-2.5 text-sm">
              <li className="text-gray-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-purple-400">✉</span>
                  support@examnotes.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 ExamNotes AI. All rights reserved.
          </p>

          <p className="text-xs text-gray-300 flex items-center gap-1.5">
            Made with <FaHeart className="text-pink-500 animate-pulse" /> by Ashutosh Pradhan
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;