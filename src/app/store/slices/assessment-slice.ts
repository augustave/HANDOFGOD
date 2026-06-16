import type { StateCreator } from "zustand";
import type { AssessmentResponse } from "../../engine/signals";
import { ACTS } from "../../data/dossier";
import { deriveCache } from "../derive";
import { makeSignal } from "../signal";
import type { AssessmentSlice, StoreState } from "../types";

const ACT_CODE_BY_ID = new Map(ACTS.map((a) => [a.id, a.code]));

export const createAssessmentSlice: StateCreator<StoreState, [], [], AssessmentSlice> = (
  set,
) => ({
  responses: [],
  deferredQuestionIds: [],

  answerQuestion: (question, optionId) =>
    set((state) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return {};
      const response: AssessmentResponse = {
        id: question.id,
        question: question.prompt,
        answer: option.id,
        weight: option.weights,
        category: question.category,
        postureAffinity: option.postureAffinity,
        answeredAt: Date.now(),
      };
      // Idempotent per question id: re-answering replaces, never duplicates.
      const responses = [
        ...state.responses.filter((r) => r.id !== question.id),
        response,
      ];
      const deferredQuestionIds = state.deferredQuestionIds.filter(
        (id) => id !== question.id,
      );
      const code = ACT_CODE_BY_ID.get(question.afterActId) ?? "ASSESSMENT";
      return {
        responses,
        deferredQuestionIds,
        ...deriveCache({ ...state, responses }),
        lastSignal: makeSignal(`${code} // FIELD_ASSESSMENT`, option.weights),
      };
    }),

  deferQuestion: (questionId) =>
    set((state) => {
      if (
        state.deferredQuestionIds.includes(questionId) ||
        state.responses.some((r) => r.id === questionId)
      ) {
        return {};
      }
      return { deferredQuestionIds: [...state.deferredQuestionIds, questionId] };
    }),
});
