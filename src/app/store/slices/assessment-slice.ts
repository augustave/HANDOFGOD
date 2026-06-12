import type { StateCreator } from "zustand";
import type { AssessmentResponse } from "../../engine/signals";
import { deriveCache } from "../derive";
import type { AssessmentSlice, StoreState } from "../types";

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
      return {
        responses,
        deferredQuestionIds,
        ...deriveCache({ ...state, responses }),
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
