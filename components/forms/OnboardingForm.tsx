"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Progress } from "@/components/ui/progress";
import { BasicInformationStep } from "./onboarding/BasicInformationStep";
import { MedicalConditionsStep } from "./onboarding/MedicalConditionsStep";
import { ResultsStep } from "./onboarding/ResultsStep";
import { toast } from "sonner";

// Define the form data type
export interface FormData {
  age: number | null;
  gender: "male" | "female" | "unspecified" | null;
  priorExposure: boolean | null;
  conditions: string[];
}

export type FormDataValue = string | number | boolean | null | string[];

export function OnboardingForm() {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    age: null,
    gender: null,
    priorExposure: null,
    conditions: []
  });

  // Update form data
  const updateFormData = (field: string, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-6 space-y-4">
        <Image src={Logo} alt="Takeda logo" height={50} />
        <h1 className="text-xl sm:text-2xl font-bold text-center px-2">
          แบบประเมินความเหมาะสมในการฉีดวัคซีนป้องกัน<br/>
          <span className="text-primary">โรคไข้เลือกออก</span>
        </h1>
      </div>

      {/* Progress indicator */}
      <div className="max-w-md mx-auto mb-8 px-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Form Steps */}
      <div className="w-full">
        {currentStep === 1 && (
          <BasicInformationStep
            formData={formData}
            updateData={updateFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <MedicalConditionsStep
            formData={formData}
            updateData={updateFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ResultsStep
            formData={formData}
          />
        )}
      </div>
    </div>
  );
}