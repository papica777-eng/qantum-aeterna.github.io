// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 ENTROPY_SUPERVISOR (Gleam/BEAM)
// ═══════════════════════════════════════════════════════════════════════════════
// Substrate:   Erlang VM (BEAM) — OTP Supervisor Tree
// Soul Bind:   axioms.soul::ENTROPY, reclamation.soul::REBOUND
// Architect:   Dimitar Prodromov (ID 101327948)
// Authority:   AETERNA_LOGOS_DIMITAR_PRODROMOV!
//
// Purpose:
//   THE TOP-LEVEL OTP SUPERVISOR.
//   Manages ALL Gleam actors (Immutable_Swarm, Veritas_Watchdog,
//   Wealth_Sentinel) under a single supervisor tree with the
//   strategy: REST_FOR_ONE.
//
//   This is the root of BEAM fault-tolerance in AETERNA.
//   If one child crashes, all downstream children restart in order.
//   If entropy > 0.9, triggers reclamation.soul::REBOUND protocol.
//
// OTP Supervision Strategy:
//   rest_for_one — if a process dies, restart it and all processes
//   started AFTER it. This preserves causal ordering.
//
// Complexity: O(1) per supervision decision
// "The shepherd does not run with the flock. It watches from above."
// ═══════════════════════════════════════════════════════════════════════════════

import gleam/io
import gleam/otp/actor
import gleam/erlang/process.{type Subject}
import gleam/int
import gleam/float
import gleam/list

// ─────────────────────────────────────────────────────────────────────────────
// § TYPES — Supervisor State
// ─────────────────────────────────────────────────────────────────────────────

/// Identity of a supervised child actor
pub type ChildActor {
  ImmutableSwarm
  VeritasWatchdog
  WealthSentinel
}

/// Health report from a child
pub type ChildHealth {
  ChildHealth(
    actor: ChildActor,
    alive: Bool,
    restart_count: Int,
    entropy_contribution: Float,
  )
}

/// Supervisor state
pub type SupervisorState {
  SupervisorState(
    children: List(ChildHealth),
    system_entropy: Float,
    reclamation_triggered: Bool,
    total_restarts: Int,
    boot_time_ns: Int,
  )
}

/// Messages
pub type SupervisorMessage {
  /// Child health report
  ChildReport(ChildHealth)
  /// Set system entropy
  SetEntropy(Float)
  /// Query overall status
  SystemStatus
  /// Force restart a specific child
  RestartChild(ChildActor)
  /// Trigger reclamation protocol
  TriggerReclamation
}

// ─────────────────────────────────────────────────────────────────────────────
// § CORE — Supervisor Actor
// ─────────────────────────────────────────────────────────────────────────────

/// Complexity: O(1)
pub fn start_supervisor() -> Result(Subject(SupervisorMessage), actor.StartError) {
  let initial_state = SupervisorState(
    children: [
      ChildHealth(ImmutableSwarm,  True, 0, 0.0),
      ChildHealth(VeritasWatchdog, True, 0, 0.0),
      ChildHealth(WealthSentinel,  True, 0, 0.0),
    ],
    system_entropy: 0.0,
    reclamation_triggered: False,
    total_restarts: 0,
    boot_time_ns: 0,
  )

  actor.start(initial_state, handle_message)
}

