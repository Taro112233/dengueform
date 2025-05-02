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

// Define the conditions type
type Condition = {
  id: string;
  label: string;
};

// List of medical conditions
const conditions: Condition[] = [
  { id: "pregnant", label: "หญิงตั้งครรภ์" },
  { id: "medicalStaff", label: "บุคลากรทางการแพทย์" },
  { id: "chronicDisease", label: "โรคหัวใจ, โรคเบาหวาน, โรคปอดอุดกั้นเรื้อรัง" },
  { id: "liverDisease", label: "โรคตับเรื้อรัง" },
  { id: "kidneyDisease", label: "โรคไตเรื้อรัง" },
  { id: "spleenDisorder", label: "บุคคลที่ไม่มีม้าม หรือม้ามทำงานบกพร่อง" },
  { id: "hivLowCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≤ 200 uL)" },
  { id: "hivHighCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≥ 200 uL)" },
  { id: "immunodeficiency", label: "บุคคลที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง" },
  { id: "transplant", label: "บุคคลที่ปลูกถ่ายอวัยวะหรือไขกระดูก" },
  { id: "none", label: "ไม่มีภาวะดังกล่าวข้างบน" },
];

// Define the form data interface
interface FormData {
  // Add your medical conditions form fields here
  conditions: string[];
  // ... other fields
}

// Define the props for the component
type MedicalConditionsStepProps = {
  formData: FormData;
  updateData: (field: string, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
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

  // Toggle a condition selection
  const toggleCondition = (id: string) => {
    // If selecting "none", clear all other selections
    if (id === "none") {
      if (!selectedConditions.includes("none")) {
        setSelectedConditions(["none"]);
        updateData("conditions", ["none"]);
      }
      return;
    }

    // If selecting any other condition, remove "none" if it's selected
    let updatedConditions = [...selectedConditions];

    if (updatedConditions.includes("none")) {
      updatedConditions = updatedConditions.filter(c => c !== "none");
    }

    // Toggle the selected condition
    if (updatedConditions.includes(id)) {
      updatedConditions = updatedConditions.filter(c => c !== id);
    } else {
      updatedConditions.push(id);
    }

    setSelectedConditions(updatedConditions);
    updateData("conditions", updatedConditions);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ภาวะทางการแพทย์</CardTitle>
        <CardDescription className="text-lg font-medium">
          กรุณาเลือกในช่องที่ตรงกับสภาวะหรือโรคของท่านในปัจจุบัน
        </CardDescription>
        <Badge variant="secondary" className="w-fit mt-1">
          ท่านสามารถเลือกได้มากกว่า 1 ข้อ
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {conditions.map((condition) => (
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
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedConditions.length === 0}
        >
          ตรวจสอบ
        </Button>
      </CardFooter>
    </Card>
  );
}