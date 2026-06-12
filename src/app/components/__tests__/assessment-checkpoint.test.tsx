import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssessmentCheckpoint } from "../assessment-checkpoint";
import { useDossierStore } from "../../store";
import { questionsForAct } from "../../data/assessments";

const ACT = { actId: "myth_of_morality", actCode: "AX-01", actIndex: 1 };

describe("AssessmentCheckpoint", () => {
  it("stays sealed until the act has been read", () => {
    render(<AssessmentCheckpoint {...ACT} />);
    expect(screen.getByText(/CHECKPOINT_SEALED/)).toBeInTheDocument();
  });

  it("activates after reading, logs a response, and reveals the insight", async () => {
    const user = userEvent.setup();
    useDossierStore.getState().markActRead(1);
    render(<AssessmentCheckpoint {...ACT} />);

    const question = questionsForAct(ACT.actId)[0];
    expect(screen.getByText(question.prompt)).toBeInTheDocument();

    const commit = screen.getAllByRole("button", { name: /LOG_RESPONSE/ })[0];
    expect(commit).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: question.options[1].label }));
    expect(commit).toBeEnabled();
    await user.click(commit);

    const state = useDossierStore.getState();
    expect(state.responses.some((r) => r.id === question.id)).toBe(true);
    expect(screen.getByText(question.options[1].insight)).toBeInTheDocument();
  });

  it("defer collapses the question and resume restores it", async () => {
    const user = userEvent.setup();
    useDossierStore.getState().markActRead(1);
    render(<AssessmentCheckpoint {...ACT} />);

    await user.click(screen.getAllByRole("button", { name: /DEFER/ })[0]);
    expect(useDossierStore.getState().deferredQuestionIds.length).toBeGreaterThan(0);
    expect(screen.getByText(/DEFERRED/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /RESUME/ }));
    expect(screen.queryByText(/DEFERRED/)).not.toBeInTheDocument();
  });

  it("renders nothing for acts without questions", () => {
    const { container } = render(
      <AssessmentCheckpoint actId="final" actCode="AX-07" actIndex={7} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
