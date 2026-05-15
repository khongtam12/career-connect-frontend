import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Stepper from './components/Stepper';
import CompanyInfoStep from './components/CompanyInfoStep';
import LegalInfoStep from './components/LegalInfoStep';
import { saveCompany, saveVerification, getCompanyDetail, getUrl } from '../../../service/companyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserStore } from '../../../stores/useUserStore';

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_LICENSE_SIZE = 5 * 1024 * 1024;
const TAX_CODE_REGEX = /^\d{10,13}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const WEBSITE_REGEX = /^https?:\/\/.+/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecruitmentAccountForm() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [currentStep, setCurrentStep] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    logo: '',
    taxCode: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    companySize: '',
    foundedYear: '',
    submittedTaxCode: '',
    businessLicense: '',
    note: '',
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
          name: company.name || '',
          logo: company.logo || '',
          taxCode: company.taxCode || '',
          website: company.website || '',
          email: company.email || '',
          phone: company.phone || '',
          address: company.address || '',
          description: company.description || '',
          companySize: company.companySize || '',
          foundedYear: company.foundedYear || '',
          submittedTaxCode: company.submittedTaxCode || company.taxCode || '',
          businessLicense: company.businessLicense || '',
          note: company.verificationNote || '',
        }));
      } catch (error) {
        console.error(error);
        toast.error('Khong tai duoc thong tin cong ty hien tai');
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
      [name]: '',
    }));
  };

  const validateStep1 = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Vui long nhap ten cong ty';
    }

    if (!formData.taxCode.trim()) {
      nextErrors.taxCode = 'Vui long nhap ma so thue';
    } else if (!TAX_CODE_REGEX.test(formData.taxCode.trim())) {
      nextErrors.taxCode = 'Ma so thue phai gom 10 den 13 chu so';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Vui long nhap so dien thoai';
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      nextErrors.phone = 'So dien thoai phai gom 10 den 15 chu so';
    }

    if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'Email khong dung dinh dang';
    }

    if (formData.website.trim() && !WEBSITE_REGEX.test(formData.website.trim())) {
      nextErrors.website = 'Website phai bat dau bang http:// hoac https://';
    }

    if (formData.companySize !== '' && Number(formData.companySize) <= 0) {
      nextErrors.companySize = 'Quy mo cong ty phai lon hon 0';
    }

    if (formData.foundedYear !== '') {
      const foundedYear = Number(formData.foundedYear);
      if (Number.isNaN(foundedYear) || foundedYear < 1800 || foundedYear > currentYear) {
        nextErrors.foundedYear = `Nam thanh lap phai tu 1800 den ${currentYear}`;
      }
    }

    if (logoFile && logoFile.size > MAX_LOGO_SIZE) {
      nextErrors.logo = 'Logo phai nho hon hoac bang 2MB';
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!formData.submittedTaxCode.trim()) {
      nextErrors.submittedTaxCode = 'Vui long nhap ma so thue xac thuc';
    } else if (!TAX_CODE_REGEX.test(formData.submittedTaxCode.trim())) {
      nextErrors.submittedTaxCode = 'Ma so thue xac thuc phai gom 10 den 13 chu so';
    }

    if (!formData.businessLicense.trim()) {
      nextErrors.businessLicense = 'Vui long chon giay phep kinh doanh';
    }

    if (licenseFile && licenseFile.size > MAX_LICENSE_SIZE) {
      nextErrors.businessLicense = 'Giay phep kinh doanh phai nho hon hoac bang 5MB';
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
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
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
      let logoUrl = formData.logo;
      let licenseUrl = formData.businessLicense;

      if (logoFile) {
        logoUrl = await uploadFileToS3(logoFile, 'company/logo');
      }

      if (licenseFile) {
        licenseUrl = await uploadFileToS3(licenseFile, 'company/license');
      }

      if (!user?.userId) {
        toast.error('Ban chua dang nhap');
        return;
      }

      const companyRes = await saveCompany({
        companyId: formData.companyId || user.companyId || '',
        name: formData.name.trim(),
        logo: logoUrl,
        taxCode: formData.taxCode.trim(),
        website: formData.website.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        companySize: formData.companySize === '' ? null : Number(formData.companySize),
        foundedYear: formData.foundedYear === '' ? null : Number(formData.foundedYear),
        employerId: user.userId,
      });

      await saveVerification({
        companyId: formData.companyId || companyRes.companyId,
        submittedTaxCode: formData.submittedTaxCode.trim(),
        businessLicense: licenseUrl,
        note: formData.note.trim(),
      });

      toast.success(formData.companyId ? 'Cap nhat thong tin thanh cong' : 'Tao cong ty thanh cong');
      navigate('/employer');
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.errors) {
        mapBackendErrors(err.response.data.errors);
        return;
      }
      toast.error('Loi cap nhat thong tin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4 text-purple-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 text-transparent bg-clip-text mb-3">
            Hoan thien tai khoan tuyen dung
          </h1>
          <p className="text-slate-500">
            Chi vai buoc de bat dau tuyen dung
          </p>
        </div>

        <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8 mb-8">
          {currentStep === 1 && (
            <CompanyInfoStep
              errors={errors}
              setLogoFile={setLogoFile}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <LegalInfoStep
              errors={errors}
              setLicenseFile={setLicenseFile}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow sticky bottom-6">
          <button
            onClick={handlePrev}
            className={`${currentStep === 1 ? 'opacity-0' : ''}`}
          >
            Quay lai
          </button>

          <button
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            disabled={loadingCompany}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-60"
          >
            {loadingCompany ? 'Dang tai...' : currentStep === 2 ? 'Hoan tat' : 'Tiep tuc'}
            {!loadingCompany && (
              currentStep === 2
                ? <CheckCircle2 className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
