import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { OPENAI_API_KEY } from "./apiKey";

const DiagnosisSchema = z.object({
  diagnosis_phase: z.object({
    is_final: z.boolean(),
    progress: z.enum(["diagnostic_in_progress", "final_diagnosis"]),
    current_step: z.string(),
  }),
  follow_up_questions: z.array(
    z.object({
      question: z.string(),
      expected_answer_type: z.enum(["yes_no", "multiple_choice"]),
      answers: z.array(z.string()),
    })
  ),
  potential_diagnosis: z.string().nullable(),
  confidence: z.number().refine((value) => value >= 0 && value <= 1, {
    message: "Confidence score must be between 0 and 1",
  }),
  recommendations: z.object({
    treatments: z
      .array(
        z.object({
          description: z.string(),
        })
      )
      .nullable(),
    medications: z
      .array(
        z.object({
          name: z.string(),
          dosage: z.string(),
          duration: z.string(),
          notes: z.string().optional(),
        })
      )
      .nullable(),
    supplements: z
      .array(
        z.object({
          name: z.string(),
          dosage: z.string(),
          notes: z.string().optional(),
        })
      )
      .nullable(),
    lifestyle_changes: z.array(z.string()).nullable(),
  }),
  vet_visit_recommendation: z
    .object({
      recommended: z.boolean(),
      urgency: z.enum(["immediate", "soon", "not_urgent"]),
      notes: z.string().optional(),
    })
    .nullable(),
  educational_information: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .nullable(),
  emergency: z.boolean().optional(),
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateStructuredOutput(history) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: history,
      response_format: zodResponseFormat(DiagnosisSchema, "diagnosis"),
    });
    const result = completion.choices[0].message.parsed;

    if (!result || typeof result !== "object") {
      console.error("Unexpected result format:", result);
      throw new Error("Invalid response format from OpenAI.");
    }
    return result;
  } catch (error) {
    console.error("Error in generateStructuredOutput:", error);
    throw error;
  }

  // console.log(JSON.stringify(result, null, 2));
}
