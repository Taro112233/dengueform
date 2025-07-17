"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { saveAssessment } from "@/app/actions";

// Define the conditions type
type Condition = {
  id: string;
  label: string;
};

// Define separate condition groups
const medicalConditions: Condition[] = [
  { id: "pregnant", label: "หญิงตั้งครรภ์" },
  { id: "chronicDisease", label: "โรคหัวใจ, โรคเบาหวาน, โรคปอดอุดกั้นเรื้อรัง" },
  { id: "liverDisease", label: "โรคตับเรื้อรัง" },
  { id: "kidneyDisease", label: "โรคไตเรื้อรัง" },
  { id: "spleenDisorder", label: "บุคคลที่ไม่มีม้าม หรือม้ามทำงานบกพร่อง" },
  { id: "hivLowCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≤ 200 uL)" },
  { id: "hivHighCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≥ 200 uL)" },
  { id: "immunodeficiency", label: "บุคคลที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง" },
  { id: "transplant", label: "บุคคลที่ปลูกถ่ายอวัยวะหรือไขกระดูก" },
];

const staffCondition: Condition = { id: "medicalStaff", label: "บุคลากรทางการแพทย์" };
const noneCondition: Condition = { id: "none", label: "ไม่มีภาวะดังกล่าวข้างบน" };

// Define the form data interface
interface FormData {
  age: number | null;
  gender: "male" | "female" | "unspecified" | null;
  priorExposure: boolean | null;
  conditions: string[];
}

// Define the props for the component
type MedicalConditionsStepProps = {
  formData: FormData;
  updateData: (field: string, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

// Helper function to determine recommendation based on form data
const getRecommendation = (formData: FormData) => {
  const { age, conditions } = formData;

  // Check critical conditions first
  if (conditions.includes("pregnant")) {
    return {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "วัคซีน Qdenga ไม่แนะนำสำหรับหญิงตั้งครรภ์ เนื่องจากข้อมูลด้านความปลอดภัยยังมีจำกัด",
    };
  }

  if (conditions.includes("immunodeficiency") || 
      conditions.includes("hivLowCD4") || 
      conditions.includes("transplant")) {
    return {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "ผู้ที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง ผู้ที่มีระดับ CD4+ ต่ำ หรือผู้ที่ได้รับการปลูกถ่ายอวัยวะ มีความเสี่ยงสูงต่อการติดเชื้อและอาจไม่ตอบสนองต่อวัคซีนอย่างเพียงพอ",
    };
  }

  // Age-based recommendations
  if (age !== null) {
    if (age < 4) {
      return {
        vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
        reason: "วัคซีน Qdenga ไม่ได้รับการอนุมัติสำหรับเด็กอายุต่ำกว่า 4 ปี",
      };
    }
  }

  // Default case
  return {
    vaccine: "แนะนำให้ฉีดวัคซีน Qdenga ",
    reason: "วัคซีนมีประสิทธิภาพในการลดความรุนแรงของการติดเชื้อครั้งแรกและการติดเชื้อซ้ำ",
  };
};

export function MedicalConditionsStep({
  formData,
  updateData,
  onNext,
  onBack
}: MedicalConditionsStepProps) {
  // Local state to track selections
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    formData.conditions || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle a condition selection
  const toggleCondition = (id: string) => {
    let updatedConditions = [...selectedConditions];

    if (id === "none") {
      if (!updatedConditions.includes("none")) {
        // If selecting "none", clear all other selections except medicalStaff
        updatedConditions = updatedConditions.filter(c => c === "medicalStaff");
        updatedConditions.push("none");
      } else {
        // If unselecting "none", just remove it
        updatedConditions = updatedConditions.filter(c => c !== "none");
      }
    } else if (id === "medicalStaff") {
      // Medical staff can be toggled freely
      if (updatedConditions.includes(id)) {
        updatedConditions = updatedConditions.filter(c => c !== id);
      } else {
        updatedConditions.push(id);
      }
    } else {
      // For medical conditions
      // Remove "none" if it exists
      updatedConditions = updatedConditions.filter(c => c !== "none");
      
      // Toggle the selected condition
      if (updatedConditions.includes(id)) {
        updatedConditions = updatedConditions.filter(c => c !== id);
      } else {
        updatedConditions.push(id);
      }
    }

    setSelectedConditions(updatedConditions);
    updateData("conditions", updatedConditions);
  };

  // Handle check action with data saving
  const handleCheck = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the recommendation for this data
      const recommendation = getRecommendation({
        ...formData,
        conditions: selectedConditions
      });
      
      // Save assessment data to database
      const result = await saveAssessment({
        ...formData,
        conditions: selectedConditions,
        recommendation: recommendation.vaccine,
        reason: recommendation.reason
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Move to next step
      onNext();
    } catch (error) {
      console.error("Error saving assessment:", error);
      // You could add toast error notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold">สภาวะหรือโรคประจำตัว</CardTitle>
        <CardDescription className="font-medium">
          กรุณาเลือกในช่องที่ตรงกับสภาวะหรือโรคของท่านในปัจจุบัน
        </CardDescription>
        <Badge variant="secondary" className="w-fit mt-1">
          สามารถเลือกได้มากกว่า 1 ข้อ
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            {medicalConditions.map((condition) => (
              <div key={condition.id} className="flex items-start space-x-3">
                <Checkbox
                  id={condition.id}
                  checked={selectedConditions.includes(condition.id)}
                  onCheckedChange={() => toggleCondition(condition.id)}
                />
                <Label 
                  htmlFor={condition.id} 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id={noneCondition.id}
                checked={selectedConditions.includes(noneCondition.id)}
                onCheckedChange={() => toggleCondition(noneCondition.id)}
              />
              <Label 
                htmlFor={noneCondition.id} 
                className="text-sm leading-none text-red-800"
              >
                {noneCondition.label}
              </Label>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id={staffCondition.id}
                checked={selectedConditions.includes(staffCondition.id)}
                onCheckedChange={() => toggleCondition(staffCondition.id)}
              />
              <Label 
                htmlFor={staffCondition.id} 
                className="text-sm leading-none text-blue-800"
              >
                {staffCondition.label}
              </Label>
            </div>
          </div>

        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={handleCheck}
          disabled={selectedConditions.length === 0 || isSubmitting}
        >
          {isSubmitting ? "กำลังประมวลผล..." : "ตรวจสอบ"}
        </Button>
      </CardFooter>
    </Card>
  );
}