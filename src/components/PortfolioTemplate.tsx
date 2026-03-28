import { PortfolioData } from '@/types/portfolio';

interface Props {
  data: PortfolioData;
}

export default function PortfolioTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-light mb-4 tracking-tight">{data.name}</h1>
        <p className="text-xl text-gray-400 mb-8">{data.title}</p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          {data.contact.location && (
            <span className="text-gray-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {data.contact.location}
            </span>
          )}
          {data.contact.email && (
            <a href={`mailto:${data.contact.email}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {data.contact.email}
            </a>
          )}
          {data.contact.phone && (
            <a href={`tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {data.contact.phone}
            </a>
          )}
          {data.contact.website && (
            <a href={data.contact.website.startsWith('http') ? data.contact.website : `https://${data.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Website
            </a>
          )}
          {data.contact.linkedin && (
            <a 
              href={
                data.contact.linkedin.startsWith('http') 
                  ? data.contact.linkedin 
                  : data.contact.linkedin.includes('linkedin.com') 
                    ? `https://${data.contact.linkedin}`
                    : `https://linkedin.com/in/${data.contact.linkedin.replace(/^\/?in\//, '')}`
              }
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Summary */}
        {data.summary && (
          <section className="mb-16">
            <p className="text-gray-300 leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-tight">Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-4">
                    <h3 className="text-lg font-normal mb-1">{exp.role}</h3>
                    <p className="text-gray-400 mb-2">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {exp.dates}
                    {exp.location && ` — ${exp.location}`}
                  </p>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-400 text-sm flex gap-3">
                          <span className="text-gray-600">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-tight">Education</h2>
            <div className="space-y-8">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal mb-1">{edu.institution}</h3>
                  <p className="text-gray-400">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {edu.dates}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-light mb-8 tracking-tight">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-900 text-gray-300 rounded text-sm border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>
          Built with{' '}
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            CV to Web
          </a>
        </p>
      </footer>
    </div>
  );
}
