import React, { useState } from "react";
import { Box, Button, FormHelperText, InputAdornment, Link, TextField, Typography } from "@mui/material";
import { CheckCircle2, FileText, Link2, UploadCloud } from "lucide-react";

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

export default function LegalInfoStep({ formData, handleInputChange, setLicenseFile, errors = {} }) {
  const [uploading] = useState(false);

  const displayLicenseName = typeof formData.businessLicense === "string"
    ? formData.businessLicense.split("/").pop()
    : "";

  return (
    <Box className="space-y-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <TextField
            fullWidth
            label="Mã số thuế xác thực"
            name="submittedTaxCode"
            value={formData.submittedTaxCode || ""}
            onChange={handleInputChange}
            error={!!errors.submittedTaxCode}
            helperText={errors.submittedTaxCode}
            placeholder="Nhập MST để đối soát pháp lý"
            required
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircle2 size={18} className="text-[#00b14f]" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Ghi chú xác thực"
            name="note"
            value={formData.note || ""}
            onChange={handleInputChange}
            error={!!errors.note}
            helperText={errors.note}
            placeholder="Ví dụ: Giấy phép vừa được cấp lại"
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FileText size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-dashed border-[#bfe5ce] bg-[linear-gradient(180deg,#f7fff9_0%,#ffffff_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Typography variant="h6" className="font-black text-slate-900">
              Giấy phép kinh doanh
            </Typography>
            <Typography className="mt-2 text-sm leading-6 text-slate-500">
              Tải lên bản scan hoặc PDF rõ nét. Hồ sơ càng rõ ràng thì đội ngũ xác thực càng xử lý nhanh hơn.
            </Typography>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9fff2] text-[#00b14f]">
            <UploadCloud className="h-8 w-8" />
          </div>
        </div>

        <div className="mt-6 rounded-[20px] border border-[#d8efe1] bg-white p-5 shadow-sm">
          {formData.businessLicense ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#d8efe1] bg-[#f6fff9] px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-[#00b14f]" />
                <span className="text-sm font-semibold text-slate-700">{displayLicenseName || "Đã chọn file"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={formData.businessLicense}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  className="inline-flex items-center gap-2 text-sm !text-[#00833b]"
                >
                  <Link2 className="h-4 w-4" />
                  Xem tài liệu hiện tại
                </Link>

                <Typography className="text-xs text-slate-400">
                  Định dạng hỗ trợ: PNG, JPG, PDF. Dung lượng tối đa 5MB.
                </Typography>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <Typography variant="h6" className="font-bold text-slate-900">
                {uploading ? "Đang xử lý tệp..." : "Tải lên giấy phép kinh doanh"}
              </Typography>
              <Typography className="text-sm text-slate-500">
                Hỗ trợ PNG, JPG hoặc PDF với dung lượng tối đa 5MB.
              </Typography>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              id="licenseUpload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setLicenseFile(file);
                handleInputChange({
                  target: {
                    name: "businessLicense",
                    value: file.name,
                  },
                });
              }}
            />

            <label htmlFor="licenseUpload">
              <Button
                component="span"
                variant="contained"
                sx={{
                  backgroundColor: "#00b14f",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "999px",
                  px: 2.75,
                  "&:hover": {
                    backgroundColor: "#009a44",
                  },
                }}
              >
                {formData.businessLicense ? "Chọn file khác" : "Chọn file ngay"}
              </Button>
            </label>

            <Typography className="text-xs text-slate-400">
              Đảm bảo thông tin trên giấy phép trùng khớp với hồ sơ doanh nghiệp.
            </Typography>
          </div>

          {errors.businessLicense && <FormHelperText error sx={{ mt: 1.5 }}>{errors.businessLicense}</FormHelperText>}
        </div>
      </div>
    </Box>
  );
}
