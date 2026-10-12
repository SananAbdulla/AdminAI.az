"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createDemoState } from "./demo-data";
import type { AiAction, AppState, InboxMessage } from "./types";

type Store = {
  state: AppState;
  applyActions: (actions: AiAction[]) => void;
  markRead: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDemoState());

  const value = useMemo<Store>(
    () => ({
      state,
      markRead: (id) =>
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === id ? { ...m, unread: false } : m,
          ),
        })),
      applyActions: (actions) => {
        setState((prev) => {
          let next = { ...prev };
          for (const action of actions) {
            if (action.type === "confirm") {
              next = {
                ...next,
                appointments: next.appointments.map((a) =>
                  a.id === action.appointmentId
                    ? { ...a, status: "confirmed" }
                    : a,
                ),
              };
            }
            if (action.type === "mark_read") {
              next = {
                ...next,
                messages: next.messages.map((m) =>
                  m.id === action.messageId ? { ...m, unread: false } : m,
                ),
              };
            }
            if (action.type === "reply") {
              const outgoing: InboxMessage = {
                id: `out-${Date.now()}-${action.customerId}`,
                customerId: action.customerId,
                channel: "whatsapp",
                text: action.text,
                at: new Date().toISOString(),
                unread: false,
                direction: "out",
              };
              next = {
                ...next,
                messages: [
                  ...next.messages.map((m) =>
                    m.customerId === action.customerId
                      ? { ...m, unread: false }
                      : m,
                  ),
                  outgoing,
                ],
              };
            }
          }
          return next;
        });
      },
    }),
    [state],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
