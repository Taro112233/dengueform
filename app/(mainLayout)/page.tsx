"use client";
//push 3
import Image from 'next/image';
import Logo from '@/public/logo.png';
import Vaccine from '@/public/vaccine.png';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const handleNextSuggestion = () => {
    document.getElementById('index')!.style.display = 'none';
    document.getElementById('suggestion')!.style.display = 'block';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div id="index">
          <div>
            <div className="w-full max-w-md mx-auto">
              <Image
                src={Logo}
                alt="Logo"
                width={180}
                height={54}
                className="mx-auto"
              />
            </div>
          </div>

          <div className="text-center font-bold text-xl md:text-2xl mb-8">
            แบบประเมินความเหมาะสมในการรับวัคซีนไข้เลือดออกเด็งกี่<br />
            Dengue Vaccine Assessment Form
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="text-center">
                  <div className="mb-2">
                    <Image
                      src={Vaccine}
                      alt="vaccine"
                      width={180}
                      height={180}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">
                  คำแนะนำการให้วัคซีนป้องกันโรคไข้เลือดออก<br />
                  บริษัท ทาเคดา (ประเทศไทย) จำกัด
                </div>

                <div className="text-sm mb-6">
                  ที่อยู่: 57 อาคารปาร์คเวนเชอร์ อีโคเพล็กซ์ ชั้น 15<br />
                  ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน<br />
                  กรุงเทพฯ 10330 ประเทศไทย<br />
                  โทรศัพท์: 0-2697-9300
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="button"
                className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white py-3 px-8 rounded-lg text-lg transition-colors"
                onClick={handleNextSuggestion}
              >
                เข้าสู่แบบประเมิน
              </Button>
            </div>
          </div>
        </div>

        <div id="suggestion" style={{ display: 'none' }}>
          <div className="text-center font-bold text-2xl mb-4">คำชี้แจง</div>
          <div className="text-lg mb-6 leading-relaxed">
            แบบประเมินนี้จัดทำขึ้นเพื่อช่วยประเมินความเหมาะสมในการรับวัคซีนไข้เลือดออกเด็งกี่
            โดยคำแนะนำนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อพิจารณาความเหมาะสมในการรับวัคซีน
            ท่านจำเป็นต้องปรึกษาและรับคำแนะนำจากแพทย์ผู้ดูแลท่านก่อนรับวัคซีนทุกครั้ง
          </div>
          <div className="text-sm mb-8 italic">
            (อ้างอิง: บริษัท ทาเคดา (ประเทศไทย) จำกัด
            ข้อมูลวัคซีนป้องกันไข้เลือดออกเด็งกี่ พ.ศ. 2567)
          </div>
          <div className="flex justify-center">
            <Link href="/onboarding" className="flex items-center gap-2">
              <Button
                type="button"
                className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white py-3 px-8 rounded-lg text-lg transition-colors"
              >
                เริ่มทำแบบประเมิน
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}