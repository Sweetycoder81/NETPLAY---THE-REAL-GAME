import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type LobbyUser = {
  id: string;
  name: string;
  level?: number;
  title?: string;
};

export type LobbyMessage = {
  id: string;
  type: "chat" | "system";
  user?: LobbyUser;
  text: string;
  attachment?: {
    name: string;
    kind: "image" | "file";
    url?: string;
  };
  callLink?: {
    url: string;
    label?: string;
  };
  createdAt: number;
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useLobbySocket = (opts: { enabled: boolean; name: string }) => {
  const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<LobbyUser[]>([]);
  const [messages, setMessages] = useState<LobbyMessage[]>([]);

  const identity = useMemo(() => ({ name: opts.name }), [opts.name]);

  useEffect(() => {
    if (!opts.enabled) return;

    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token") || undefined,
      },
      query: {
        name: identity.name,
      },
    });

    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          type: "system",
          text: `${identity.name} joined the Arena`,
          createdAt: Date.now(),
        },
      ]);
      socket.emit("lobby:join", { name: identity.name });
    };

    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Server may emit any of these
    socket.on("lobby:users", (payload: any) => {
      const list = Array.isArray(payload) ? payload : payload?.users;
      if (Array.isArray(list)) {
        setUsers(
          list.map((u: any) => ({
            id: String(u?.id || u?._id || u?.socketId || makeId()),
            name: String(u?.name || u?.username || "Unknown"),
            level: u?.level,
            title: u?.title,
          }))
        );
      }
    });

    socket.on("lobby:message", (payload: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(payload?.id || makeId()),
          type: payload?.type === "system" ? "system" : "chat",
          user: payload?.user
            ? {
                id: String(payload.user.id || payload.user._id || makeId()),
                name: String(payload.user.name || "Unknown"),
                level: payload.user.level,
                title: payload.user.title,
              }
            : undefined,
          text: String(payload?.text || ""),
          attachment: payload?.attachment
            ? {
                name: String(payload.attachment.name || "file"),
                kind: payload.attachment.kind === "image" ? "image" : "file",
                url: payload.attachment.url,
              }
            : undefined,
          callLink: payload?.callLink
            ? {
                url: String(payload.callLink.url || ""),
                label: payload.callLink.label,
              }
            : undefined,
          createdAt: Number(payload?.createdAt || Date.now()),
        },
      ]);
    });

    socket.on("lobby:user-joined", (payload: any) => {
      const name = String(payload?.name || "A warrior");
      setMessages((prev) => [
        ...prev,
        { id: makeId(), type: "system", text: `${name} joined the Arena`, createdAt: Date.now() },
      ]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [opts.enabled, socketUrl, identity.name]);

  const sendMessage = (payload: { text?: string; attachment?: LobbyMessage["attachment"]; callLink?: LobbyMessage["callLink"]; type?: LobbyMessage["type"] }) => {
    const trimmed = String(payload.text || "").trim();
    const hasAttachment = Boolean(payload.attachment);
    const hasCallLink = Boolean(payload.callLink?.url);
    if (!trimmed && !hasAttachment && !hasCallLink) return;

    const socket = socketRef.current;

    const optimistic: LobbyMessage = {
      id: makeId(),
      type: payload.type || "chat",
      user: { id: "me", name: identity.name },
      text: trimmed,
      attachment: payload.attachment,
      callLink: payload.callLink,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, optimistic]);

    if (socket?.connected) {
      socket.emit("lobby:message", {
        type: optimistic.type,
        text: trimmed,
        attachment: optimistic.attachment,
        callLink: optimistic.callLink,
      });
    }
  };

  return { connected, users, messages, sendMessage };
};
