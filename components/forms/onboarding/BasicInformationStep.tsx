"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the FormData type
interface FormData {
  age: number | null;
  gender: "male" | "female" | "unspecified" | null;
  priorExposure: boolean | null;
}

// Define the props for the component
type BasicInformationStepProps = {
  formData: FormData;
  updateData: (field: string, value: string | number | boolean | null) => void;
  onNext: () => void;
};

export function BasicInformationStep({
  formData,
  updateData,
  onNext
}: BasicInformationStepProps) {
  // State to track if the form is valid for submission
  const [isValid, setIsValid] = useState(false);

  // Check if all required fields are filled
  useEffect(() => {
    const valid =
      formData.age !== null &&
      formData.gender !== null &&
      formData.priorExposure !== null;

    setIsValid(valid);
  }, [formData]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">ข้อมูลพื้นฐาน</CardTitle>

        <CardDescription>
          กรุณากรอกข้อมูลพื้นฐานของคุณเพื่อช่วยเราประเมินความเหมาะสมในการฉีดวัคซีน
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Age Input */}
        <div className="space-y-4">
          <Label htmlFor="age">1. อายุ</Label>
          <Input
            id="age"
            type="number"
            placeholder="กรอกอายุของคุณ"
            value={formData.age || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              updateData('age', value);
            }}
            min={0}
            max={120}
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-4">
          <Label>2. เพศ</Label>
          <RadioGroup
            value={formData.gender || ''}
            onValueChange={(value) => updateData('gender', value as "male" | "female" | "unspecified")}
            className="flex flex-col space-y-2"
          >
            {['male', 'female', 'unspecified'].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender} id={`gender-${gender}`} />
                <Label htmlFor={`gender-${gender}`} className="capitalize">
                  {gender === 'male' ? 'ชาย' : gender === 'female' ? 'หญิง' : 'ไม่ระบุ'}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Prior Exposure */}
        <div className="space-y-4">
          <Label>3. มีคนใกล้ชิดของคุณเคยเป็นไข้เลือดออกหรือไม่?</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.priorExposure === true ? "default" : "outline"}
              onClick={() => updateData('priorExposure', true)}
              className="w-full"
            >
              ใช่
            </Button>
            <Button
              type="button"
              variant={formData.priorExposure === false ? "default" : "outline"}
              onClick={() => updateData('priorExposure', false)}
              className="w-full"
            >
              ไม่ใช่
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid}
        >
          ถัดไป
        </Button>
      </CardFooter>
    </Card>
  );
}