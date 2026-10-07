const sections = [
  {
    title: '1. Purpose of This Website',
    content: (
      <p>
        This website is a professional portfolio created to present
        information about my software development experience, skills,
        projects, professional background, and related work. The website may
        also provide methods for contacting me regarding employment,
        projects, collaborations, professional opportunities, or other
        legitimate enquiries.
      </p>
    ),
  },
  {
    title: '2. Portfolio Content',
    content: (
      <p>
        Unless otherwise indicated, original written content, portfolio
        presentation, branding, graphics, and other original materials
        published on this website belong to Samuel Mensah Quaye. Certain
        technologies, trademarks, logos, screenshots, libraries, frameworks,
        and third-party materials displayed or referenced on the website
        remain the property of their respective owners.
      </p>
    ),
  },
  {
    title: '3. Software Projects and Source Code',
    content: (
      <>
        <p>
          Projects presented on this portfolio may include links to
          source-code repositories or live applications.
        </p>

        <p className="mt-4">
          Availability of a project on this portfolio does not automatically
          grant permission to copy, redistribute, sell, misrepresent, or claim
          ownership of its source code or other intellectual property.
        </p>

        <p className="mt-4">
          Where a source-code repository contains a specific software licence,
          use of that code is governed by the terms of that licence.
        </p>
      </>
    ),
  },
  {
    title: '4. Acceptable Use',
    content: (
      <>
        <p>You agree not to intentionally:</p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Attempt to gain unauthorized access to administrative areas,
            accounts, servers, databases, or other protected systems
          </li>
          <li>
            Interfere with the normal operation or security of the website
          </li>
          <li>Submit malicious code or harmful content</li>
          <li>
            Use automated systems to abuse the website or its contact
            functionality
          </li>
          <li>Attempt to circumvent security controls</li>
          <li>Impersonate another person when submitting information</li>
          <li>Use this website for unlawful activities</li>
        </ul>

        <p className="mt-4">
          Security research or testing against this website should not be
          performed without prior authorization.
        </p>
      </>
    ),
  },
  {
    title: '5. Accuracy of Information',
    content: (
      <p>
        Reasonable efforts are made to keep the information on this portfolio
        accurate and current. However, project details, professional
        information, technologies, links, availability, and other information
        may change over time. No guarantee is made that every piece of
        information will always be complete, current, or error-free.
      </p>
    ),
  },
  {
    title: '6. External Websites',
    content: (
      <p>
        This website may contain links to GitHub repositories, deployed
        applications, social networks, technology platforms, or other
        third-party websites. These external services are operated
        independently. I am not responsible for their content, availability,
        security, privacy practices, or terms.
      </p>
    ),
  },
  {
    title: '7. Availability',
    content: (
      <p>
        There is no guarantee that this website or any particular feature will
        always be available. The website may occasionally be unavailable
        because of maintenance, infrastructure changes, technical failures,
        security measures, or circumstances outside my control.
      </p>
    ),
  },
  {
    title: '8. Limitation of Liability',
    content: (
      <>
        <p>
          The website and its content are provided primarily for informational
          and professional portfolio purposes.
        </p>

        <p className="mt-4">
          To the extent permitted by applicable law, I am not responsible for
          losses or damages arising solely from reliance on information
          presented on this website, use of third-party links, or temporary
          unavailability of the website.
        </p>

        <p className="mt-4">
          Nothing in these Terms excludes or limits liability where doing so
          would be prohibited by applicable law.
        </p>
      </>
    ),
  },
  {
    title: '9. Privacy',
    content: (
      <p>
        Information submitted through this website is handled in accordance
        with the website's Privacy Policy. Visitors should review the Privacy
        Policy before submitting personal information through the contact
        form.
      </p>
    ),
  },
  {
    title: '10. Changes to These Terms',
    content: (
      <p>
        These Terms of Use may be updated as the website, its services, or
        applicable requirements change. The latest version will be published
        on this page with an updated revision date.
      </p>
    ),
  },
  {
    title: '11. Contact',
    content: (
      <>
        <p>
          Questions regarding these Terms of Use may be submitted through the
          contact information provided on this website.
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

function TermsOfUsePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20 lg:py-24">
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Terms of Use
        </h1>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 2026
        </p>

        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          These Terms of Use govern your use of the portfolio website of
          Samuel Mensah Quaye. By accessing or using this website, you agree
          to use it in accordance with these terms.
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

export default TermsOfUsePage