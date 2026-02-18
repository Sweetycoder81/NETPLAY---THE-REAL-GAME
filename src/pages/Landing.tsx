import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "../components/ui/Button";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const shuttleX = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const shuttleY = useTransform(scrollYProgress, [0, 0.5, 1], [40, -30, 40]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 0.8]);

  const authed = useMemo(() => Boolean(localStorage.getItem("token")), []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-black text-white"
            >
              ENTER
              <span className="block bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                THE ARENA
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-gray-300 max-w-xl"
            >
              Scroll to rally the neon shuttle. Sign in to deploy into battlefields, find squads, and unlock ranks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              {authed ? (
                <Button variant="gaming" enableGlitch={true} onClick={() => navigate("/dashboard")}>
                  DEPLOY
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="gaming" enableGlitch={true}>SIGN IN</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline">CREATE ACCOUNT</Button>
                  </Link>
                </>
              )}
            </motion.div>

            <div className="mt-10 text-xs font-mono tracking-wider text-gray-500">
              SCROLL: SHUTTLE RALLY • FX: NEON • MODE: PRE-LOGIN
            </div>
          </div>

          <div className="relative">
            <div className="glass-card-2 border border-neon-cyan/20 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider text-gray-400 mb-4">
                <span>RALLY SIMULATION</span>
                <span className="text-neon-cyan">LIVE</span>
              </div>

              <div className="relative h-[340px] rounded-xl bg-slate-950/40 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 opacity-60" style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(0,243,255,0.16) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(112,0,255,0.12) 0%, transparent 55%)",
                }} />

                {/* Left silhouette */}
                <div className="absolute left-6 bottom-10 w-24 h-44 rounded-t-full bg-black/35 border border-white/10" />
                {/* Right silhouette */}
                <div className="absolute right-6 bottom-10 w-24 h-44 rounded-t-full bg-black/35 border border-white/10" />

                {/* Net */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-16 w-[2px] h-52 bg-white/10" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-16 w-40 h-[2px] bg-white/10" />

                {/* Shuttlecock */}
                <motion.div
                  className="absolute left-10 top-24"
                  style={{ x: shuttleX, y: shuttleY }}
                >
                  <motion.div
                    className="relative"
                    style={{ filter: "drop-shadow(0 0 18px rgba(0,243,255,0.55))" }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-electric-purple border border-white/20"
                      style={{ opacity: glow }}
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-8 rounded-full bg-white/10 border border-white/10" />
                  </motion.div>
                </motion.div>

                {/* Rally line */}
                <div className="absolute left-10 right-10 top-28 h-[1px] bg-gradient-to-r from-neon-cyan/10 via-white/10 to-electric-purple/10" />
              </div>

              <div className="mt-4 text-sm text-gray-400">
                Scroll to animate the rally. This is the pre-login experience.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[90vh]" />
    </div>
  );
};

export default Landing;
