import type { Posture, Profile, PostureDistribution } from "../engine/weights";
import type {
  AssessmentResponse,
  ScenarioChoiceId,
  SignalEvent,
  SimulatorReport,
} from "../engine/signals";
import type { AssessmentQuestion, OperationScenario } from "../engine/content-types";
import type { SecurityRole } from "../types";

export type JourneyPhase = "READ" | "ASSESS" | "OPERATE" | "DEBRIEF";

/** Snapshot of a committed scenario choice (content edits can't corrupt history). */
export interface ScenarioCommit {
  scenarioId: string;
  choiceId: ScenarioChoiceId;
  weights: SimulatorReport["weights"];
  postureAffinity: NonNullable<SimulatorReport["postureAffinity"]>;
  at: number;
}

export interface JourneySlice {
  phase: JourneyPhase;
  /** Essay act indices read (monotonic). */
  actsRead: readonly number[];
  sessionId: string;
  /** Set when DEBRIEF is first reached; unlocks free phase navigation. */
  completedAt: number | null;
  markActRead(idx: number): void;
  markAllActsRead(): void;
  requestPhase(phase: JourneyPhase): boolean;
  resetSession(): void;
}

export interface AssessmentSlice {
  responses: readonly AssessmentResponse[];
  /** Question ids explicitly deferred (skippable ASSESS). */
  deferredQuestionIds: readonly string[];
  answerQuestion(question: AssessmentQuestion, optionId: string): void;
  deferQuestion(questionId: string): void;
}

export interface OperationsSlice {
  scenarioCommits: readonly ScenarioCommit[];
  simulatorReports: readonly SimulatorReport[];
  committedPosture: Posture | null;
  callsign: string | null;
  /** Checklist item ids checked (interface-checklist persistence). */
  checkedItems: readonly string[];
  /** "kind:id" of opened evidence/exhibit/node — append-only, feeds passive signals. */
  exploredIds: readonly string[];
  chooseScenario(scenario: OperationScenario, choiceId: ScenarioChoiceId): void;
  recordSimulatorReport(report: Omit<SimulatorReport, "at">): void;
  commitPosture(posture: Posture, callsign: string): void;
  toggleChecklistItem(id: string): void;
  markExplored(kind: "evidence" | "exhibit" | "node", id: string): void;
}

export interface PreferencesSlice {
  plainTextMode: boolean;
  isWoke: boolean;
  isAudioMode: boolean;
  isFocusMode: boolean;
  isFullRead: boolean;
  role: SecurityRole;
  setPlainTextMode(v: boolean): void;
  setIsWoke(v: boolean): void;
  setIsAudioMode(v: boolean): void;
  setIsFocusMode(v: boolean): void;
  setIsFullRead(v: boolean): void;
  setRole(role: SecurityRole): void;
}

/** Recomputed from raw signals after every mutation + on rehydrate. Never persisted. */
export interface DerivedCache {
  profile: Profile;
  postureDistribution: PostureDistribution;
  unlockedIds: readonly string[];
}

export type StoreState = JourneySlice &
  AssessmentSlice &
  OperationsSlice &
  PreferencesSlice &
  DerivedCache & {
    /** Most recent profile mutation; drives the live signal toast. Transient. */
    lastSignal: SignalEvent | null;
  };
