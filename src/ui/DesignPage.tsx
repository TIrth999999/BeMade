import { CanvasRoot } from "../canvas/CanvasRoot";
import { RightPanel } from "./RightPanel";
import { Navbar } from "./Navbars/Navbar";
import { Footer } from "./Footer/Footer";
import { TopColorInfoCard } from "./Others/TopColorInfoCard";
import { LoadingOverlay } from "./Others/LoadingOverlay";
import { ShareModal } from "./Modals/ShareModal";
import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { CarouselDots } from "./Others/CarouselDots";
import { useState } from "react";

export const DesignPage = observer(() => {
    const rootStore = useStore();
    const { cameraPositionStore, chairStore, uiStore } = rootStore;

    const chairCount = chairStore.count;
    const allCameraPositions = cameraPositionStore.cameraPositions;
    const cameraPositions = chairCount === 0 ? allCameraPositions.slice(0, 4) : allCameraPositions;
    // console.log("Using camera positions:", cameraPositions.map(c => c.name));
    const selectedIdx = cameraPositions.findIndex(
        (c) => c.name === cameraPositionStore.selectedCameraPositionName
    );

    const handleSelect = (idx: number) => {
        const pos = cameraPositions[idx];
        console.log("Selected camera position:", pos);
        if (pos) cameraPositionStore.setCameraPosition(pos.name);
    };

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

    const [activeStep, setActiveStep] = useState("baseSelector");

    return (
        <>

            <Navbar activeStep={activeStep} setActiveStep={setActiveStep} />
            <div className={`app ${uiStore.isFullscreen ? "app-fullscreen" : ""}`}>
                <div className={`canvas-wrapper ${uiStore.isFullscreen ? "fullscreen-mode" : ""}`}>
                    <img className="canvas-bg" src="./assets/background/background.svg" alt="Canvas Background" />
                    <LoadingOverlay />
                    <div className="canvas-icons">
                        <div className="canvas-icon" onClick={() => rootStore.saveToLocal()}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"></path>
                            </svg>
                        </div>
                        <div className="canvas-icon" onClick={() => uiStore.setShareModalOpen(true)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" strokeWidth="2" d="M18,8 C19.6568542,8 21,6.65685425 21,5 C21,3.34314575 19.6568542,2 18,2 C16.3431458,2 15,3.34314575 15,5 C15,6.65685425 16.3431458,8 18,8 Z M6,15 C7.65685425,15 9,13.6568542 9,12 C9,10.3431458 7.65685425,9 6,9 C4.34314575,9 3,10.3431458 3,12 C3,13.6568542 4.34314575,15 6,15 Z M18,22 C19.6568542,22 21,20.6568542 21,19 C21,17.3431458 19.6568542,16 18,16 C16.3431458,16 15,17.3431458 15,19 C15,20.6568542 16.3431458,22 18,22 Z M16,18 L8,13 M16,6 L8,11"></path>
                            </svg>
                        </div>
                        <div className="canvas-icon" onClick={() => uiStore.toggleFullscreen()}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"></path>
                            </svg>
                        </div>
                    </div>
                    <ShareModal />
                    <TopColorInfoCard />
                    <CarouselDots
                        count={cameraPositions.length}
                        current={selectedIdx === -1 ? 0 : selectedIdx}
                        onSelect={handleSelect}
                    />
                    <CanvasRoot />
                </div>
                <div className="mobile-step-bar">
                    <span className={activeStep === "baseSelector" ? "active" : ""} onClick={() => handleStepClick("baseSelector")}>BASE</span>
                    <span className={activeStep === "colorSelector" ? "active" : ""} onClick={() => handleStepClick("colorSelector")}>BASE COLOUR</span>
                    <span className={activeStep === "topColorSelector" ? "active" : ""} onClick={() => handleStepClick("topColorSelector")}>TOP COLOUR</span>
                    <span className={activeStep === "topShapeSelector" ? "active" : ""} onClick={() => handleStepClick("topShapeSelector")}>TOP SHAPE</span>
                    <span className={activeStep === "dimensionControls" ? "active" : ""} onClick={() => handleStepClick("dimensionControls")}>DIMENSION</span>
                    <span className={activeStep === "charirSelector" ? "active" : ""} onClick={() => handleStepClick("charirSelector")}>CHAIR</span>
                    <span className={activeStep === "summary" ? "active" : ""} onClick={() => handleStepClick("summary")}>SUMMARY</span>
                </div>
                <RightPanel setActiveStep={setActiveStep} />
            </div>
            <Footer />
        </>
    );
});

