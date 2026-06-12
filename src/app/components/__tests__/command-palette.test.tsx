import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ACTS } from "../../data/dossier";
import { ASSESSMENT_QUESTIONS } from "../../data/assessments";
import { useDossierStore } from "../../store";
import { CommandPalette } from "../command-palette";

describe("CommandPalette", () => {
  it("filters acts and navigates the selected result", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<CommandPalette isOpen onClose={vi.fn()} acts={ACTS} onNavigate={onNavigate} />);

    await user.type(screen.getByLabelText("Search dossier commands"), "two-front");
    expect(screen.getByText("The Two-Front War")).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(onNavigate).toHaveBeenCalledWith("two_front");
  });

  it("switches journey phase from the palette once requirements are met", async () => {
    const user = userEvent.setup();
    // Unlock OPERATE: requires 5 logged assessments on a first run.
    for (const question of ASSESSMENT_QUESTIONS.slice(0, 5)) {
      useDossierStore.getState().answerQuestion(question, question.options[0].id);
    }
    render(<CommandPalette isOpen onClose={vi.fn()} acts={ACTS} onNavigate={vi.fn()} />);

    await user.type(screen.getByLabelText("Search dossier commands"), "operate phase");
    await user.keyboard("{Enter}");

    expect(useDossierStore.getState().phase).toBe("OPERATE");
  });
});
