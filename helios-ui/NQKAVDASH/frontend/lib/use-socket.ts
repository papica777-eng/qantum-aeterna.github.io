"use client";

import { useEffect, useRef, useState } from 'react';

export function useVeritasSocket() {
  const [messages, setMessages] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the Rust backend WebSocket
    const socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
      console.log('Veritas Socket Connected');
      setMessages(prev => ["Veritas Engine: Connected...", ...prev]);
    };

    socket.onmessage = (event) => {
      const msg = event.data;
      setMessages(prev => [msg, ...prev].slice(0, 50)); // Keep last 50 logs
    };

    socket.onclose = () => {
      console.log('Veritas Socket Disconnected');
      setMessages(prev => ["Veritas Engine: Disconnected. Reconnecting...", ...prev]);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return messages;
}
