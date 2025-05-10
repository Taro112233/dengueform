"use server";

import { prisma } from "@/lib/db";

interface AssessmentData {
  age: number | null;
  gender: string | null;
  priorExposure: boolean | null;
  conditions: string[];
  recommendation: string;
  reason: string;
}

export async function saveAssessment(data: AssessmentData) {
  try {
    // Basic validation
    if (!data.age || !data.gender || data.priorExposure === null) {
      return { success: false, error: "ข้อมูลไม่ครบถ้วน" };
    }

    // Save to database
    await prisma.assessment.create({
      data: {
        age: data.age,
        gender: data.gender,
        priorExposure: data.priorExposure,
        conditions: data.conditions,
        recommendation: data.recommendation,
        reason: data.reason
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}