import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

export const ShareModal = observer(() => {
    const rootStore = useStore();
    const { uiStore } = rootStore;
    const [copied, setCopied] = useState(false);

    if (!uiStore.isShareModalOpen) return null;

    const generateShareLink = () => {
        const state = rootStore.serializeState();
        const base64State = btoa(JSON.stringify(state));
        const url = new URL(window.location.href);
        url.searchParams.set("s", base64State);
        return url.toString();
    };

    const handleCopy = () => {
        const link = generateShareLink();
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copied to clipboard!", {
            position: "bottom-center",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const modal = (
        <div className="modal-overlay" onClick={() => uiStore.setShareModalOpen(false)}>
            <div className="modal-content share-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Share your design</h2>
                    <button className="close-btn" onClick={() => uiStore.setShareModalOpen(false)}>×</button>
                </div>
                <div className="modal-body">
                    <p>Share this link with others to show them your current configuration.</p>
                    <div className="share-link-container">
                        <input
                            type="text"
                            readOnly
                            value={generateShareLink()}
                            className="share-link-input"
                        />
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === "undefined") {
        return modal;
    }

    return createPortal(modal, document.body);
});
