import React,{ useState } from "react";
import { Button } from "@/components/ui/button-variants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmailSubscriptionPopup from "@/components/EmailSubscriptionPopup";
import ContentCurationPopup from "@/components/ContentCurationPopup";
import { useCategories } from "../hooks/useArticles";
const Contact = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    subject: "",
    interest: "",
    message: "",
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    interest: "",
  });
  const [interestError, setInterestError] = useState("");
  const { categories, loading: categoriesLoading } = useCategories();
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showContentPopup, setShowContentPopup] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.interest) {
      setInterestError("Please select an interest");
      return;
    }
    
    setInterestError("");
    setIsSubmitting(true);

    const formDataObj = {
      name: formData.identifier,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      interest: formData.interest,
    };

    try {
      const response = await fetch(
        "https://axis-mundi-backend.onrender.com/api/contact", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObj),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setResult("");
        
        console.log("✅ Contact form submitted successfully:", result);

        setUserData(result.userData);
        setSelectedInterest(formData.interest || "");

        if (formData.interest) {
          await sendWebhookResponse(result.userData);
        }

        setFormData({
          identifier: "",
          email: "",
          subject: "",
          message: "",
          interest: "",
        });

        setSuccessMessage("Message transmitted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setResult(result.error || "Transmission failed - please try again");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("❌ Contact form submission failed:", error);
      setResult("Network error occurred");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const sendWebhookResponse = async (userData: any) => {
    setShowEmailPopup(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleInterestChange = (interest: string) => {
  setFormData({
    ...formData,
    interest: interest
  });
  setInterestError(""); // Clear error when user makes selection
};
  

  const handleEmailPopupClose = () => {
    setShowEmailPopup(false);
    setShowContentPopup(true);
  };

  const closePopups = () => {
    setShowEmailPopup(false);
    setShowContentPopup(false);
  };

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="blue-accent-line pl-8">
            <h1 className="mb-6">Initialize Connection</h1>
            <p className="text-lg text-text-secondary max-w-3xl">
              Let's architect the future together
            </p>
          </div>
        </div>
      </section>
      {/* Contact Form & Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm text-text-secondary tracking-wider mb-3">
                    IDENTIFIER
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-text-secondary/30 px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary tracking-wider mb-3">
                    ELECTRONIC MAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-text-secondary/30 px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary tracking-wider mb-3">
                    SUBJECT MATTER
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-text-secondary/30 px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary tracking-wider mb-3">
                    INTERESTS (Select one)
                  </label>
                  <div className="space-y-3">
                    {categoriesLoading ? (
                      <div className="text-text-secondary text-sm">
                        Loading categories...
                      </div>
                    ) : (
                      categories.map((interest) => (
                        <label
                          key={interest}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="interest"
                            checked={formData.interest === interest}
                            onChange={() => handleInterestChange(interest)}
                            className="w-3 h-3 text-primary bg-transparent border border-text-secondary/30 rounded-full focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm transition-colors text-text-primary hover:text-primary">
                            {interest}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  {interestError && (
                    <p className="text-xs text-red-400 mt-2">
                      {interestError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-text-secondary tracking-wider mb-3">
                    DATA PAYLOAD
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-transparent border border-text-secondary/30 px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors resize-vertical"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  variant="tech"
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
                </Button>

                {result && (
                  <div className="text-center py-2 text-red-400">{result}</div>
                )}

                {successMessage && (
                  <div className="success-message mt-4 p-3 bg-green-600/20 border border-green-600/30 text-green-400 text-sm text-center">
                    {successMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h3 className="text-primary mb-4">COORDINATES</h3>
                <div className="text-text-secondary space-y-2">
                  <p>6.0329° N, 80.2168° E</p>
                  <p>Galle Sri Lanka</p>
                </div>
              </div>

              <div>
                <h3 className="text-primary mb-4">COMMUNICATION</h3>
                <div className="text-text-secondary space-y-2">
                  <p>555-555-5555</p>
                  <p>Mary.holmes@axismunditech.com</p>
                </div>
              </div>

              <div>
                <h3 className="text-primary mb-4">OPERATING HOURS</h3>
                <div className="text-text-secondary space-y-2">
                  <p>24/7 System Availability</p>
                  <p>Human Support: 09:00-18:00 PST</p>
                </div>
              </div>

              <div>
                <h3 className="text-primary mb-4">NETWORK</h3>
                <div className="text-text-secondary space-y-2">
                  <a
                    href="https://instagram.com/greenjacket_nomad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <img
                      src="/instagram.svg"
                      alt="Instagram"
                      className="w-5 h-5"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popups */}
      <EmailSubscriptionPopup
        isOpen={showEmailPopup}
        onClose={closePopups}
        onSubscribe={handleEmailPopupClose}
        onDecline={handleEmailPopupClose}
        userData={{
          name: userData.name,
          email: userData.email,
          interest: selectedInterest,
        }}
      />

      <ContentCurationPopup
        isOpen={showContentPopup}
        onClose={closePopups}
        selectedInterest={selectedInterest}
      />
    </div>
  );
};

export default Contact;
