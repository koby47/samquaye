const sections = [
  {
    title: '1. Information Collected',
    content: (
      <>
        <p>
          This website may collect information that you voluntarily provide
          through the contact form, including:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Your name</li>
          <li>Email address</li>
          <li>Subject or reason for contacting me</li>
          <li>The contents of your message</li>
        </ul>

        <p className="mt-4">
          Technical information necessary for the operation and security of
          the website may also be processed automatically by the website's
          hosting and infrastructure providers.
        </p>
      </>
    ),
  },
  {
    title: '2. How Your Information Is Used',
    content: (
      <>
        <p>Information submitted through this website may be used to:</p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Respond to enquiries and messages</li>
          <li>
            Communicate regarding professional opportunities, projects,
            collaborations, or services
          </li>
          <li>Maintain the security and reliability of the website</li>
          <li>Prevent spam, abuse, and malicious activity</li>
          <li>Improve the operation of the website</li>
        </ul>

        <p className="mt-4">
          Personal information submitted through the contact form will not be
          sold or rented to third parties.
        </p>
      </>
    ),
  },
  {
    title: '3. Contact Form',
    content: (
      <>
        <p>
          When you submit the contact form, the information you provide is
          transmitted to the website's backend and may be stored so that your
          enquiry can be reviewed and responded to.
        </p>

        <p className="mt-4">
          Please do not submit passwords, financial information,
          identification documents, or other highly sensitive information
          through the contact form.
        </p>
      </>
    ),
  },
  {
    title: '4. Security and Spam Protection',
    content: (
      <p>
        This website may use security technologies, including Cloudflare
        Turnstile, to help distinguish legitimate visitors from automated or
        abusive traffic. Information may be processed as necessary to provide
        these security functions.
      </p>
    ),
  },
  {
    title: '5. Third-Party Infrastructure',
    content: (
      <p>
        This website relies on third-party technology providers for services
        such as website hosting, backend infrastructure, database services,
        security, and media delivery. These providers may process limited
        technical information as necessary to provide their services and are
        subject to their own privacy policies and terms.
      </p>
    ),
  },
  {
    title: '6. Cookies',
    content: (
      <>
        <p>
          The public areas of this website are not intended to use cookies for
          advertising or behavioural profiling.
        </p>

        <p className="mt-4">
          The website's private administrative functionality may use strictly
          necessary authentication technologies to maintain secure
          administrator sessions.
        </p>

        <p className="mt-4">
          If analytics, advertising, or other tracking technologies are
          introduced in the future, this Privacy Policy may be updated
          accordingly.
        </p>
      </>
    ),
  },
  {
    title: '7. External Links',
    content: (
      <p>
        Projects and other sections of this website may contain links to
        external websites, source-code repositories, deployed applications,
        or third-party services. This Privacy Policy does not govern external
        websites.
      </p>
    ),
  },
  {
    title: '8. Data Retention',
    content: (
      <p>
        Information submitted through the website may be retained for as long
        as reasonably necessary to respond to an enquiry, maintain appropriate
        records, protect the website, or fulfil legitimate administrative
        purposes. Information that is no longer reasonably required may be
        deleted.
      </p>
    ),
  },
  {
    title: '9. Your Information',
    content: (
      <p>
        If you have submitted personal information through this website and
        would like to enquire about it, request a correction, or request
        deletion where applicable, you may contact me using the contact
        details provided on this website.
      </p>
    ),
  },
  {
    title: '10. Changes to This Privacy Policy',
    content: (
      <p>
        This Privacy Policy may be updated when the website, its functionality,
        or its data-processing practices change. The latest version will be
        published on this page with an updated revision date.
      </p>
    ),
  },
  {
    title: '11. Contact',
    content: (
      <>
        <p>
          Questions about this Privacy Policy or the handling of information
          submitted through this website may be sent through the contact page
          or the contact information provided on this website.
        </p>

        <p className="mt-4 font-semibold text-slate-900 dark:text-white">
          Samuel Mensah Quaye
          <br />
          Accra, Ghana
        </p>
      </>
    ),
  },
]

function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20 lg:py-24">
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 2026
        </p>

        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Samuel Mensah Quaye respects your privacy and is committed to
          handling personal information responsibly. This Privacy Policy
          explains how information may be collected, used, and protected when
          you visit this portfolio website.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              {section.title}
            </h2>

            <div className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

export default PrivacyPolicyPage