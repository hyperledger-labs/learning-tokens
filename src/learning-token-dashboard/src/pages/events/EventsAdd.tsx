import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import ScoringGuide from "./ScoringGuide";
import CreateCourse from "./CreateCourse";
import DistributeToken from "./DistributeToken";
const EventsAdd = () => {
  const [step, setStep] = useState(1);
  const handleStep = (step: number) => setStep(step);
  return (
    <div>
      <div className="flex items-center justify-between w-[600px] mx-auto my-4">
        <div
          className={`rounded-lg p-2 bg-slate-100 ${
            step === 1 && "border-2"
          } cursor-pointer`}
          onClick={() => handleStep(1)}
        >
          Scoring Guide
        </div>
        <FaLongArrowAltRight />
        <div
          className={`rounded-lg p-2 bg-slate-100 ${
            step === 2 && "border-2"
          } cursor-pointer`}
          onClick={() => handleStep(2)}
        >
          Create Course
        </div>
        <FaLongArrowAltRight />
        <div
          className={`rounded-lg p-2 bg-slate-100 ${
            step === 3 && "border-2"
          } cursor-pointer`}
          onClick={() => handleStep(3)}
        >
          Distribute Token
        </div>
      </div>

      <div className="flex items-center justify-center">
        {step === 1 && (
          <div>
            <ScoringGuide />
          </div>
        )}
        {step === 2 && (
          <div>
            <CreateCourse />
          </div>
        )}
        {step === 3 && (
          <div>
            <DistributeToken />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsAdd;