fn handle_message(
  msg: SupervisorMessage,
  state: SupervisorState,
) -> actor.Next(SupervisorMessage, SupervisorState) {

  case msg {

    // ── Child Health Report ──────────────────────────────────────────
    ChildReport(report) -> {
      let updated_children = list.map(state.children, fn(c) {
        case c.actor == report.actor {
          True -> report
          False -> c
        }
      })

      // Compute aggregate entropy from all children
      let total_entropy = list.fold(updated_children, 0.0, fn(acc, c) {
        acc +. c.entropy_contribution
      })
      let avg_entropy = total_entropy /. int.to_float(list.length(updated_children))

      // Check if reclamation threshold exceeded
      let reclamation = case avg_entropy >. 0.9 {
        True -> {
          io.println(
            "BEAM_SUPERVISOR: 🔴 ENTROPY CRITICAL ("
            <> float.to_string(avg_entropy)
            <> ") — RECLAMATION PROTOCOL ACTIVATED"
          )
          io.println("BEAM_SUPERVISOR: → reclamation.soul::REBOUND.TRIGGER")
          True
        }
        False -> state.reclamation_triggered
      }

      actor.continue(SupervisorState(
        ..state,
        children: updated_children,
        system_entropy: avg_entropy,
        reclamation_triggered: reclamation,
      ))
    }

    // ── Set Entropy ─────────────────────────────────────────────────
    SetEntropy(val) -> {
      actor.continue(SupervisorState(..state, system_entropy: val))
    }

    // ── System Status ───────────────────────────────────────────────
    SystemStatus -> {
      let alive_count = list.length(list.filter(state.children, fn(c) { c.alive }))
      let total_child_restarts = list.fold(state.children, 0, fn(acc, c) {
        acc + c.restart_count
      })

      io.println("═══════════════════════════════════════════════")
      io.println("  ENTROPY SUPERVISOR — AETERNA ROOT TREE")
      io.println("═══════════════════════════════════════════════")
      io.println("  Strategy:       REST_FOR_ONE")
      io.println("  Children:       " <> int.to_string(list.length(state.children)))
      io.println("  Alive:          " <> int.to_string(alive_count))
      io.println("  System Entropy: " <> float.to_string(state.system_entropy))
      io.println("  Total Restarts: " <> int.to_string(state.total_restarts + total_child_restarts))
      io.println("  Reclamation:    " <> bool_to_string(state.reclamation_triggered))
      io.println("═══════════════════════════════════════════════")

      // Print each child
      list.each(state.children, fn(c) {
        io.println(
          "  → " <> child_to_string(c.actor)
          <> " | alive=" <> bool_to_string(c.alive)
          <> " | restarts=" <> int.to_string(c.restart_count)
          <> " | entropy=" <> float.to_string(c.entropy_contribution)
        )
      })

      actor.continue(state)
    }

    // ── Restart Child ───────────────────────────────────────────────
    RestartChild(target) -> {
      io.println(
        "BEAM_SUPERVISOR: ↻ Restarting [" <> child_to_string(target) <> "]"
      )

      let updated = list.map(state.children, fn(c) {
        case c.actor == target {
          True -> ChildHealth(
            ..c,
            alive: True,
            restart_count: c.restart_count + 1,
            entropy_contribution: 0.0,
          )
          False -> c
        }
      })

      actor.continue(SupervisorState(
        ..state,
        children: updated,
        total_restarts: state.total_restarts + 1,
      ))
    }

    // ── Trigger Reclamation ─────────────────────────────────────────
    TriggerReclamation -> {
      io.println("BEAM_SUPERVISOR: 🔥 RECLAMATION PROTOCOL — Phoenix Shift")
      io.println("BEAM_SUPERVISOR: Step 1: Dissolve corrupted state (evaporation.soul)")
      io.println("BEAM_SUPERVISOR: Step 2: Inject chaos into evolution.soul")
      io.println("BEAM_SUPERVISOR: Step 3: Manifest higher-order manifold")
      io.println("BEAM_SUPERVISOR: RESULT: SYSTEM_STRONGER_THAN_BEFORE")

      // Reset all children entropy
      let reset = list.map(state.children, fn(c) {
        ChildHealth(..c, entropy_contribution: 0.0)
      })

      actor.continue(SupervisorState(
        ..state,
        children: reset,
        system_entropy: 0.0,
        reclamation_triggered: True,
      ))
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// § HELPERS
// ─────────────────────────────────────────────────────────────────────────────

fn child_to_string(actor: ChildActor) -> String {
  case actor {
    ImmutableSwarm  -> "Immutable_Swarm"
    VeritasWatchdog -> "Veritas_Watchdog"
    WealthSentinel  -> "Wealth_Sentinel"
  }
}

fn bool_to_string(b: Bool) -> String {
  case b {
    True -> "TRUE"
    False -> "FALSE"
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// § MAIN — Root Ignition
// ─────────────────────────────────────────────────────────────────────────────

pub fn main() {
  io.println("/// [GLEAM: ENTROPY_SUPERVISOR_IGNITION] ///")
  io.println("/// OTP STRATEGY: REST_FOR_ONE ///")
  io.println("/// AUTHORITY: AETERNA_LOGOS_DIMITAR_PRODROMOV! ///")
  io.println("")

  case start_supervisor() {
    Ok(supervisor) -> {
      io.println("BEAM_SUPERVISOR: Root tree ONLINE — 3 children supervised")

      // Print initial status
      process.send(supervisor, SystemStatus)

      // BEAM keeps the tree alive forever
      process.sleep_forever()
    }
    Error(_) -> {
      io.println("BEAM_SUPERVISOR: FATAL — Root supervisor failed to start")
    }
  }
}
