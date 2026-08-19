import { motion } from "motion/react";
import Navbar from '../components/Navbar.jsx'
import img from "../assets/img1.png"
import Footer from '../components/Footer.jsx'
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: "📓", title: "Exam Notes", des: "High-yield exam oriented notes with revision points.", chip: "bg-blue-50 border-blue-200", titleColor: "text-blue-700", hover: "hover:shadow-blue-200/60" },
  { icon: "📚", title: "Project Notes", des: "Well-structured content for assignments and projects.", chip: "bg-purple-50 border-purple-200", titleColor: "text-purple-700", hover: "hover:shadow-purple-200/60" },
  { icon: "📊", title: "Diagram Notes", des: "Auto-generated visual diagrams for clarity.", chip: "bg-pink-50 border-pink-200", titleColor: "text-pink-700", hover: "hover:shadow-pink-200/60" },
  { icon: "📄", title: "PDF Download", des: "Download clean, printable PDFs instantly.", chip: "bg-amber-50 border-amber-200", titleColor: "text-amber-700", hover: "hover:shadow-amber-200/60" },
];

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'>
      {/* Decorative gradient blobs */}
      <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl' />
      <div className='pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl' />

      <Navbar/>

      {/* Hero */}
      <section className='relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 lg:pt-28 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center'>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-purple-200 text-purple-700 text-xs sm:text-sm font-semibold shadow-sm"
          >
            ✨ AI-Powered Study Assistant
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            Create Smart <br /> AI Notes in Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className='mt-6 max-w-xl text-lg text-gray-600 leading-relaxed'
          >
            Generate exam-focused notes, project documentation, flow diagrams and
            revision ready content using AI — faster, cleaner and smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <motion.button
              onClick={() => navigate("/notes")}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold text-base shadow-[0_15px_35px_rgba(124,58,237,0.4)] hover:shadow-[0_18px_40px_rgba(124,58,237,0.5)] transition-shadow flex items-center justify-center gap-2"
            >
              🚀 Get Started
            </motion.button>

            <motion.button
              onClick={() => navigate("/history")}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-base shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              📚 Your Notes
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex items-center gap-8"
          >
            <div>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">100%</p>
              <p className="text-xs text-gray-500 mt-1">AI Powered</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Free</p>
              <p className="text-xs text-gray-500 mt-1">To Get Started</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">Instant</p>
              <p className="text-xs text-gray-500 mt-1">Study-Ready</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_30px_80px_rgba(79,70,229,0.15)] p-6 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-200/40 blur-2xl" />

            <img src={img} alt="ExamNotes AI" className="relative w-full rounded-2xl" />

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-gray-200 text-xs font-semibold text-gray-700 shadow-md"
            >
              ⚡ Instant Generation
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-gray-200 text-xs font-semibold text-gray-700 shadow-md"
            >
              📊 Diagrams + Charts
            </motion.div>
          </div>
        </motion.div>

      </section>

      {/* Features */}
      <section className='relative max-w-7xl mx-auto px-6 sm:px-8 py-24'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
            🎯 Why ExamNotes AI
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Everything you need to study smarter
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            From exam notes to visual diagrams, get all the tools to prepare faster and score higher.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon, title, des, chip, titleColor, hover }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`group rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl ${hover} transition-all duration-300`}
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${chip} text-3xl mb-4 transition-transform duration-300 group-hover:scale-110`}>
                {icon}
              </div>

              <h3 className={`text-lg font-bold mb-2 ${titleColor}`}>
                {title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">{des}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 md:p-10 text-white text-center shadow-[0_25px_60px_rgba(124,58,237,0.35)]"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Ready to ace your exams?
          </h2>
          <p className="mt-2 text-white/80 max-w-lg mx-auto">
            Generate your first set of AI notes in seconds — no setup required.
          </p>
          <motion.button
            onClick={() => navigate("/notes")}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 px-8 py-3 rounded-full bg-white text-purple-700 font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Generating →
          </motion.button>
        </motion.div>
      </section>

      <Footer/>
    </div>
  )
}

export default Home