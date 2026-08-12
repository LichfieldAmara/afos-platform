export const requestTransitions = {
  draft: ["submitted", "cancelled"],
  submitted: ["matching", "cancelled"],
  matching: ["partially_matched", "matched", "unfulfilled", "cancelled"],
  partially_matched: ["matched", "allocated", "unfulfilled", "cancelled"],
  matched: ["allocated", "unfulfilled", "cancelled"],
  allocated: ["in_progress", "partially_completed", "failed", "cancelled"],
  in_progress: ["completed", "partially_completed", "failed"],
  completed: [], partially_completed: [], unfulfilled: [], failed: [], cancelled: [],
} as const;

export const offerTransitions = {
  draft: ["sent", "withdrawn"], sent: ["accepted", "rejected", "expired", "withdrawn"],
  accepted: ["withdrawn"], rejected: [], expired: [], withdrawn: [],
} as const;

export const tripTransitions = {
  assigned: ["acknowledged", "cancelled"],
  acknowledged: ["ready", "cancelled"],
  ready: ["dispatched", "cancelled"],
  dispatched: ["at_pickup", "failed"],
  at_pickup: ["in_transit", "failed"],
  in_transit: ["at_destination", "failed"],
  at_destination: ["delivered", "failed"],
  delivered: ["completed", "failed"],
  completed: [], failed: [], cancelled: [],
} as const;

type StateGraph = Record<string, readonly string[]>;

export function canTransition(graph: StateGraph, from: string, to: string) {
  return graph[from]?.includes(to) ?? false;
}

