import { useStore } from "../../context/StoreContext";
import { pdfjs, Document, Page } from "react-pdf";

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

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90%",
                    maxWidth: "900px",
                    maxHeight: "90vh",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        padding: "14px 18px",
                        backgroundColor: "#000",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ margin: 0 }}>
                        Table Size & Seating Chart Info
                    </h3>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: "22px",
                            cursor: "pointer",
                        }}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        padding: "16px",
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
                                />
                            </div>
                        </Document>
                    </div>
                </div>
            </div>
        </div>
    );
};
