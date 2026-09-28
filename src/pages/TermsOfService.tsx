import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-cream-100/50 border-b border-cream-200">
        <div className="container-page py-10 lg:py-14">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900">
            Terms of Service
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
              1. About SankirtanHub
            </h2>
            <p>
              SankirtanHub is a platform that helps users discover devotional
              artists and related services and submit booking requests for
              events and gatherings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              2. Booking Requests
            </h2>
            <p>
              Submitting a booking request does not guarantee that the booking
              will be confirmed. A booking is considered confirmed only after
              confirmation has been communicated to the customer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              3. Artist Information
            </h2>
            <p>
              Artist profiles may include information such as location,
              experience, services, ratings, pricing information, images, and
              availability. This information may change from time to time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              4. User Responsibilities
            </h2>
            <p>
              Users are responsible for providing accurate information when
              creating an account or submitting a booking request and for using
              SankirtanHub in a lawful and respectful manner.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              5. Pricing and Availability
            </h2>
            <p>
              Prices and availability shown on SankirtanHub may be subject to
              change and may depend on the artist, event requirements,
              location, date, and final arrangements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              6. Cancellation
            </h2>
            <p>
              Booking requests and confirmed bookings may be subject to
              cancellation or changes depending on the circumstances of the
              booking. Customers should follow the instructions provided in
              booking-related communications.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              7. Third-Party Services
            </h2>
            <p>
              Certain features of SankirtanHub may rely on third-party services.
              Your use of such features may also be subject to the terms and
              policies of those third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              8. Service Changes
            </h2>
            <p>
              SankirtanHub may modify, update, suspend, or discontinue features
              and services as the platform develops.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              SankirtanHub provides a platform for discovering artists and
              submitting booking requests. To the extent permitted by
              applicable law, SankirtanHub is not responsible for circumstances
              outside its reasonable control, including artist availability,
              cancellations, delays, or issues involving third-party services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              10. Changes to These Terms
            </h2>
            <p>
              These Terms of Service may be updated from time to time as
              SankirtanHub develops. Updated terms will be published on this
              page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-3">
              11. Contact Us
            </h2>
            <p>
              For questions regarding these Terms of Service, please contact us
              at{' '}
              <a
                href="mailto:SankirtanHub.bookings@gmail.com"
                className="text-saffron-700 font-medium hover:underline"
              >
                SankirtanHub.bookings@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-cream-200">
            <Link
              to="/"
              className="text-saffron-700 font-medium hover:underline"
            >
              ← Back to SankirtanHub
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}