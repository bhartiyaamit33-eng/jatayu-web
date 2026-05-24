import type { Metadata } from "next";

import { PageIntro } from "@/components/pages/PageIntro";
import { LegalSection } from "@/components/pages/LegalSection";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "VoiceDocAI Privacy Policy — how Jatayu Healthcare Technologies collects, uses, retains, and protects personal information of subscribers and patients.",
  alternates: { canonical: `${siteMeta.domain}/privacy` },
};

/**
 * /privacy — VoiceDocAI Privacy Policy (Last updated: 16 April 2022).
 *
 * Long-form legal page. Content is rendered inline (not from CMS yet) so
 * counsel can see the exact wording in version control. When we eventually
 * move it into Payload, swap the JSX below for a getPrivacyPolicy() reader.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="VoiceDocAI Privacy Policy"
        conciseAnswer="How Jatayu Healthcare Technologies collects, uses, retains, and protects personal information of subscribers and patient data generated through VoiceDocAI."
      />

      <article className="container-page max-w-3xl pb-[var(--section-y)] pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-magenta">
          Last updated: 16 April 2022
        </p>

        <p className="mt-6 text-sm leading-relaxed text-navy/85 md:text-[15px]">
          {siteMeta.legalName}, with its registered office at B 703, Urbano, Sector 4,
          Palava City, Kalyan, Thane – 421204, India, is the manufacturer of the product
          with different flavours known as VoiceDocAI Suite. We are committed to protecting
          our subscribers&rsquo; privacy in accordance with the terms of this privacy policy.
        </p>

        <div className="mt-12 space-y-12">
          <LegalSection
            number="1.1"
            heading="Territory, Scope of Use, and Jurisdiction"
            id="territory"
          >
            <h3 className="font-display text-base font-semibold text-navy">
              1.1.1. Territory
            </h3>
            <p>VoiceDocAI is currently available for use only in India.</p>

            <h3 className="font-display text-base font-semibold text-navy">
              1.1.2. Scope of Use
            </h3>
            <p>
              VoiceDocAI is chiefly a Medical Dictation and Summarization Application
              built for the Indian Healthcare context. Hence, it abides by all personal
              and professional privacy clauses stipulated by the Indian Law. Though
              privacy of personal and professional information is paramount for us. Our
              product is not yet certified for the privacy policy of any other country or
              region.
            </p>

            <h3 className="font-display text-base font-semibold text-navy">
              1.1.3. Jurisdiction
            </h3>
            <p>
              The laws of India shall apply in interpreting and governing the terms of
              this policy. The courts in Mumbai, Maharashtra, shall have exclusive
              jurisdiction over any controversy involving or resulting from this policy.
            </p>
          </LegalSection>

          <LegalSection number="1.2" heading="General Terms of Use" id="general-terms">
            <p>
              This Policy, along with the Subscription Terms and Conditions (found here:{" "}
              <a href="/terms">Terms &amp; Conditions</a>), governs your use of subscribed
              products and/or services. It outlines the categories of information we may
              get from you or that you may supply when you subscribe to our products
              and/or services, as well as outlines the processes of and goals for
              gathering, receiving, processing, storing, dealing, utilising, maintaining,
              transferring, and disclosing any such information.
            </p>
          </LegalSection>

          <LegalSection number="1.3" heading="Information Collection" id="info-collection">
            <h3 className="font-display text-base font-semibold text-navy">
              1.3.1. Purpose of Information Collection
            </h3>
            <p>
              We will not collect any personal information about you without your
              permission. We respect your right to privacy and commit to protecting the
              personal information we collect from you.
            </p>
            <p>
              Information collected from you is used to register you/your organization as
              a subscriber and, accordingly provide you with access to the requested
              products or services. We use your contact information to update you about
              any new product features/functions. For registering you/or your
              organisation for providing you with the subscription to the requested
              products/services, we will gather or ask for information such as your
              organization name, your user&rsquo;s name, email ID, address and phone
              number, doctor registration number, gender and date of birth.
            </p>
            <p>With regards to your information:</p>
            <ul>
              <li>
                You will have access to your information on the Product Dashboard and you
                will be allowed to modify the information to the extent that it is not
                affecting access to the application.
              </li>
              <li>Your personally identifiable information remains your own.</li>
              <li>
                Whenever the policy is changed or modified, we will notify all of our
                subscribers as well as the general public by placing a notice on the
                website and sending you an email.
              </li>
            </ul>

            <h3 className="font-display text-base font-semibold text-navy">
              1.3.2. Modes of Information Collection
            </h3>
            <p>
              We may collect personal information directly from you — in person, by
              telephone, text (WhatsApp) or email and/or via our website and apps.
              However, we may also collect information directly from a third party with
              your consent, who we have authorized to collect information.
            </p>
          </LegalSection>

          <LegalSection
            number="1.4"
            heading="Data Retention and Deletion"
            id="retention"
          >
            <p>
              During the active subscription period, your information will remain with us
              for the reasons mentioned above. However, we will retain personal data also
              after the active subscription period is completed in the event of
              cancellation of the subscription or non-payment of the subscription renewal
              payment. The following are the reasons for us to do so:
            </p>
            <ul>
              <li>
                To respond to any future queries, address any grievances, handle any
                claims made by you or on your behalf.
              </li>
              <li>
                To keep records required by law in case law enforcement agencies want the
                records from us in any legal matters.
              </li>
              <li>
                To get back in touch with you in future in case you again want to utilize
                our services/products or to promote any new products that may be of your
                interest.
              </li>
            </ul>
            <p>
              We won&rsquo;t keep your information any longer than is required for the
              goals outlined in this policy. When it is no longer necessary to retain
              your personal data, we may delete or anonymise it.
            </p>
          </LegalSection>

          <LegalSection
            number="1.5"
            heading="How We Use Your Information"
            id="use-of-info"
          >
            <p>
              We use the information that you have provided to us, including any Personal
              Information to:
            </p>
            <ul>
              <li>Provide you with access to products and services.</li>
              <li>
                Provide you with information regarding new products/services that may be
                of your interest.
              </li>
              <li>
                Notify you about updates happening in our products/services, or any
                additional features we have on offerings with or without additional cost.
              </li>
              <li>Seek regular feedback from you and accordingly improve your experience.</li>
              <li>Provide timely support.</li>
              <li>
                Detect, observe, examine, discourage, and guard against fraudulent,
                unauthorized or unlawful activities.
              </li>
              <li>
                Address any requests, disputes, grievances, or complaints you have made
                regarding the items or services you have used.
              </li>
            </ul>
            <p>
              We may also use your information for internal analytical purposes including
              usage analysis, auditing, and research.
            </p>
          </LegalSection>

          <LegalSection number="1.6" heading="Information Sharing" id="sharing">
            <p>
              Your data will never be sold or shared with any third party for marketing or
              any other purposes that are not necessary for the better functioning of
              products/services.
            </p>
            <p>
              We may share your information with the third parties to whom we are
              availing technical services to provide you with a better-personalised
              service. In such case, we will have a contractual agreement that the
              information shared with them will be protected by them and will remove the
              same after the contractual terms are over. For example, we use a
              third-party service provider to provide a feature of inline email
              communications with your patients.
            </p>
            <p>
              For purposes including but not limited to commercial, research, statistical
              analysis, and business intelligence, we may from time to time share the
              aggregated, anonymous, and non-personal User Data stored by us that does
              not specifically identify any individual with any third party, service
              providers, or affiliates.
            </p>
            <p>
              We are bound to share our subscriber information with law enforcement
              agencies in case they seek any such information.
            </p>
            <p>
              Your information available with us as a result of our business engagement
              along with the authorised users will be given to our buyer/successor in the
              event of a merger, divestiture, restructuring, reorganisation, dissolution,
              or other sale or transfer of some or all of our assets, whether as a going
              concern or as part of bankruptcy, liquidation, or similar proceeding.
              Likewise, the buyer/successor&rsquo;s privacy policy, if one exists.
            </p>
          </LegalSection>

          <LegalSection
            number="1.7"
            heading="Privacy of the Data Generated by You"
            id="generated-data"
          >
            <p>
              Some of our products enable you to capture/generate patient details,
              including personal details, antecedents, demographic information, health
              history, and health records, such as medication, therapeutic, and surgical
              procedure records. These records can be stored on the designated servers
              within our cloud infrastructure. For this information/data storage purpose,
              we rely on third-party service providers to ensure the safety and security
              of your information. We have developed and keep developing various
              mechanisms to evaluate and validate that our partner&rsquo;s internal
              security measures are capable of securing your Information and data
              generated by you over our products, from accidental loss, and unauthorized
              access (including use or alteration). We employ international and
              industry-recognized standards to protect your Information.
            </p>
            <p>
              You will concur with us that it is also up to you to ensure the safety and
              security of your information. You are solely in charge of maintaining the
              security and confidentiality of your account credentials and guarding
              against unauthorised access to your account by anyone other than you and
              your authorised users. Any violations of this policy by your workers or
              other people will be your full responsibility.
            </p>
            <p>
              In this regard, you agree to defend, indemnify, and hold us, our
              management, leadership, investors, employees, affiliates, agents, and
              business partners harmless from and against any loss, costs, damages,
              liabilities, and expenses (including legal fees) incurred in connection
              with, arising from, or to avoid any claim or demand from a third party that
              your use of the products and/or services violates the policy, any
              applicable law, any applicable regulation, or any other applicable
              agreement. You must completely cooperate with us to investigate and correct
              any unauthorised or illegal use of the products and/or services or
              violation of this policy if we become aware of it.
            </p>
            <p>
              You understand and acknowledge that there is no such thing as complete
              security and we cannot guarantee that there won&rsquo;t be any unintended
              disclosures of any information or potential security breaches, despite our
              best efforts to transmit and store all the Information provided by you by
              encrypting data in transit or in a secure operating environment that is not
              open to the public. You acknowledge and agree that we are not liable for
              acts of government, computer hacking, unauthorised access to computer data
              and storage devices, computer crashes, security breaches, or encryption,
              nor are we liable for any breach of security or for the actions of any
              third parties who obtain your information. Any privacy settings or security
              features that are disregarded on our products or services are not our
              responsibility.
            </p>
          </LegalSection>

          <LegalSection number="1.8" heading="Governing Law" id="governing-law">
            <p>
              The information security and personal secrecy laws of India shall govern
              and be applied to the provisions of this Policy. The courts in Mumbai,
              Maharashtra, shall have exclusive jurisdiction over any controversy
              involving or resulting from this policy.
            </p>
          </LegalSection>

          <LegalSection
            number="1.9"
            heading="Grievance Redressal"
            id="grievance"
          >
            <p>
              In case of any grievance or complaints about this policy, you may contact
              our authorized officer at{" "}
              <a href={`mailto:${siteMeta.salesEmail}`}>{siteMeta.salesEmail}</a>.
            </p>
          </LegalSection>
        </div>
      </article>
    </>
  );
}
