import type { Metadata } from "next";

import { PageIntro } from "@/components/pages/PageIntro";
import { LegalSection } from "@/components/pages/LegalSection";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for VoiceDocAI — the AI-powered medical dictation product from Jatayu Healthcare Technologies. Effective 16 April 2023.",
  alternates: { canonical: `${siteMeta.domain}/terms` },
};

/**
 * /terms — VoiceDocAI Terms of Use (Effective: 16 April 2023).
 *
 * Long-form legal page. See /privacy for the same content-rendering pattern.
 */
export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="VoiceDocAI Terms of Use"
        conciseAnswer="Terms governing your access to and use of VoiceDocAI, the AI-powered medical dictation product from Jatayu Healthcare Technologies. By using VoiceDocAI you agree to be bound by these Terms."
      />

      <article className="container-page max-w-3xl pb-[var(--section-y)] pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-magenta">
          Effective Date: 16 April 2023
        </p>

        <p className="mt-6 text-sm leading-relaxed text-navy/85 md:text-[15px]">
          Thank you for choosing VoiceDocAI, an AI-powered product designed for Indian
          medical professionals. These Terms of Use (&ldquo;Terms&rdquo;) govern your
          access to and use of VoiceDocAI. By accessing or using VoiceDocAI, you agree
          to be bound by these Terms. If you do not agree with these Terms, please do
          not use VoiceDocAI.
        </p>

        <div className="mt-12 space-y-12">
          <LegalSection number="1." heading="Description of VoiceDocAI" id="description">
            <p>
              VoiceDocAI is a software application developed for medical practitioners
              to create medical reports using dictation. It utilizes advanced artificial
              intelligence and NLP technologies to transcribe the dictation into
              contextual medical text.
            </p>
          </LegalSection>

          <LegalSection number="2." heading="User Eligibility" id="eligibility">
            <p>
              VoiceDocAI is intended for use by individuals, particularly medical
              professionals, who are at least 18 years of age. By accessing or using
              VoiceDocAI, you represent and warrant that you meet these eligibility
              requirements.
            </p>
          </LegalSection>

          <LegalSection
            number="3."
            heading="Privacy and Data Protection"
            id="privacy"
          >
            <p>
              Protecting your privacy and ensuring the security of your personal
              information is of utmost importance to us. We collect, process, and store
              user data in accordance with our{" "}
              <a href="/privacy">Privacy Policy</a>. By using VoiceDocAI, you consent to
              the collection, use, and disclosure of your personal information as
              described in the Privacy Policy.
            </p>
          </LegalSection>

          <LegalSection number="4." heading="User Responsibilities" id="responsibilities">
            <h3 className="font-display text-base font-semibold text-navy">
              4.1. User Account
            </h3>
            <p>
              To access certain features of VoiceDocAI, you may need to create a user
              account. You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your account.
              You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h3 className="font-display text-base font-semibold text-navy">
              4.2. Accurate Information
            </h3>
            <p>
              You agree to provide accurate, current, and complete information when using
              VoiceDocAI and to update your information promptly if there are any changes.
            </p>

            <h3 className="font-display text-base font-semibold text-navy">
              4.3. Compliance with Laws
            </h3>
            <p>
              You agree to use VoiceDocAI in compliance with all applicable laws,
              regulations, and guidelines. You shall not use VoiceDocAI for any unlawful,
              harmful, or fraudulent activities.
            </p>

            <h3 className="font-display text-base font-semibold text-navy">
              4.4. Prohibited Activities
            </h3>
            <p>When using VoiceDocAI, you shall not:</p>
            <ul>
              <li>
                Modify, adapt, translate, reverse engineer, decompile, or disassemble any
                part of VoiceDocAI.
              </li>
              <li>
                Use VoiceDocAI to send spam, transmit viruses, or engage in any other
                activity that may disrupt or interfere with the proper functioning of
                VoiceDocAI.
              </li>
              <li>
                Impersonate any person or entity, or falsely state or misrepresent your
                affiliation with a person or entity.
              </li>
              <li>
                Use VoiceDocAI to infringe upon the intellectual property rights of others.
              </li>
              <li>
                Engage in any activity that may damage, disable, or impair the servers,
                networks, or security systems of VoiceDocAI.
              </li>
            </ul>
          </LegalSection>

          <LegalSection
            number="5."
            heading="Intellectual Property Rights"
            id="ip-rights"
          >
            <p>
              VoiceDocAI and all its related content, including but not limited to text,
              graphics, images, videos, software, and trademarks, are the property of the
              product owners or its licensors. These Terms do not grant you any rights or
              licenses in or to the intellectual property rights of VoiceDocAI, except
              for the limited right to access and use VoiceDocAI as expressly permitted
              by these Terms.
            </p>
          </LegalSection>

          <LegalSection
            number="6."
            heading="Limitation of Liability"
            id="liability"
          >
            <p>
              To the maximum extent permitted by applicable law, the owners of
              VoiceDocAI, its affiliates, and its respective officers, directors,
              employees, agents, and licensors shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not
              limited to damages for loss of profits, goodwill, data, or other intangible
              losses arising out of or in connection with your use of VoiceDocAI.
            </p>
          </LegalSection>

          <LegalSection
            number="7."
            heading="Modifications to the Terms"
            id="modifications"
          >
            <p>
              We reserve the right to modify these Terms at any time without prior
              notice. The updated Terms will be effective as of the date of posting on
              VoiceDocAI. It is your responsibility to review these Terms periodically to
              stay informed of any changes. Your continued use of VoiceDocAI after the
              posting of the updated Terms constitutes your acceptance of the modified
              Terms.
            </p>
          </LegalSection>

          <LegalSection number="8." heading="Termination" id="termination">
            <p>
              We may terminate or suspend your access to VoiceDocAI at any time and for
              any reason without prior notice. Upon termination, you will no longer have
              access to your account or any data associated with it.
            </p>
          </LegalSection>

          <LegalSection
            number="9."
            heading="Governing Law and Jurisdiction"
            id="governing-law"
          >
            <p>
              These Terms shall be governed by and construed in accordance with the laws
              of India. Any disputes arising out of or in connection with these Terms
              shall be subject to the exclusive jurisdiction of the courts located in
              Mumbai.
            </p>
          </LegalSection>

          <LegalSection number="10." heading="Contact Information" id="contact">
            <p>
              If you have any questions or concerns about these Terms or VoiceDocAI,
              please contact us at{" "}
              <a href={`mailto:${siteMeta.salesEmail}`}>{siteMeta.salesEmail}</a>.
            </p>
            <p>
              By using VoiceDocAI, you acknowledge that you have read, understood, and
              agreed to be bound by these Terms of Use.
            </p>
          </LegalSection>
        </div>
      </article>
    </>
  );
}
