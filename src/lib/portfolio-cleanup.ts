import type { PortfolioData } from '@/types/portfolio';

const trimOrUndefined = (value?: string) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const trimString = (value: string) => value.trim();

export function cleanPortfolioDataForPublish(data: PortfolioData): PortfolioData {
  return {
    ...data,
    name: trimString(data.name),
    title: trimString(data.title),
    summary: trimString(data.summary),
    skills: data.skills.map(trimString).filter((skill) => skill.length > 0),
    experience: data.experience.map((exp) => ({
      ...exp,
      company: trimString(exp.company),
      role: trimString(exp.role),
      dates: trimString(exp.dates),
      location: trimOrUndefined(exp.location),
      bullets: exp.bullets.map(trimString).filter((bullet) => bullet.length > 0),
    })),
    education: data.education.map((edu) => ({
      ...edu,
      institution: trimString(edu.institution),
      degree: trimString(edu.degree),
      field: trimOrUndefined(edu.field),
      dates: trimString(edu.dates),
      location: trimOrUndefined(edu.location),
    })),
    contact: {
      email: trimOrUndefined(data.contact.email),
      phone: trimOrUndefined(data.contact.phone),
      linkedin: trimOrUndefined(data.contact.linkedin),
      website: trimOrUndefined(data.contact.website),
      location: trimOrUndefined(data.contact.location),
    },
  };
}
