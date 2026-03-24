"use client";

import { useVeritasSocket } from "@/lib/use-socket";
import { useEffect, useRef } from "react";

export function LiveTerminal() {
  const messages = useVeritasSocket();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="rounded-lg border bg-black p-4 font-mono text-sm text-green-400 h-[300px] overflow-y-auto shadow-inner">
      <div className="mb-2 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-1">
        Veritas Live Engine Stream
      </div>
      <div className="flex flex-col-reverse">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1 break-all">
            <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {msg.includes("Healed") ? (
              <span className="text-yellow-400 font-bold">{msg}</span>
            ) : msg.includes("COMPLETED") ? (
              <span className="text-blue-400">{msg}</span>
            ) : (
              <span>{msg}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
