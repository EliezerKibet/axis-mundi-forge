import { useState } from "react";
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

const Contact = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    subject: "",
    interests: [] as string[],
    message: "",
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
  });

  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showContentPopup, setShowContentPopup] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataObj = {
      name: formData.identifier, //name,message
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      interests: formData.interests,
    };

    try {
      const response = await fetch(
        "https://n8n-service-bmex.onrender.com/webhook/Form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObj),
        }
      );

      if (response.ok) {
        // Remove transmitting text and add success message
        setResult("");

        // Console log for developer verification
        console.log("✅ Contact form submitted successfully:", {
          timestamp: new Date().toISOString(),
          formData: formDataObj,
          response: response,
        });

        const currentUserData = {
          name: formData.identifier,
          email: formData.email,
          interests: formData.interests,
        };

        setUserData(currentUserData);
        setSelectedInterest(formData.interests[0] || "");

        if (formData.interests.length > 0) {
          //data  for name , email and interests (done in sendWebhookResponse  )
          await sendWebhookResponse(currentUserData);
        }

        setFormData({
          identifier: "",
          email: "",
          subject: "",
          message: "",
          interests: [],
        });

        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setResult("Transmission failed - please try again");
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

  const handleInterestChange = (interest: string, checked: boolean) => {
    const currentInterests = formData.interests || [];
    if (checked) {
      if (currentInterests.length < 2) {
        setFormData({
          ...formData,
          interests: [...currentInterests, interest],
        });
      }
    } else {
      setFormData({
        ...formData,
        interests: currentInterests.filter((i) => i !== interest),
      });
    }
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
                    INTERESTS (Select up to 2)
                  </label>
                  <div className="space-y-3">
                    {[
                      "Quantum Computing",
                      "Resilient AI Systems",
                      "Neural Commerce Platforms",
                      "Enterprise Solutions",
                      "Research Collaboration",
                    ].map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.interests?.includes(interest) || false
                          }
                          onChange={(e) =>
                            handleInterestChange(interest, e.target.checked)
                          }
                          disabled={
                            !formData.interests?.includes(interest) &&
                            (formData.interests?.length || 0) >= 2
                          }
                          className="w-4 h-4 text-primary bg-transparent border border-text-secondary/30 rounded focus:ring-primary focus:ring-2"
                        />
                        <span
                          className={`text-sm transition-colors ${
                            !formData.interests?.includes(interest) &&
                            (formData.interests?.length || 0) >= 2
                              ? "text-text-secondary/50"
                              : "text-text-primary hover:text-primary"
                          }`}
                        >
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                  {(formData.interests?.length || 0) >= 2 && (
                    <p className="text-xs text-primary mt-2">
                      Maximum 2 interests selected
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
