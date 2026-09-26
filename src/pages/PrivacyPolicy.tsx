import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-10 lg:py-14">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 mt-2">
            Last updated: 16 September 2026
          </p>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <div className="max-w-4xl mx-auto space-y-8 text-neutral-600 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use BhaktiHub, we may collect information such as your
              name, email address, phone number, booking details, event
              information, and other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information you provide to manage your account,
              process booking requests, communicate with you, provide customer
              support, and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              3. Booking and Communication
            </h2>
            <p>
              Information provided during a booking request may be used to
              communicate with you about your request, including booking
              updates and confirmation-related communication.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              4. Third-Party Service Providers
            </h2>
            <p>
              We may use trusted third-party service providers to support
              certain website functions and communication services. These
              providers may process information only as necessary to provide
              the relevant service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              5. Information Security
            </h2>
            <p>
              We take reasonable steps to protect the information provided to
              us. However, no method of electronic storage or transmission can
              be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              6. Information Retention
            </h2>
            <p>
              Information may be retained for as long as reasonably necessary
              to provide our services, manage booking requests, communicate
              with users, and maintain relevant records.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              7. Artist Information
            </h2>
            <p>
              Artist information displayed on BhaktiHub is provided for
              discovery and booking purposes. Certain artist contact
              information may be shared with a customer only after a booking
              has been confirmed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time as BhaktiHub
              develops. Any updated version will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              9. Contact Us
            </h2>
            <p>
              For questions regarding this Privacy Policy, please contact us
              at{' '}
              <a
                href="mailto:bhaktihub.bookings@gmail.com"
                className="text-saffron-700 font-medium hover:underline"
              >
                bhaktihub.bookings@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-cream-200">
            <Link
              to="/"
              className="text-saffron-700 font-medium hover:underline"
            >
              ← Back to BhaktiHub
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}