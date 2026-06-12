import { expect, test } from "@playwright/test";

const STORAGE_KEY = "hand_of_god:dossier:v1";

test("literacy journey: read, assess, operate, sealed mirror", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop project only");
  await page.emulateMedia({ reducedMotion: "reduce" }); // boot auto-hides
  await page.goto("/");

  // READ: jump to act 1 and dwell until the checkpoint activates (3s read timer).
  await page.getByRole("button", { name: /Navigate to AX-01/ }).click();
  const checkpoint = page.getByTestId("question-q-ax01-myth");
  await expect(checkpoint).toBeVisible({ timeout: 15000 });

  // ASSESS: answer the first field assessment.
  await checkpoint.scrollIntoViewIfNeeded();
  await checkpoint.getByRole("radio").nth(1).check();
  await checkpoint.getByRole("button", { name: /LOG_RESPONSE/ }).click();
  await expect(checkpoint.getByText("RESPONSE_ANALYSIS")).toBeVisible();

  // OPERATE: run the act-2 scenario.
  const scenario = page.getByTestId("scenario-scn-disclosure");
  await scenario.scrollIntoViewIfNeeded();
  await scenario.getByRole("button", { name: /^B / }).click();
  await page.getByTestId("commit-scn-disclosure").click();
  await expect(page.getByTestId("scenario-tradeoffs")).toBeVisible();

  // DEBRIEF: requirements not yet met — the mirror stays sealed.
  await page.getByRole("button", { name: /DEBRIEF/ }).first().click();
  await expect(page.getByTestId("mirror-locked")).toBeVisible();
});

test("seeded profile unlocks the after-action report", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "desktop project only");
  await page.emulateMedia({ reducedMotion: "reduce" });

  const seed = {
    version: 1,
    state: {
      phase: "READ",
      actsRead: [1, 2, 3, 4, 5],
      sessionId: "E2ESEED1",
      completedAt: null,
      responses: [
        { id: "q-ax01-myth", question: "seed", answer: "b", weight: { narrativeLiteracy: 3 }, category: "narrativeLiteracy", postureAffinity: { watcher: 2 }, answeredAt: 1 },
        { id: "q-ax01-belonging", question: "seed", answer: "c", weight: { narrativeLiteracy: 3 }, category: "narrativeLiteracy", postureAffinity: { sovereign: 1 }, answeredAt: 2 },
        { id: "q-ax02-press", question: "seed", answer: "b", weight: { capabilityOrientation: 3 }, category: "capabilityOrientation", postureAffinity: { sovereign: 2 }, answeredAt: 3 },
        { id: "q-ax02-suckers-payoff", question: "seed", answer: "c", weight: { strategicRealism: 2 }, category: "strategicRealism", postureAffinity: { architect: 2 }, answeredAt: 4 },
      ],
      deferredQuestionIds: [],
      scenarioCommits: [
        { scenarioId: "scn-disclosure", choiceId: "B", weights: { strategicRealism: 3 }, postureAffinity: { architect: 3 }, at: 5 },
      ],
      simulatorReports: [],
      committedPosture: "architect",
      callsign: "E2E_SEED",
      checkedItems: [],
      plainTextMode: false,
      isWoke: false,
      isAudioMode: false,
      isFocusMode: false,
      isFullRead: false,
      role: "ANALYST",
    },
  };
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [STORAGE_KEY, JSON.stringify(seed)] as const,
  );
  await page.goto("/");

  await page.getByRole("button", { name: /DEBRIEF/ }).first().click();
  const report = page.getByTestId("mirror-report");
  await expect(report).toBeVisible();
  await expect(report.getByTestId("composite-score")).not.toHaveText("0");
  await expect(report.getByTestId("posture-architect-pct")).not.toHaveText("0%");
  await expect(report.getByTestId("debrief-evidence")).toContainText("q-ax01-myth");

  // Persistence across reload: the report stays unlocked.
  await page.reload();
  await expect(page.getByTestId("mirror-report")).toBeVisible({ timeout: 10000 });
});
