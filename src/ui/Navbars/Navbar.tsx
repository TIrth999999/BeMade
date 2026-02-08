import "../../App.css";
import { useState } from "react";
import { SampleModal } from "../Modals/SampleModal";

export function Navbar() {
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <img
                    src="assets/header_logo.svg"
                    alt="BeMade"
                    className="navbar-logo"
                />

                <div className="navbar-steps">
                    <span className="active">BASE</span>
                    <span>BASE COLOUR</span>
                    <span>TOP COLOUR</span>
                    <span>TOP SHAPE</span>
                    <span>DIMENSION</span>
                    <span>CHAIR</span>
                    <span>SUMMARY</span>
                </div>

                <button className="navbar-btn" onClick={() => setIsSampleModalOpen(true)}>
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
