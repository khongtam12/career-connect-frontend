import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Pagination,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import JobStatusChip from './JobStatusChip';
import JobTypeChip from './JobTypeChip';
import JobActionMenu from './JobActionMenu';

// Header styling chung
const headCellSx = {
  fontWeight: 600,
  fontSize: '0.8rem',
  color: '#374151',
  whiteSpace: 'nowrap',
  py: 1.5,
  borderBottom: '2px solid #e5e7eb',
  bgcolor: '#f9fafb',
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#374151',
  py: 1.8,
  borderBottom: '1px solid #f3f4f6',
};

function parseDeadlineToDate(deadline) {
  if (!deadline || typeof deadline !== 'string') return null;

  const value = deadline.trim();
  if (!value || value.toLowerCase() === 'chưa cập nhật') return null;

  const viMatch = value.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
  if (viMatch) {
    const day = Number(viMatch[1]);
    const monthIndex = Number(viMatch[2]) - 1;
    const year = Number(viMatch[3]);

    // Hạn nộp thường là theo ngày → coi hết hạn sau 23:59:59
    const date = new Date(year, monthIndex, day, 23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Fallback: ISO hoặc format khác
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isDeadlineExpired(deadline) {
  const date = parseDeadlineToDate(deadline);
  if (!date) return false;
  return date.getTime() < Date.now();
}

export default function JobTable({
  jobs = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onPushTop,
  onDelete,
  onChangeStatus,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, borderColor: '#e5e7eb', overflow: 'hidden' }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, minWidth: 250 }}>
                Vị trí tuyển dụng
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 200 }}>
                Địa điểm
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>
                Loại hình
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>
                Mức lương
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 70 }}>
                Ứng viên
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 70 }}>
                Lượt xem
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 110 }}>
                Hạn nộp
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 60 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Không có tin tuyển dụng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  {/* Vị trí tuyển dụng */}
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: 1.4,
                        }}
                      >
                        {job.title}
                      </Typography>
                      {job.isTop && (
                        <Chip
                          label="TOP"
                          size="small"
                          sx={{
                            bgcolor: '#fef3c7',
                            color: '#d97706',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 20,
                            borderRadius: '4px',
                            border: '1px solid #fde68a',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Địa điểm */}
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <LocationOnOutlinedIcon
                        sx={{ fontSize: 16, color: '#9ca3af', mt: 0.2, flexShrink: 0 }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          color: '#6b7280',
                          lineHeight: 1.4,
                        }}
                      >
                        {job.location}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Loại hình */}
                  <TableCell sx={bodyCellSx}>
                    <JobTypeChip type={job.type} />
                  </TableCell>

                  {/* Mức lương */}
                  <TableCell sx={bodyCellSx}>
                    <Box
                      sx={{
                        bgcolor: '#f0fdf4',
                        color: '#16a34a',
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 1.5,
                        display: 'inline-block',
                        textAlign: 'center',
                      }}
                    >
                      {job.salaryNegotiable ? (
                        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          Thỏa thuận
                        </Typography>
                      ) : (
                        <>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.2 }}>
                            {Math.round((job.salaryMin || 0) / 1_000_000)} - {Math.round((job.salaryMax || 0) / 1_000_000)}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>triệu</Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>

                  {/* Ứng viên */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <PersonOutlineIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {job.applicants}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Lượt xem */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {job.views}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Hạn nộp */}
                  <TableCell sx={bodyCellSx}>
                    {(() => {
                      const expired = isDeadlineExpired(job.deadline);
                      const color = expired ? 'red' : '#6b7280';

                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayOutlinedIcon
                            sx={{ fontSize: 14, color }}
                          />
                          <Typography sx={{ fontSize: '0.82rem', color }}>
                            {job.deadline}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell sx={bodyCellSx}>
                    <JobStatusChip status={job.status} />
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <JobActionMenu
                      job={job}
                      onEdit={onEdit}
                      onPushTop={onPushTop}
                      onDelete={onDelete}
                      onChangeStatus={onChangeStatus}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => onPageChange?.(val)}
          shape="rounded"
          size="small"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              '&.Mui-selected': {
                bgcolor: '#10b981',
                color: '#fff',
                '&:hover': { bgcolor: '#059669' },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
