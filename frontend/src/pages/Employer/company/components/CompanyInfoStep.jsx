import React from "react";
import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Building,
  Calendar,
  CreditCard,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#fbfefc",
    "& fieldset": {
      borderColor: "#d8efe1",
    },
    "&:hover fieldset": {
      borderColor: "#7cc89a",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00b14f",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00833b",
  },
};

export default function CompanyInfoStep({ formData, handleInputChange, setLogoFile, errors = {} }) {
  return (
    <Box className="space-y-8">
      <div className="grid gap-4 rounded-[24px] bg-[linear-gradient(135deg,#f4fff8_0%,#ffffff_100%)] p-5 md:grid-cols-[120px_minmax(0,1fr)] md:items-center">
        <div className="flex justify-center md:justify-start">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#bfe5ce] bg-white shadow-sm">
            {formData.logo ? (
              <img src={formData.logo} alt="logo" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 text-slate-300" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Typography variant="h6" className="font-black text-slate-900">
              Nhận diện thương hiệu công ty
            </Typography>
            <Typography className="mt-1 text-sm text-slate-500">
              Tải logo rõ nét để trang hồ sơ nhà tuyển dụng trông chuyên nghiệp và dễ nhận diện hơn.
            </Typography>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setLogoFile(file);
                const previewUrl = URL.createObjectURL(file);

                handleInputChange({
                  target: {
                    name: "logo",
                    value: previewUrl,
                  },
                });
              }}
              className="hidden"
              id="logoUpload"
            />

            <label htmlFor="logoUpload">
              <Button
                component="span"
                variant="contained"
                sx={{
                  backgroundColor: "#00b14f",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "999px",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "#009a44",
                  },
                }}
              >
                {formData.logo ? "Đổi logo" : "Tải logo"}
              </Button>
            </label>

            <Typography className="text-xs text-slate-400">
              PNG, JPG hoặc WEBP, tối đa 2MB
            </Typography>
          </div>

          {errors.logo && <FormHelperText error>{errors.logo}</FormHelperText>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            fullWidth
            label="Tên công ty"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Nhập đúng tên theo giấy phép kinh doanh"
            required
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Building size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Mã số thuế"
            name="taxCode"
            value={formData.taxCode}
            onChange={handleInputChange}
            error={!!errors.taxCode}
            helperText={errors.taxCode}
            placeholder="Nhập mã số thuế công ty"
            required
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="Nhập số liên hệ chính"
            required
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Email công ty"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="company@email.com"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            error={!!errors.website}
            helperText={errors.website}
            placeholder="https://company.com"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Globe size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Quy mô nhân sự"
            name="companySize"
            type="number"
            value={formData.companySize}
            onChange={handleInputChange}
            error={!!errors.companySize}
            helperText={errors.companySize}
            placeholder="Ví dụ: 50"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Users size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Năm thành lập"
            name="foundedYear"
            type="number"
            value={formData.foundedYear}
            onChange={handleInputChange}
            error={!!errors.foundedYear}
            helperText={errors.foundedYear}
            placeholder="Ví dụ: 2020"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className="md:col-span-2">
          <TextField
            fullWidth
            label="Địa chỉ trụ sở"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
            placeholder="Nhập địa chỉ công ty"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPin size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className="md:col-span-2">
          <TextField
            fullWidth
            label="Mô tả về công ty"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            minRows={5}
            placeholder="Chia sẻ ngắn gọn về lĩnh vực hoạt động, văn hóa và điểm mạnh của công ty..."
            sx={fieldSx}
          />
        </div>
      </div>
    </Box>
  );
}
