import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import LevelBadge from "../ui/LevelBadge";
import { getRankFromExp } from "../../utils/leveling";
import { useLobbySocket } from "../../hooks/useLobbySocket";

type LobbyPanelProps = {
  open: boolean;
  onClose: () => void;
  playerName: string;
  playerExp: number;
};

const LobbyPanel: React.FC<LobbyPanelProps> = ({ open, onClose, playerName, playerExp }) => {
  const [text, setText] = useState("");

  const rank = useMemo(() => getRankFromExp(playerExp), [playerExp]);
  const { connected, users, messages, sendMessage } = useLobbySocket({ enabled: open, name: playerName });

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed right-4 top-20 bottom-4 w-[380px] z-50"
        >
          <Card enableNeonBorder={true} className="h-full p-4 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-white font-black">THE LOBBY</div>
                <div className="text-xs text-gray-400 font-mono tracking-wider">
                  STATUS: {connected ? "ONLINE" : "CONNECTING"}
                </div>
              </div>
              <Button variant="outline" onClick={onClose}>
                CLOSE
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-sm text-gray-300 font-mono">
                {playerName.toUpperCase()}
              </div>
              <LevelBadge level={rank.level} title={rank.title} />
            </div>

            <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
              <div className="col-span-2 glass-card-2 p-3 overflow-auto border border-white/10 rounded-lg">
                <div className="text-xs text-gray-400 font-mono tracking-wider mb-2">WARRIORS</div>
                <div className="space-y-2">
                  {(users.length ? users : [{ id: "local", name: playerName, level: rank.level, title: rank.title }]).map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-gray-200 font-mono truncate">{u.name.toUpperCase()}</div>
                      {u.level && u.title ? (
                        <div className="text-[10px] text-neon-cyan font-mono">LVL {u.level}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-3 flex flex-col min-h-0">
                <div className="flex-1 glass-card-2 p-3 overflow-auto border border-white/10 rounded-lg">
                  <div className="space-y-3">
                    {messages.slice(-100).map((m) => (
                      <div key={m.id}>
                        {m.type === "system" ? (
                          <div className="text-[11px] text-gray-400 font-mono tracking-wider">
                            [SYSTEM] {m.text}
                          </div>
                        ) : (
                          <div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {(m.user?.name || "UNKNOWN").toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-200">{m.text}</div>
                          </div>
                        )}
                      </div>
                    ))}
                    {messages.length === 0 ? (
                      <div className="text-[11px] text-gray-500 font-mono tracking-wider">
                        NO SIGNAL. WAITING FOR TRANSMISSION...
                      </div>
                    ) : null}
                  </div>
                </div>

                <form
                  className="mt-3 flex items-end gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(text);
                    setText("");
                  }}
                >
                  <Input
                    label=""
                    placeholder="Type message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button variant="gaming" enableGlitch={true} type="submit">
                    SEND
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

export default LobbyPanel;
