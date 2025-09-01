import { useState } from "react";
import { Button } from "@/components/ui/button-variants";

const Contact = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    subject: "",
    message: "",
  });

  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("Transmitting...");

    const formDataObj = new FormData();
    formDataObj.append("access_key", "0de4c1f1-b510-4f3b-a430-0551a286611e");
    formDataObj.append("name", formData.identifier);
    formDataObj.append("email", formData.email);
    formDataObj.append("subject", formData.subject);
    formDataObj.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message transmitted successfully");
        setFormData({
          identifier: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        console.log("Error", data);
        setResult(data.message || "Transmission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setResult("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                  <div
                    className={`text-center py-2 ${
                      result.includes("success")
                        ? "text-primary"
                        : "text-red-400"
                    }`}
                  >
                    {result}
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
                      className="w-11 h-11"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
