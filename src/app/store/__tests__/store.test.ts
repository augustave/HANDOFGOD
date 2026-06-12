import { beforeEach, describe, expect, it } from "vitest";
import { useDossierStore } from "../index";
import { STORAGE_KEY } from "../storage";
import { ASSESSMENT_QUESTIONS } from "../../data/assessments";
import { OPERATION_SCENARIOS } from "../../data/scenarios";
import { BASELINE, DIMENSIONS } from "../../engine/weights";

function resetStore(): void {
  localStorage.clear();
  useDossierStore.getState().resetSession();
}

describe("dossier store", () => {
  beforeEach(resetStore);

  it("starts at baseline profile and neutral posture", () => {
    const state = useDossierStore.getState();
    for (const dim of DIMENSIONS) expect(state.profile[dim]).toBe(BASELINE);
    expect(
      state.postureDistribution.watcher +
        state.postureDistribution.architect +
        state.postureDistribution.sovereign,
    ).toBe(100);
  });

  it("answerQuestion records a snapshot and recomputes the profile", () => {
    const question = ASSESSMENT_QUESTIONS[0];
    const option = question.options[1];
    useDossierStore.getState().answerQuestion(question, option.id);

    const state = useDossierStore.getState();
    expect(state.responses).toHaveLength(1);
    expect(state.responses[0].id).toBe(question.id);
    expect(state.responses[0].weight).toEqual(option.weights);
    // The chosen option weights narrativeLiteracy +3 → profile must move up.
    expect(state.profile.narrativeLiteracy).toBeGreaterThan(BASELINE);
  });

  it("re-answering the same question replaces, never duplicates", () => {
    const question = ASSESSMENT_QUESTIONS[0];
    useDossierStore.getState().answerQuestion(question, question.options[0].id);
    useDossierStore.getState().answerQuestion(question, question.options[2].id);
    const state = useDossierStore.getState();
    expect(state.responses).toHaveLength(1);
    expect(state.responses[0].answer).toBe(question.options[2].id);
  });

  it("chooseScenario commits with full weight, recommit at half weight", () => {
    const scenario = OPERATION_SCENARIOS[0];
    useDossierStore.getState().chooseScenario(scenario, "B");
    let commits = useDossierStore.getState().scenarioCommits;
    expect(commits).toHaveLength(1);
    expect(commits[0].weights).toEqual(scenario.choices[1].weights);

    useDossierStore.getState().chooseScenario(scenario, "A");
    commits = useDossierStore.getState().scenarioCommits;
    expect(commits).toHaveLength(1);
    const original = scenario.choices[0].weights;
    for (const [dim, weight] of Object.entries(commits[0].weights)) {
      expect(weight).toBe((original as Record<string, number>)[dim] / 2);
    }
  });

  it("caps capture simulator reports at 3", () => {
    const report = {
      simulatorId: "capture" as const,
      weights: { operationalThinking: 1, systemAwareness: 1 },
    };
    for (let i = 0; i < 5; i++) {
      useDossierStore.getState().recordSimulatorReport(report);
    }
    expect(
      useDossierStore.getState().simulatorReports.filter((r) => r.simulatorId === "capture"),
    ).toHaveLength(3);
  });

  it("commitPosture dominates the posture distribution", () => {
    useDossierStore.getState().commitPosture("sovereign", "NIGHTJAR");
    const state = useDossierStore.getState();
    expect(state.committedPosture).toBe("sovereign");
    expect(state.callsign).toBe("NIGHTJAR");
    expect(state.postureDistribution.sovereign).toBe(100);
  });

  it("markActRead is monotonic and idempotent", () => {
    useDossierStore.getState().markActRead(1);
    useDossierStore.getState().markActRead(1);
    useDossierStore.getState().markActRead(2);
    expect(useDossierStore.getState().actsRead).toEqual([1, 2]);
  });

  it("persists raw signals to localStorage but never the derived cache", () => {
    const question = ASSESSMENT_QUESTIONS[0];
    useDossierStore.getState().answerQuestion(question, question.options[0].id);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string) as { state: Record<string, unknown> };
    expect(parsed.state.responses).toBeDefined();
    expect(parsed.state.profile).toBeUndefined();
    expect(parsed.state.postureDistribution).toBeUndefined();
    expect(parsed.state.unlockedIds).toBeUndefined();
  });

  it("declassification gate opens when an act checkpoint is answered", () => {
    const ax1Question = ASSESSMENT_QUESTIONS.find((q) => q.afterActId === "myth_of_morality");
    expect(ax1Question).toBeDefined();
    expect(useDossierStore.getState().unlockedIds).not.toContain("declass-ax01");
    useDossierStore.getState().answerQuestion(ax1Question!, ax1Question!.options[0].id);
    expect(useDossierStore.getState().unlockedIds).toContain("declass-ax01");
  });

  it("resetSession clears signals and rotates the session id", () => {
    const before = useDossierStore.getState().sessionId;
    useDossierStore.getState().answerQuestion(ASSESSMENT_QUESTIONS[0], "a");
    useDossierStore.getState().resetSession();
    const state = useDossierStore.getState();
    expect(state.responses).toHaveLength(0);
    expect(state.sessionId).not.toBe(before);
    for (const dim of DIMENSIONS) expect(state.profile[dim]).toBe(BASELINE);
  });

  it("preference setters update and persist", () => {
    useDossierStore.getState().setRole("COMMANDER");
    useDossierStore.getState().setIsFullRead(true);
    const state = useDossierStore.getState();
    expect(state.role).toBe("COMMANDER");
    expect(state.isFullRead).toBe(true);
  });
});
