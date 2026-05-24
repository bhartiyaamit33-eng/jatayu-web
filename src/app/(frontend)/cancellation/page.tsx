import type { Metadata } from "next";

import { PageIntro } from "@/components/pages/PageIntro";
import { LegalSection } from "@/components/pages/LegalSection";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "VoiceDocAI Cancellation and Refund Policy. How to cancel a subscription, what happens to access during the billing cycle, and the No-Refund policy with extraordinary exceptions.",
  alternates: { canonical: `${siteMeta.domain}/cancellation` },
};

/**
 * /cancellation — VoiceDocAI Cancellation and Refund Policy (effective 16 April 2023).
 *
 * Long-form legal page rendered with the shared LegalSection helper for
 * consistency with /privacy and /terms.
 */
export default function CancellationPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="VoiceDocAI Cancellation and Refund Policy"
        conciseAnswer="You may cancel any active VoiceDocAI subscription at any time by email. Access continues until the end of the current billing cycle. A No-Refund policy applies, with extraordinary exceptions described below."
      />

      <article className="container-page max-w-3xl pb-[var(--section-y)] pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-magenta">
          Effective Date: 16 April 2023
        </p>

        <p className="mt-6 text-sm leading-relaxed text-navy/85 md:text-[15px]">
          As of 16 April 2023, the following Cancellation and Refund Terms are put into
          effect, and you agree to and abide by the following policy terms upon
          subscribing VoiceDocAI Products/Services (hereinafter called as
          &lsquo;products&rsquo; or &lsquo;services&rsquo; or &lsquo;product&rsquo; or
          &lsquo;service&rsquo; throughout this document) offered by{" "}
          <strong>M/s {siteMeta.legalName}</strong> (hereinafter called the
          &lsquo;company&rsquo; or &lsquo;we&rsquo; throughout this document). The below
          policy terms are applicable only for the VoiceDocAI products/services offered
          to you or subscribed by you.
        </p>

        <div className="mt-12 space-y-12">
          <LegalSection number="1.1" heading="Policy Terms" id="policy-terms">
            <p>
              You are free to cancel your active subscription to the products/services
              at any time with or without providing any specific reason.
            </p>
            <p>
              In case you want to cancel the subscription, you are advised to raise the
              subscription cancellation request only over email (emails must be from the
              email ID you have provided during registration) anytime during the active
              subscription period (i.e., the current subscription billing cycle) in both
              the cases of the new subscriptions and the renewed subscriptions.
            </p>
            <p>
              Once cancelled, your access to the products/services will be revoked
              immediately after the billing cycle is completed, and thus no future
              subscription renewal payments/fees are charged to your account.
            </p>
            <p>
              In any case, under the No-Refund Policy of {siteMeta.legalName}, upon
              cancellation, irrespective of when the request is made or accepted, no
              refund will be processed unless the case falls under our extraordinary
              cancellation/refund cases list described below.
            </p>
            <p>
              Upon cancellation, though the balance subscription fee will not be
              refunded, you are allowed to continue accessing and using the subscribed
              products/services during the current billing cycle.
            </p>
            <p>
              Currently we are not using any auto-renewal mechanism. Hence, if the
              subscription is not renewed before the end of the billing cycle, access to
              subscribed products/services will be revoked immediately after the
              completion of the current billing cycle. This revocation should not be
              deemed to be cancelled. In such cases, the subscriptions will be marked
              inactive.
            </p>
            <p>
              In the cases of service breakdown due to events which are beyond the
              control of the company, which includes but are not limited to the acts of
              God, accidents, riots, war, terrorist act, civil commotion, breakdown of
              communication facilities, breakdown of web host, breakdown of internet
              service provider, natural catastrophes, governmental acts or omissions,
              changes in laws or regulations, national strikes, national emergency, and
              national, state, or local Government declared lockdown or curfews, we
              should not be made liable to refund the collected subscription fee.
              However, in such cases, services will continue till the completion of the
              billing period and will be terminated thereafter with/without notification.
            </p>
          </LegalSection>

          <LegalSection
            number="1.2"
            heading="Extraordinary refund cases"
            id="extraordinary-cases"
          >
            <p>
              Though the No-Refund policy is in place, we do care about your concerns.
              Hence, if notified by you or your representative within a reasonable period
              and with the appropriate reason(s), we may refund fully or partially (based
              on the case) the collected fee/charges in the following cases:
            </p>
            <ul>
              <li>
                Subscriber is disabled due to accident/illness or died during the active
                subscription period.
              </li>
              <li>
                Subscriber provides a valid report about fraudulent or unauthorized
                charges collected by the representatives of the company.
              </li>
              <li>
                Judiciary or law enforcement authority decreed to refund you in the case
                of arbitration.
              </li>
              <li>For any other reason that we deem appropriate for refunding.</li>
            </ul>
          </LegalSection>

          <LegalSection
            number="1.3"
            heading="Data export after cancellation"
            id="data-export"
          >
            <p>
              You need to make a separate request for data that you have generated for
              your patients using the subscribed products/services that are stored on our
              cloud. This request must be made within{" "}
              <strong>90 days after the cancellation</strong>. The data will be
              accordingly provided to you in CSV / PDF / JSON format.
            </p>
            <p>
              For all cancellation, refund, or data-export requests, write to{" "}
              <a href={`mailto:${siteMeta.salesEmail}`}>{siteMeta.salesEmail}</a> from
              the email address used during registration.
            </p>
          </LegalSection>
        </div>
      </article>
    </>
  );
}
