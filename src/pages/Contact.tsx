import { useState } from 'react';
import { Button } from '@/components/ui/button-variants';

const Contact = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
                  />
                </div>

                <Button type="submit" variant="tech" className="w-full h-12">
                  TRANSMIT MESSAGE
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h3 className="text-primary mb-4">COORDINATES</h3>
                <div className="text-text-secondary space-y-2">
                  <p>37.7749° N, 122.4194° W</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>

              <div>
                <h3 className="text-primary mb-4">COMMUNICATION</h3>
                <div className="text-text-secondary space-y-2">
                  <p>+1 (415) 555-0142</p>
                  <p>connect@axismundi.tech</p>
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
                  <p>GitHub | LinkedIn | X</p>
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