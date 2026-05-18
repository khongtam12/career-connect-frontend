import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import Stepper from "./components/Stepper";
import CompanyInfoStep from "./components/CompanyInfoStep";
import LegalInfoStep from "./components/LegalInfoStep";
import { saveCompany, saveVerification, getCompanyDetail, getUrl } from "../../../service/companyService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "../../../stores/useUserStore";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_LICENSE_SIZE = 5 * 1024 * 1024;
const TAX_CODE_REGEX = /^\d{10,13}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const WEBSITE_REGEX = /^https?:\/\/.+/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const primaryButtonSx = {
  backgroundColor: "#00b14f",
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "12px",
  minWidth: 154,
  px: 2.5,
  py: 1,
  fontSize: "0.95rem",
  whiteSpace: "nowrap",
  boxShadow: "0 14px 34px rgba(0, 177, 79, 0.18)",
  "&:hover": {
    backgroundColor: "#009a44",
    boxShadow: "0 18px 40px rgba(0, 154, 68, 0.24)",
  },
};

export default function RecruitmentAccountForm() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [currentStep, setCurrentStep] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyId: "",
    name: "",
    logo: "",
    taxCode: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    companySize: "",
    foundedYear: "",
    submittedTaxCode: "",
    businessLicense: "",
    note: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.companyId) {
        return;
      }

      try {
        setLoadingCompany(true);
        const company = await getCompanyDetail(user.companyId);
        setFormData((prev) => ({
          ...prev,
          companyId: company.id || user.companyId,
          name: company.name || "",
          logo: company.logo || "",
          taxCode: company.taxCode || "",
          website: company.website || "",
          email: company.email || "",
          phone: company.phone || "",
          address: company.address || "",
          description: company.description || "",
          companySize: company.companySize || "",
          foundedYear: company.foundedYear || "",
          submittedTaxCode: company.submittedTaxCode || company.taxCode || "",
          businessLicense: company.businessLicense || "",
          note: company.verificationNote || "",
        }));
      } catch (error) {
        console.error(error);
        toast.error("Không tải được thông tin công ty hiện tại");
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompany();
  }, [user?.companyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateStep1 = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Vui lòng nhập tên công ty";
    }

    if (!formData.taxCode.trim()) {
      nextErrors.taxCode = "Vui lòng nhập mã số thuế";
    } else if (!TAX_CODE_REGEX.test(formData.taxCode.trim())) {
      nextErrors.taxCode = "Mã số thuế phải gồm 10 đến 13 chữ số";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      nextErrors.phone = "Số điện thoại phải gồm 10 đến 15 chữ số";
    }

    if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = "Email không đúng định dạng";
    }

    if (formData.website.trim() && !WEBSITE_REGEX.test(formData.website.trim())) {
      nextErrors.website = "Website phải bắt đầu bằng http:// hoặc https://";
    }

    if (formData.companySize !== "" && Number(formData.companySize) <= 0) {
      nextErrors.companySize = "Quy mô công ty phải lớn hơn 0";
    }

    if (formData.foundedYear !== "") {
      const foundedYear = Number(formData.foundedYear);
      if (Number.isNaN(foundedYear) || foundedYear < 1800 || foundedYear > currentYear) {
        nextErrors.foundedYear = `Năm thành lập phải từ 1800 đến ${currentYear}`;
      }
    }

    if (logoFile && logoFile.size > MAX_LOGO_SIZE) {
      nextErrors.logo = "Logo phải nhỏ hơn hoặc bằng 2MB";
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!formData.submittedTaxCode.trim()) {
      nextErrors.submittedTaxCode = "Vui lòng nhập mã số thuế xác thực";
    } else if (!TAX_CODE_REGEX.test(formData.submittedTaxCode.trim())) {
      nextErrors.submittedTaxCode = "Mã số thuế xác thực phải gồm 10 đến 13 chữ số";
    }

    if (!formData.businessLicense.trim()) {
      nextErrors.businessLicense = "Vui lòng chọn giấy phép kinh doanh";
    }

    if (licenseFile && licenseFile.size > MAX_LICENSE_SIZE) {
      nextErrors.businessLicense = "Giấy phép kinh doanh phải nhỏ hơn hoặc bằng 5MB";
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) {
      return;
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadFileToS3 = async (file, folder) => {
    const key = `${folder}/${Date.now()}_${file.name}`;

    const { uploadUrl, fileUrl } = await getUrl({
      key,
      contentType: file.type,
    });

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return fileUrl;
  };

  const mapBackendErrors = (apiErrors = {}) => {
    setErrors((prev) => ({
      ...prev,
      ...apiErrors,
    }));

    const firstMessage = Object.values(apiErrors)[0];
    if (firstMessage) {
      toast.error(firstMessage);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    try {
      setSubmitting(true);

      let logoUrl = formData.logo;
      let licenseUrl = formData.businessLicense;

      if (logoFile) {
        logoUrl = await uploadFileToS3(logoFile, "company/logo");
      }

      if (licenseFile) {
        licenseUrl = await uploadFileToS3(licenseFile, "company/license");
      }

      if (!user?.userId) {
        toast.error("Bạn chưa đăng nhập");
        return;
      }

      const companyRes = await saveCompany({
        companyId: formData.companyId || user.companyId || "",
        name: formData.name.trim(),
        logo: logoUrl,
        taxCode: formData.taxCode.trim(),
        website: formData.website.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        companySize: formData.companySize === "" ? null : Number(formData.companySize),
        foundedYear: formData.foundedYear === "" ? null : Number(formData.foundedYear),
        employerId: user.userId,
      });

      await saveVerification({
        companyId: formData.companyId || companyRes.companyId,
        submittedTaxCode: formData.submittedTaxCode.trim(),
        businessLicense: licenseUrl,
        note: formData.note.trim(),
      });

      toast.success(formData.companyId ? "Cập nhật thông tin thành công" : "Tạo công ty thành công");
      navigate("/employer");
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.errors) {
        mapBackendErrors(err.response.data.errors);
        return;
      }
      toast.error("Lỗi cập nhật thông tin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4fff8_0%,#ffffff_38%,#f7faf8_100%)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Paper
            elevation={0}
            className="overflow-hidden rounded-[28px] border border-[#d8efe1] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]"
          >
            <div className="bg-[radial-gradient(circle_at_top_left,rgba(0,177,79,0.18),transparent_42%),linear-gradient(160deg,#163322_0%,#0f2017_100%)] p-6 text-white">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Building2 className="h-7 w-7" />
              </div>
              <Typography variant="overline" className="tracking-[0.28em] text-white/70">
                Employer Setup
              </Typography>
              <Typography variant="h4" className="mt-2 font-black leading-tight">
                Hoàn thiện hồ sơ nhà tuyển dụng
              </Typography>
              <Typography className="mt-4 text-sm leading-6 text-white/78">
                Bổ sung thông tin doanh nghiệp và giấy tờ pháp lý để bắt đầu đăng tuyển, quản lý chiến dịch và tăng độ tin cậy với ứng viên.
              </Typography>
            </div>

            <div className="space-y-4 p-6">
              <Chip
                label={currentStep === 1 ? "Bước 1/2: Công ty" : "Bước 2/2: Pháp lý"}
                sx={{
                  backgroundColor: "#e9fff2",
                  color: "#00833b",
                  fontWeight: 700,
                  borderRadius: "999px",
                }}
              />

              <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

              <Alert
                severity="info"
                sx={{
                  alignItems: "flex-start",
                  borderRadius: "18px",
                  border: "1px solid #d8efe1",
                  backgroundColor: "#f6fff9",
                  color: "#355343",
                  "& .MuiAlert-icon": {
                    color: "#00b14f",
                  },
                }}
              >
                {currentStep === 1
                  ? "Hãy chuẩn bị logo, thông tin liên hệ và mô tả ngắn gọn về công ty."
                  : "Tải lên giấy phép kinh doanh rõ nét để tăng tốc quá trình xác thực."}
              </Alert>
            </div>
          </Paper>

          <div className="space-y-6">
            <Paper
              elevation={0}
              className="rounded-[28px] border border-[#d8efe1] bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-8"
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} className="mb-6">
                <Box>
                  <Typography variant="h4" className="font-black text-slate-900">
                    {currentStep === 1 ? "Thông tin doanh nghiệp" : "Xác thực hồ sơ pháp lý"}
                  </Typography>
                  <Typography className="mt-2 text-sm text-slate-500">
                    {currentStep === 1
                      ? "Điền các thông tin cơ bản để hồ sơ công ty nhất quán và chuyên nghiệp."
                      : "Đối soát giấy tờ pháp lý để kích hoạt đầy đủ tính năng cho tài khoản tuyển dụng."}
                  </Typography>
                </Box>
                {loadingCompany && (
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-[#d8efe1] bg-[#f6fff9] px-4 py-3 text-sm font-medium text-slate-600">
                    <CircularProgress size={18} sx={{ color: "#00b14f" }} />
                    Đang tải dữ liệu công ty...
                  </div>
                )}
              </Stack>

              {currentStep === 1 ? (
                <CompanyInfoStep
                  errors={errors}
                  setLogoFile={setLogoFile}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ) : (
                <LegalInfoStep
                  errors={errors}
                  setLicenseFile={setLicenseFile}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
            </Paper>

            <Paper
              elevation={0}
              className="sticky bottom-5 rounded-[24px] border border-[#d8efe1] bg-white/95 px-5 py-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <ShieldCheck className="h-5 w-5 text-[#00b14f]" />
                  <span>Thông tin được lưu an toàn và chỉ dùng cho mục đích xác thực doanh nghiệp.</span>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outlined"
                    startIcon={<ArrowLeft size={16} />}
                    onClick={handlePrev}
                    disabled={currentStep === 1 || loadingCompany || submitting}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: "12px",
                      borderColor: "#d3e4da",
                      color: "#486255",
                      minWidth: 118,
                      px: 2,
                      py: 1,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        borderColor: "#00b14f",
                        backgroundColor: "#f6fff9",
                      },
                    }}
                  >
                    Quay lại
                  </Button>

                  <Button
                    variant="contained"
                    endIcon={currentStep === 2 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                    onClick={currentStep === 2 ? handleSubmit : handleNext}
                    disabled={loadingCompany || submitting}
                    sx={primaryButtonSx}
                  >
                    {submitting
                      ? "Đang lưu..."
                      : currentStep === 2
                        ? "Hoàn tất hồ sơ"
                        : "Tiếp tục"}
                  </Button>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}
