import "../../App.css";
import { useState } from "react";
import { SampleModal } from "../Modals/SampleModal";

type NavbarProps = {
  activeStep: string;
  setActiveStep: React.Dispatch<React.SetStateAction<string>>;
};

export function Navbar({ activeStep, setActiveStep }: NavbarProps) {
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const handleStepClick = (id: string) => {
    setActiveStep(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <img
          src="assets/header_logo.svg"
          alt="BeMade"
          className="navbar-logo"
        />

        <div className="navbar-steps">
          <span className={activeStep === "baseSelector" ? "active" : ""}
            onClick={() => handleStepClick("baseSelector")}
          >
            BASE
          </span>

          <span className={activeStep === "colorSelector" ? "active" : ""}
            onClick={() => handleStepClick("colorSelector")}
          >
            BASE COLOUR
          </span>

          <span className={activeStep === "topColorSelector" ? "active" : ""}
            onClick={() => handleStepClick("topColorSelector")}
          >
            TOP COLOUR
          </span>

          <span className={activeStep === "topShapeSelector" ? "active" : ""}
            onClick={() => handleStepClick("topShapeSelector")}
          >
            TOP SHAPE
          </span>

          <span className={activeStep === "dimensionControls" ? "active" : ""}
            onClick={() => handleStepClick("dimensionControls")}
          >
            DIMENSION
          </span>

          <span className={activeStep === "charirSelector" ? "active" : ""}
            onClick={() => handleStepClick("charirSelector")}
          >
            CHAIR
          </span>

          <span className={activeStep === "summary" ? "active" : ""}
            onClick={() => handleStepClick("summary")}
          >
            SUMMARY
          </span>
        </div>

        <button
          className="navbar-btn"
          onClick={() => setIsSampleModalOpen(true)}
        >
          Order Sample
        </button>
      </nav>

      <SampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />
    </>
  );
}
