import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScenarioPlayer } from "../scenario-player";
import { OPERATION_SCENARIOS } from "../../data/scenarios";
import { useDossierStore } from "../../store";

const scenario = OPERATION_SCENARIOS[0];

describe("ScenarioPlayer", () => {
  it("commits a choice, reveals tradeoffs, and logs the signal", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} />);

    expect(screen.getByText(scenario.situation)).toBeInTheDocument();

    const commitButton = screen.getByTestId(`commit-${scenario.id}`);
    expect(commitButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: new RegExp(scenario.choices[1].label.slice(0, 20)) }));
    expect(commitButton).toBeEnabled();
    await user.click(commitButton);

    expect(screen.getByTestId("scenario-tradeoffs")).toBeInTheDocument();
    expect(screen.getByText(scenario.choices[1].gained)).toBeInTheDocument();
    expect(screen.getByText(scenario.choices[1].secondOrder)).toBeInTheDocument();

    const commits = useDossierStore.getState().scenarioCommits;
    expect(commits).toHaveLength(1);
    expect(commits[0].scenarioId).toBe(scenario.id);
    expect(commits[0].choiceId).toBe("B");
  });

  it("allows one reconsider which re-opens the decision", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} />);

    await user.click(screen.getByRole("button", { name: new RegExp(scenario.choices[0].label.slice(0, 20)) }));
    await user.click(screen.getByTestId(`commit-${scenario.id}`));

    await user.click(screen.getByRole("button", { name: /RECONSIDER/ }));
    expect(screen.getByTestId(`commit-${scenario.id}`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: new RegExp(scenario.choices[2].label.slice(0, 20)) }));
    await user.click(screen.getByTestId(`commit-${scenario.id}`));

    // Recommit replaced the original and the reconsider affordance is gone.
    expect(useDossierStore.getState().scenarioCommits).toHaveLength(1);
    expect(useDossierStore.getState().scenarioCommits[0].choiceId).toBe("C");
    expect(screen.queryByRole("button", { name: /RECONSIDER/ })).not.toBeInTheDocument();
  });
});
