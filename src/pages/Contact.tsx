import { useState, type ChangeEvent, type FormEvent } from 'react';
import { MapPin, Mail, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

import { useToast } from '../context/ToastContext';

const isValidIndianPhone = (phone: string) => {
  const value = phone.trim();

  if (!/^[6-9]\d{9}$/.test(value)) {
    return false;
  }

  // Reject numbers like 8888888888, 9999999999, etc.
  if (/^(\d)\1{9}$/.test(value)) {
    return false;
  }

  // Reject obvious test/sequential numbers
  const fakeNumbers = [
    '0123456789',
    '1234567890',
    '0987654321',
    '9876543210',
  ];

  return !fakeNumbers.includes(value);
};

const isValidEmail = (email: string) => {
  const value = email.trim();

  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
};

export default function Contact() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const email = formData.email.trim();
  const phone = formData.phone.trim();

  if (!isValidEmail(email)) {
    toast('Please enter a valid email address.', 'error');
    return;
  }

  if (!isValidIndianPhone(phone)) {
    toast('Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  setSubmitting(true);

    try {
      const templateParams = {
        customer_name: formData.name,
        customer_email: email,
customer_phone: phone,
        subject: formData.subject || 'General Enquiry',
        message: formData.message,
        time: new Date().toLocaleString('en-IN'),
      };

      await emailjs.send(
        'service_lrt1tlg',
        'template_4uyxklp',
        templateParams,
        'Amxr-E9J93kvC-TNP'
      );

      toast(
        'Message sent successfully. We will get back to you soon.',
        'success'
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('CONTACT FORM ERROR:', error);

      toast(
        'Failed to send your message. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 lg:pt-24">

      {/* Hero Section */}
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-12 lg:py-16 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-100 text-saffron-700 font-semibold text-sm mb-5">
            <MessageCircle className="w-4 h-4" />
            We're Here to Help
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Contact Us
          </h1>

          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Have questions about artist bookings or BhaktiHub? We're here to
            help you plan your spiritual event with ease.
          </p>

        </div>
      </div>

      {/* Contact Cards */}
      <div className="container-page py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Address */}
          <div className="card p-6 text-center hover:shadow-glow transition-all">
            <div className="w-14 h-14 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-saffron-600" />
            </div>

            <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
              Address
            </h3>

            <p className="text-neutral-600">
              Rajasthan, India
            </p>
          </div>

          {/* Email */}
          <div className="card p-6 text-center hover:shadow-glow transition-all">
            <div className="w-14 h-14 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-saffron-600" />
            </div>

            <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
              Email
            </h3>

            <a
              href="mailto:bhaktihub.bookings@gmail.com"
              className="text-neutral-600 hover:text-saffron-700 transition-colors"
            >
              bhaktihub.bookings@gmail.com
            </a>
          </div>

        </div>

        {/* Contact Form */}
        <div className="mt-14">
          <div className="card max-w-4xl mx-auto p-8">

            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-neutral-900">
                Send Us a Message
              </h2>

              <p className="text-neutral-500 mt-2">
                Fill out the form below and our team will get back to you as
                soon as possible.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Full Name *
                </label>

                <input
  id="name"
  name="name"
  type="text"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
  minLength={2}
  maxLength={60}
  className="input-field"
/>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address *
                </label>

               <input
  id="email"
  name="email"
  type="email"
  required
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
 pattern="[^\s@]+@[^\s@]+\.[A-Za-z]{2,}"
title="Please enter a valid email address, for example: name@gmail.com"
  className="input-field"
/>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number *
                </label>

                <input
  id="phone"
  name="phone"
  type="tel"
  required
  value={formData.phone}
  onChange={(e) =>
  setFormData((prev) => ({
    ...prev,
    phone: e.target.value.replace(/\D/g, '').slice(0, 10),
  }))
}
  placeholder="Enter your 10-digit mobile number"
  minLength={10}
  maxLength={10}
  pattern="[6-9][0-9]{9}"
  title="Please enter a valid number"
  inputMode="numeric"
  className="input-field"
/>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="input-field"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>

                <textarea
  id="message"
  name="message"
  required
  rows={6}
  value={formData.message}
  onChange={handleChange}
  placeholder="Tell us how we can help you..."
  minLength={10}
  maxLength={1000}
  className="input-field resize-none"
/>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 text-center">

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary px-10 py-3"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-sm text-neutral-500 mt-4">
                  We usually respond within 24 hours.
                </p>

              </div>

            </form>

          </div>
        </div>
      </div>

      {/* Support Hours */}
      <div className="mt-14">
        <div className="card max-w-4xl mx-auto p-8">
          <div className="text-center">

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
              Support Hours
            </h2>

            <p className="text-neutral-500 mt-2">
              Our team is available to help with your enquiries and booking
              questions.
            </p>

            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-6 py-4 rounded-xl bg-cream-100 border border-cream-200">
              <span className="font-medium text-neutral-800">
                Monday – Sunday
              </span>

              <span className="hidden sm:block text-neutral-300">
                |
              </span>

              <span className="text-saffron-700 font-semibold">
                9:00 AM – 8:00 PM
              </span>
            </div>

            <p className="text-sm text-neutral-400 mt-4">
              We usually respond to enquiries within 24 hours.
            </p>

          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-14 mb-16">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>

            <p className="text-neutral-500 mt-2">
              Quick answers to some common questions about BhaktiHub.
            </p>
          </div>

          <div className="space-y-4">

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                How do I book an artist?
              </h3>

              <p className="text-neutral-500 text-sm leading-6">
                Visit the artist's profile, choose your event details, and
                submit a booking request. We will check availability and get
                back to you.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                When will I receive booking confirmation?
              </h3>

              <p className="text-neutral-500 text-sm leading-6">
                A booking request does not mean the artist is booked
                immediately. Confirmation is provided after the artist's
                availability is checked.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                Can I book artists for events outside Rajasthan?
              </h3>

              <p className="text-neutral-500 text-sm leading-6">
                Yes. BhaktiHub is designed to connect users with devotional
                artists and service providers for events across India.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                How are payments handled?
              </h3>

              <p className="text-neutral-500 text-sm leading-6">
                Payment and booking details are discussed after availability is
                confirmed and the booking is finalized.
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}