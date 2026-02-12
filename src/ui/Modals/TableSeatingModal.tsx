import { useStore } from "../../context/StoreContext";
import { pdfjs, Document, Page } from "react-pdf";
import { createPortal } from "react-dom";

interface TableSeatingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

export const TableSeatingModal = ({ isOpen, onClose }: TableSeatingModalProps) => {
    if (!isOpen) return null;

    const { topShapeStore } = useStore();
    const pdfPath = "/assets/chair_size_chart.pdf";
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
    const pageWidth =
        typeof window !== "undefined"
            ? Math.min(window.innerWidth - (isMobile ? 40 : 80), 820)
            : undefined;

    const shapeId = topShapeStore.selectedTopShape.id;

    let pageNumber = 1;
    let containerStyle: React.CSSProperties = {};
    let pageStyle: React.CSSProperties = {};

    if (shapeId === "capsule") {
        pageNumber = 1;
    }
    else if (shapeId === "rectangle") {
        pageNumber = 2;
    }
    else if (shapeId === "oblong") {
        pageNumber = 3;
    }
    else if (shapeId === "oval") {
        pageNumber = 4;
    }
    else {
        pageNumber = 5;

        containerStyle = {
            height: "320px",
            overflow: "hidden",
            width : "100%",
        };

        if (shapeId === "round") {
            pageStyle = {
                transform: "translateY(0px)",
            };
        }
        else {
            pageStyle = {
                transform: "translateY(-280px)",
            };
        }
    }

    const modal = (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 3000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: isMobile ? "12px" : "20px",
                overflowY: "auto",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: isMobile ? "100%" : "90%",
                    maxWidth: "900px",
                    maxHeight: isMobile ? "calc(100vh - 24px)" : "90vh",
                    backgroundColor: "#fff",
                    borderRadius: isMobile ? "10px" : "8px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        padding: isMobile ? "12px 14px" : "14px 18px",
                        backgroundColor: "#000",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: isMobile ? "16px" : "20px", lineHeight: 1.25 }}>
                        Table Size & Seating Chart Info
                    </h3>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: isMobile ? "20px" : "22px",
                            cursor: "pointer",
                        }}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        padding: isMobile ? "10px" : "16px",
                        overflow: "auto",
                        flex: 1,
                    }}
                >
                    <div style={containerStyle}>
                        <Document file={pdfPath}>
                            <div style={pageStyle}>
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={pageWidth}
                                />
                            </div>
                        </Document>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === "undefined") {
        return modal;
    }

    return createPortal(modal, document.body);
};
