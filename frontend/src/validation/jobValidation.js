const stripHtml = (value) => String(value || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const parseCurrency = (value) => {
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
};

export const validateJobForm = (formData, { requireSubscription }) => {
  const errors = {};

  const titleValue = String(formData.title || '').trim();
  const addressValue = String(formData.address || '').trim();
  const wardValue = String(formData.ward || '').trim();
  const addressDetailValue = String(formData.addressDetail || '').trim();
  const experienceValue = String(formData.experience || '').trim();
  const ageRangeValue = String(formData.ageRange || '').trim();

  const hasLetter = /[A-Za-z\u00C0-\u1EF9]/;
  const titleRegex = /^[A-Za-z0-9\u00C0-\u1EF9\s\-_.(),/&+]+$/;
  const addressRegex = /^[A-Za-z0-9\u00C0-\u1EF9\s\-_.(),/#&]+$/;
  const ageRangeRegex = /^(\d{2})(?:\s*-\s*(\d{2}))?$/;

  const requireText = (field, label) => {
    if (!String(formData[field] || '').trim()) {
      errors[field] = `Vui lòng nhập ${label}.`;
    }
  };

  if (requireSubscription && !formData.companySubscriptionId) {
    errors.companySubscriptionId = 'Vui lòng chọn gói tin đã mua.';
  }

  requireText('title', 'tiêu đề vị trí');
  requireText('industry', 'ngành nghề');
  requireText('address', 'tỉnh/thành làm việc');
  requireText('ward', 'phường/xã làm việc');
  requireText('addressDetail', 'địa chỉ cụ thể');
  requireText('jobType', 'loại hình công việc');
  requireText('experience', 'kinh nghiệm yêu cầu');
  requireText('rank', 'cấp bậc');
  requireText('education', 'học vấn');
  requireText('ageRange', 'độ tuổi yêu cầu');

  if (titleValue) {
    if (titleValue.length < 5 || titleValue.length > 100) {
      errors.title = 'Tiêu đề cần từ 5-100 ký tự.';
    } else if (!hasLetter.test(titleValue) || !titleRegex.test(titleValue)) {
      errors.title = 'Tiêu đề chỉ gồm chữ, số và ký tự cơ bản.';
    }
  }

  if (addressValue) {
    if (addressValue.length < 2 || addressValue.length > 120) {
      errors.address = 'Tỉnh/thành cần từ 2-120 ký tự.';
    } else if (!hasLetter.test(addressValue) || !addressRegex.test(addressValue)) {
      errors.address = 'Tỉnh/thành chỉ gồm chữ, số và ký tự cơ bản.';
    }
  }

  if (wardValue) {
    if (wardValue.length < 2 || wardValue.length > 120) {
      errors.ward = 'Phường/xã cần từ 2-120 ký tự.';
    } else if (!hasLetter.test(wardValue) || !addressRegex.test(wardValue)) {
      errors.ward = 'Phường/xã chỉ gồm chữ, số và ký tự cơ bản.';
    }
  }

  if (addressDetailValue) {
    if (addressDetailValue.length < 3 || addressDetailValue.length > 200) {
      errors.addressDetail = 'Địa chỉ cụ thể cần từ 3-200 ký tự.';
    } else if (!addressRegex.test(addressDetailValue)) {
      errors.addressDetail = 'Địa chỉ cụ thể chỉ gồm chữ, số và ký tự cơ bản.';
    }
  }

  if (!experienceValue) {
    errors.experience = 'Vui lòng nhập kinh nghiệm yêu cầu.';
  }

  if (ageRangeValue) {
    const match = ageRangeRegex.exec(ageRangeValue);
    if (!match) {
      errors.ageRange = 'Độ tuổi theo dạng “18” hoặc “18-35”.';
    } else {
      const minAge = Number(match[1]);
      const maxAge = match[2] ? Number(match[2]) : null;
      if (minAge < 18 || minAge > 60) {
        errors.ageRange = 'Độ tuổi tối thiểu phải từ 18-60.';
      }
      if (maxAge !== null && (maxAge > 60 || minAge >= maxAge)) {
        errors.ageRange = 'Độ tuổi phải hợp lệ và tối đa không quá 60.';
      }
    }
  }

  const deadlineValue = String(formData.deadline || '').trim();
  if (!deadlineValue) {
    errors.deadline = 'Vui lòng chọn hạn nộp hồ sơ.';
  } else if (Number.isNaN(new Date(deadlineValue).getTime())) {
    errors.deadline = 'Hạn nộp không hợp lệ.';
  } else {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadlineDate = new Date(deadlineValue);
    if (deadlineDate < normalizedToday) {
      errors.deadline = 'Hạn nộp phải từ hôm nay trở đi.';
    }
  }

  const quantityValue = Number(formData.quantity);
  if (!quantityValue || quantityValue <= 0) {
    errors.quantity = 'Số lượng tuyển phải lớn hơn 0.';
  } else if (!Number.isInteger(quantityValue)) {
    errors.quantity = 'Số lượng tuyển phải là số nguyên.';
  }

  const descriptionText = stripHtml(formData.description);
  if (!descriptionText) {
    errors.description = 'Vui lòng nhập mô tả công việc.';
  }

  if (!formData.salaryNegotiable) {
    const minValue = parseCurrency(formData.salaryMin);
    const maxValue = parseCurrency(formData.salaryMax);

    if (!minValue) {
      errors.salaryMin = 'Vui lòng nhập lương tối thiểu.';
    }
    if (!maxValue) {
      errors.salaryMax = 'Vui lòng nhập lương tối đa.';
    }
    if (minValue && maxValue && minValue > maxValue) {
      errors.salaryMax = 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.';
    }
  }

  return errors;
};
