export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#10b981' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
  '& .MuiOutlinedInput-input': { fontSize: '0.85rem', py: 1.05 },
  '& .MuiOutlinedInput-input::placeholder': { fontSize: '0.85rem', color: '#9ca3af', opacity: 1 },
};

export const selectSx = {
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
  '& .MuiSelect-select': { fontSize: '0.85rem', py: 1.05 },
  '& .MuiSvgIcon-root': { fontSize: 18 },
};

export const sectionLabelSx = { fontWeight: 600, fontSize: '0.82rem', color: '#374151', mb: 1 };

export const sectionTitleSx = {
  fontWeight: 700,
  fontSize: '0.95rem',
  color: '#1f2937',
  mb: 2,
  mt: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  '&::before': { content: '""', width: 4, height: 18, bgcolor: '#10b981', borderRadius: 1, display: 'inline-block' },
};

export const quillBoxSx = {
  '& .ql-toolbar': { borderRadius: '8px 8px 0 0', borderColor: '#e5e7eb', fontSize: '0.85rem' },
  '& .ql-container': { borderRadius: '0 0 8px 8px', borderColor: '#e5e7eb', minHeight: 120, fontSize: '0.85rem' },
  '& .ql-editor': { minHeight: 120 },
};
