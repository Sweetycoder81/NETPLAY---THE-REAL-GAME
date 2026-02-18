import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import LevelBadge from "../ui/LevelBadge";
import { getRankFromExp } from "../../utils/leveling";
import { useLobbySocket } from "../../hooks/useLobbySocket";
import { useTheme } from "../../context/ThemeContext";

type LobbyPanelProps = {
  open: boolean;
  onClose: () => void;
  playerName: string;
  playerExp: number;
};

const LobbyPanel: React.FC<LobbyPanelProps> = ({ open, onClose, playerName, playerExp }) => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<null | { name: string; kind: "image" | "file"; url?: string }>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mode } = useTheme();

  const rank = useMemo(() => getRankFromExp(playerExp), [playerExp]);
  const { connected, users, messages, sendMessage } = useLobbySocket({ enabled: open, name: playerName });

  const panelClasses =
    mode === "day"
      ? "h-full p-4 flex flex-col bg-white/40 border border-black/10 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
      : "h-full p-4 flex flex-col bg-slate-900/80 border border-neon-cyan/20 shadow-[0_0_40px_rgba(0,0,0,0.55)]";

  const paneClasses =
    mode === "day"
      ? "p-3 overflow-auto rounded-lg bg-white/55 border border-black/10"
      : "p-3 overflow-auto rounded-lg bg-slate-950/40 border border-white/10";

  const nameText = mode === "day" ? "text-slate-900" : "text-slate-100";
  const mutedText = mode === "day" ? "text-slate-600" : "text-slate-300/80";

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
          <Card enableNeonBorder={true} className={panelClasses}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className={`${mode === "day" ? "text-slate-900" : "text-white"} font-black tracking-wide`}>THE LOBBY</div>
                <div className={`text-xs ${mutedText} font-mono tracking-wider`}>
                  STATUS: {connected ? "ONLINE" : "CONNECTING"}
                </div>
              </div>
              <Button variant="outline" onClick={onClose}>
                CLOSE
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className={`text-sm ${mode === "day" ? "text-slate-700" : "text-gray-300"} font-mono`}>
                {playerName.toUpperCase()}
              </div>
              <LevelBadge level={rank.level} title={rank.title} />
            </div>

            <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
              <div className={`col-span-2 ${paneClasses}`}>
                <div className={`text-xs ${mutedText} font-mono tracking-wider mb-2`}>WARRIORS</div>
                <div className="space-y-2">
                  {(users.length ? users : [{ id: "local", name: playerName, level: rank.level, title: rank.title }]).map((u) => (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between gap-2 p-2 rounded-lg ${mode === "day" ? "bg-white/60 border border-black/10" : "bg-black/20 border border-white/10"}`}
                    >
                      <div className={`text-xs ${nameText} font-mono truncate`}>{u.name.toUpperCase()}</div>
                      {u.level && u.title ? (
                        <div className="text-[10px] text-neon-cyan/90 font-mono">LVL {u.level}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-3 flex flex-col min-h-0">
                <div className={`flex-1 ${paneClasses}`}>
                  <div className="space-y-3">
                    {messages.slice(-100).map((m) => (
                      <div key={m.id}>
                        {m.type === "system" ? (
                          <div className={`text-[11px] ${mode === "day" ? "text-slate-700" : "text-neon-cyan/70"} font-mono tracking-wider`}>
                            [SYSTEM] {m.text}
                            {m.callLink?.url ? (
                              <div className={`mt-2 rounded-lg p-3 ${mode === "day" ? "bg-white/70 border border-black/10" : "bg-black/20 border border-white/10"}`}>
                                <div className={`text-xs font-mono tracking-wider ${mutedText}`}>CALL LINK</div>
                                <a
                                  className="mt-1 inline-block text-neon-cyan font-mono text-sm"
                                  href={m.callLink.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {m.callLink.label || 'JOIN CALL'}
                                </a>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div>
                            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                              {(m.user?.name || "UNKNOWN").toUpperCase()}
                            </div>
                            <div className="text-sm text-slate-100 leading-snug">{m.text}</div>
                            {m.attachment?.kind === 'image' && m.attachment.url ? (
                              <div className="mt-2">
                                <img
                                  src={m.attachment.url}
                                  alt={m.attachment.name}
                                  className="max-w-full rounded-lg border border-white/10"
                                />
                              </div>
                            ) : null}
                            {m.attachment?.kind === 'file' ? (
                              <div className={`mt-2 rounded-lg p-2 ${mode === "day" ? "bg-white/60 border border-black/10" : "bg-black/20 border border-white/10"}`}>
                                <div className={`text-xs ${mutedText} font-mono`}>ATTACHMENT</div>
                                <div className={`text-sm ${mode === "day" ? "text-slate-900" : "text-slate-100"}`}>{m.attachment.name}</div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                    {messages.length === 0 ? (
                      <div className="text-[11px] text-slate-400 font-mono tracking-wider">
                        NO SIGNAL. WAITING FOR TRANSMISSION...
                      </div>
                    ) : null}
                  </div>
                </div>

                <form
                  className="mt-3 flex items-end gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage({ text, attachment: attachment || undefined, type: 'chat' });
                    setText("");
                    setAttachment(null);
                  }}
                >
                  <Input
                    label=""
                    placeholder="Type message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={
                      mode === "day"
                        ? "bg-white/70 border-black/10 placeholder-slate-500 focus:ring-neon-cyan/60 text-slate-900"
                        : "bg-slate-950/60 border-white/10 placeholder-slate-500 focus:ring-neon-cyan/60"
                    }
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const isImage = file.type.startsWith('image/');
                      const url = isImage ? URL.createObjectURL(file) : undefined;
                      setAttachment({ name: file.name, kind: isImage ? 'image' : 'file', url });
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    ATTACH
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const id = (crypto as any)?.randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                      const url = `${window.location.origin}/call/${id}`;
                      sendMessage({
                        type: 'system',
                        text: 'Call link generated',
                        callLink: { url, label: 'JOIN CALL' },
                      });
                    }}
                  >
                    CALL LINK
                  </Button>
                  <Button variant="gaming" enableGlitch={true} type="submit">
                    SEND
                  </Button>
                </form>

                {attachment ? (
                  <div className={`mt-2 rounded-lg p-2 ${mode === "day" ? "bg-white/60 border border-black/10" : "bg-black/20 border border-white/10"}`}>
                    <div className={`text-xs ${mutedText} font-mono`}>READY TO SEND</div>
                    <div className={`text-sm ${mode === "day" ? "text-slate-900" : "text-slate-100"}`}>{attachment.name}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

export default LobbyPanel;
