
interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="terms-overlay">
            <div className="terms-modal">
                <div className="terms-header">
                    <h3>Terms & Conditions of Sale and Website Use</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="terms-content">
                    <p><strong>Last Updated: October 2025</strong></p>
                    <p>
                        Welcome to Bemade Ltd (“we”, “us”, “our”). By placing an order or using our website <strong>bemade.co.uk</strong>, you agree to the following terms.
                    </p>

                    <h4>1. About Us</h4>
                    <p>
                        Bemade Ltd<br />
                        107–109 Fletcher Road, Preston, PR1 5AJ<br />
                        Email: <strong>hello@bemade.co.uk</strong>
                    </p>

                    <h4>2. Our Products</h4>
                    <p>
                        We design and supply both bespoke tables (made to your specification) and standard items such as chairs and accessories.
                    </p>
                    <p>
                        Every product image and description is prepared carefully, but as our materials are natural or handcrafted, slight variations in colour, grain, and finish may occur. These are normal and not classed as faults.
                    </p>

                    <h4>3. Orders & Payments</h4>
                    <ul>
                        <li>Full or part payment is required to confirm your order.</li>
                        <li>Orders are only accepted once payment is received and you receive written confirmation.</li>
                        <li>For bespoke items, production begins once your final design and payment are confirmed.</li>
                        <li>Payments are processed securely through trusted providers.</li>
                    </ul>
                    <p>
                        Important: Because all bespoke items are custom-made for you, they cannot be cancelled or refunded once production has started, except in the limited cases below (see Section 4). This condition is clearly stated before checkout and helps protect both you and us under UK law, including Section 75 of the Consumer Credit Act.
                    </p>

                    <h4>4. Refunds, Returns & Cancellations</h4>
                    <p>Bespoke tables:</p>
                    <ul>
                        <li>You have 24 hours after placing your order to request changes or cancellation.</li>
                    </ul>
                </div>
                <div className="terms-footer">
                    <button className="decline-btn" onClick={onClose}>Decline</button>
                    <button className="accept-btn" onClick={onAccept}>Accept</button>
                </div>
            </div>
        </div>
    );
};
