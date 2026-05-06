export function TransformJob(data) {
  return {
    id: data.jobId || data.id,
    title: data.title,
    companyId: data.company?.companyId || data.company?.id || data.companyId,
    industryId: data.industryDTO?.industryId || data.industryDTO?.id || data.industry?.id || data.industry?.industryId || data.industryId,

    salary: `${data.salaryMin} - ${data.salaryMax} USD`,
    location: data.location,
    experience: data.experience,
    deadline: data.deadline,

    requirements: safeParse(data.requirementTags),
    benefits: safeParse(data.benefitTags),
    specialties: safeParse(data.specialties),
    relatedCategories: safeParse(data.relatedCategories),
    skills: safeParse(data.skills),

    description: toArray(data.description),
    candidateRequirements: splitToArray(data.candidateRequirements),
    salaryDetail: toArray(data.salaryDetail),
    benefitsDetail: toArray(data.benefitsDetail),
    workSchedule: toArray(data.workSchedule),

    company: data.company?.name,
    companySize: data.company?.companySize,
    companyAddress: data.company?.address,
    companyField: data.industryDTO?.name,

    rank: data.rank,
    education: data.education,
    quantity: data.quantity,
    workForm: data.jobType,
  };
}

// ── helper functions ──

function safeParse(json) {
  try {
    return JSON.parse(json || "[]");
  } catch {
    return [];
  }
}

function toArray(str) {
  return str ? [str] : [];
}

function splitToArray(str) {
  return str ? str.split(',').map(s => s.trim()) : [];
}