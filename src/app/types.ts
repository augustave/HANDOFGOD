export type SecurityRole = "ANALYST" | "OPERATOR" | "COMMANDER";

export type ActContentKey =
  | "hero"
  | "myth_of_morality"
  | "authentic_narrative"
  | "two_front"
  | "sovereign"
  | "operational_interfaces"
  | "education"
  | "final";

export interface SystemCardState {
  asset: string;
  surface: string;
  failure: string;
  controls: string;
  metric: string;
}

export interface DossierAct {
  id: string;
  title: string;
  code: string;
  contentKey: ActContentKey;
  briefing?: string;
  systemState: SystemCardState;
}
