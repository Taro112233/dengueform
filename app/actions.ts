"use server";

import { prisma } from "@/lib/db";

type AssessmentData = {
  name: string;
  age: number | null;
  gender: string | null;
  priorExposure: boolean | null;
  conditions: string[];
  recommendation: string;
  reason: string;
};

export async function saveAssessment(data: AssessmentData) {
  try {
    // Validate required fields
    if (!data.name || data.age === null || data.gender === null || data.priorExposure === null) {
      return {
        success: false,
        error: "Missing required fields"
      };
    }

    // Create assessment record in database
    const assessment = await prisma.assessment.create({
      data: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        priorExposure: data.priorExposure,
        conditions: data.conditions,
        recommendation: data.recommendation,
        reason: data.reason
      },
    });

    return {
      success: true,
      id: assessment.id
    };
  } catch (error) {
    console.error("Error saving assessment:", error);
    return {
      success: false,
      error: "Failed to save assessment"
    };
  }
}