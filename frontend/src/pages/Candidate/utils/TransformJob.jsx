export function TransformJob(data) {
  return {
    id: data.jobId || data.id,
    title: data.title,
    companyId: data.company?.companyId || data.company?.id || data.companyId,
    industryId: data.industryDTO?.industryId || data.industryDTO?.id || data.industry?.id || data.industry?.industryId || data.industryId,
    logo: data.logo || data.company?.logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10",
    salary: `${new Intl.NumberFormat('vi-VN').format(data.salaryMin || 0)} - ${new Intl.NumberFormat('vi-VN').format(data.salaryMax || 0)} VND`,
    location: data.location,
    experience: data.experience,
    deadline: formatVietnamDate(data.deadline),
    salaryNegotiable:data.salaryNegotiable,
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

function isHtmlString(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function safeParse(json) {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not valid JSON, fallback to splitting by comma
  }
  return json.split(',').map(s => s.trim());
}

function toArray(str) {
  return str ? [str] : [];
}

function splitToArray(str) {
  if (!str) return [];
  if (isHtmlString(str)) return [str];
  return str.split(',').map(s => s.trim());
}
function formatVietnamDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}