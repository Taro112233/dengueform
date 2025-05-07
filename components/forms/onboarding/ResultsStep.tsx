"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner"; // Import toast from sonner

// Define the props for the component
type ResultsStepProps = {
  formData: {
    age: number | null;
    gender: "male" | "female" | "unspecified" | null;
    priorExposure: boolean | null;
    conditions: string[];
  };
  onBack?: () => void;
  onComplete?: () => void;
};

// Condition labels lookup for displaying in results
const conditionLabels: Record<string, string> = {
  pregnant: "หญิงตั้งครรภ์",
  medicalStaff: "บุคลากรทางการแพทย์",
  chronicDisease: "โรคหัวใจ, โรคเบาหวาน, โรคปอดอุดกั้นเรื้อรัง",
  liverDisease: "โรคตับเรื้อรัง",
  kidneyDisease: "โรคไตเรื้อรัง",
  spleenDisorder: "บุคคลที่ไม่มีม้าม หรือม้ามทำงานบกพร่อง",
  hivLowCD4: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≤ 200 uL)",
  hivHighCD4: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≥ 200 uL)",
  immunodeficiency: "บุคคลที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง",
  transplant: "บุคคลที่ปลูกถ่ายอวัยวะหรือไขกระดูก",
  hajj: "ผู้ที่จะเดินทางไปประกอบพิธีฮัจย์ อุมเราะห์",
  none: "ไม่มีภาวะดังกล่าวข้างบน"
};

export function ResultsStep({
  formData,
  onBack,
  onComplete
}: ResultsStepProps) {
  // Helper function to determine recommendation based on form data
  const getRecommendation = () => {
    const { age, priorExposure, conditions } = formData;

    // Check critical conditions first
    if (conditions.includes("pregnant")) {
      return {
        vaccine: "ไม่แนะนำให้ฉีดวัคซีนเด็งกี่",
        reason: "วัคซีนเด็งกี่ไม่แนะนำสำหรับหญิงตั้งครรภ์ เนื่องจากข้อมูลด้านความปลอดภัยยังมีจำกัด",
        alertType: "destructive" as const
      };
    }

    if (conditions.includes("immunodeficiency") || 
        conditions.includes("hivLowCD4") || 
        conditions.includes("transplant")) {
      return {
        vaccine: "ไม่แนะนำให้ฉีดวัคซีนเด็งกี่",
        reason: "ผู้ที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง ผู้ที่มีระดับ CD4+ ต่ำ หรือผู้ที่ได้รับการปลูกถ่ายอวัยวะ มีความเสี่ยงสูงต่อการติดเชื้อและอาจไม่ตอบสนองต่อวัคซีนอย่างเพียงพอ",
        alertType: "destructive" as const
      };
    }

    // Age-based recommendations
    if (age !== null) {
      if (age < 4) {
        return {
          vaccine: "ไม่แนะนำให้ฉีดวัคซีนเด็งกี่",
          reason: "วัคซีนเด็งกี่ไม่ได้รับการอนุมัติสำหรับเด็กอายุต่ำกว่า 4 ปี",
          alertType: "destructive" as const
        };
      }
    }

    // Default case
    return {
      vaccine: "แนะนำให้ฉีดวัคซีนเด็งกี่",
      reason: "วัคซีนมีประสิทธิภาพในการลดความรุนแรงของการติดเชื้อครั้งแรกและการติดเชื้อซ้ำ",
      alertType: "success" as const
    };
  };

  const recommendation = getRecommendation();

  // Handle completion and show toast
  const handleComplete = () => {
    toast.success("ขอบคุณที่ทำแบบประเมิน", {
      duration: 3000,
      position: "bottom-right"
    });

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold">ผลการประเมิน</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recommendation */}
        <Alert variant={recommendation.alertType}>
          <AlertTitle className="text-lg font-bold">{recommendation.vaccine}</AlertTitle>
          <AlertDescription>{recommendation.reason}</AlertDescription>
        </Alert>

        <Separator />

        {/* Summary of user information */}
        <div>
          <h3 className="mb-2 font-bold text-lg">ข้อมูลของท่าน</h3>

          <div className="space-y-2">
            <p><span className="font-bold">อายุ :</span>{" "}
              <span className="text-blue-800">{formData.age} ปี</span>
            </p>

            <p>
              <span className="font-bold">เพศ :</span>{" "}
              <span className="text-blue-800">
                {formData.gender === "male" ? "ชาย" :
                  formData.gender === "female" ? "หญิง" : "ไม่ระบุ"}
              </span>
            </p>

            <div>
              <span className="font-bold">โรคประจำตัว :</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.conditions.length > 0 ? (
                  formData.conditions.map(condition => (
                    <Badge key={condition} variant="secondary">
                      {conditionLabels[condition]}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">ไม่ได้ระบุ</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-blue-900">
          <p className="text-sm">
            <strong>คำเตือน:</strong> ข้อมูลนี้ใช้เพื่อเป็นแนวทางเบื้องต้นเท่านั้น
            โปรดปรึกษาแพทย์หรือบุคลากรทางการแพทย์เพื่อรับคำแนะนำที่เหมาะสมกับสถานการณ์ของท่าน
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline">
            ย้อนกลับ
          </Button>
        )}
        <Link href="/">
          <Button
            onClick={handleComplete}
          >
            เสร็จสิ้น
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}