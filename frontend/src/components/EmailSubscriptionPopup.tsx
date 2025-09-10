import { X, Mail } from "lucide-react";
import { useState } from "react";

interface EmailSubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onDecline: () => void;
  userData: { name: string; email: string; interest: string };
}

const EmailSubscriptionPopup = ({
  isOpen,
  onClose,
  onSubscribe,
  userData,
}: EmailSubscriptionPopupProps) => {
  if (!isOpen) return null;

  const sendSubscriptionWebhook = async (subscribed: boolean) => {
    if (!userData) return;

    try {
      const webhookResponse = await fetch(
        "https://mholm12.app.n8n.cloud/webhook/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            interest: userData.interest,
            subscribed: subscribed, // true for YES, false for NO
          }),
        }
      );

      if (webhookResponse.ok) {
        console.log("Subscription webhook sent successfully");
      }
    } catch (error) {
      console.error("Subscription webhook failed:", error);
    }
  };

  const handleYes = async () => {
    await sendSubscriptionWebhook(true);
    onSubscribe();
  };

  const handleNo = async () => {
    onSubscribe();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f3a] border-t-2 border-primary max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Email icon container */}
        <div className="w-16 h-16 bg-primary/20 border border-primary mx-auto mb-6 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-light text-white mb-4">Stay Connected</h3>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            Would you like to receive our monthly newsletter with exclusive
            insights on quantum computing, AI, and emerging technologies?
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={handleYes}
              className="px-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-medium tracking-wide"
            >
              YES
            </button>
            <button
              onClick={handleNo}
              className="px-8 py-3 bg-transparent border border-text-secondary/30 text-text-secondary hover:border-text-secondary hover:text-white transition-colors font-medium tracking-wide"
            >
              NO
            </button>
          </div>

          {/* Footer text */}
          <p className="text-text-secondary/60 text-xs">
            Once a month. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSubscriptionPopup;
