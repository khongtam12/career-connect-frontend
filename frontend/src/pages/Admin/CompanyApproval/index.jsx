import React, { useEffect, useState } from 'react';
import useCompanyApprovalStore from '@/stores/useCompanyApprovalStore';
import ApprovalDetailModal from './ApprovalDetailModal';
import {
    Box, 
    Typography, 
    Button, 
    Chip,
    Avatar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    Pagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
    Visibility as VisibilityIcon,
    Business as BusinessIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const headCellSx = {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#374151',
    whiteSpace: 'nowrap',
    py: 2,
    borderBottom: '2px solid #e5e7eb',
    bgcolor: '#f9fafb',
};

const bodyCellSx = {
    fontSize: '0.85rem',
    color: '#374151',
    py: 2,
    borderBottom: '1px solid #f3f4f6',
};

const ITEMS_PER_PAGE = 10;

const CompanyApproval = () => {
    const { pendingList, loading, fetchPending } = useCompanyApprovalStore();
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleRefresh = () => {
        setPage(1);
        fetchPending();
    };

    const totalPages = Math.ceil(pendingList.length / ITEMS_PER_PAGE) || 1;
    const paginatedList = pendingList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                        Phê duyệt Công ty
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Quản lý và thẩm định hồ sơ pháp lý của các doanh nghiệp mới tham gia hệ thống
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                        label={`${pendingList.length} yêu cầu chờ duyệt`} 
                        sx={{ 
                            fontWeight: 'bold', 
                            borderRadius: '8px',
                            height: 32,
                            px: 1,
                            backgroundColor: '#fff7ed',
                            color: '#c2410c',
                            border: '1px solid #ffedd5'
                        }} 
                    />
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            borderColor: '#e5e7eb',
                            color: '#374151',
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb',
                            },
                        }}
                    >
                        Làm mới
                    </Button>
                </Box>
            </Box>

            {/* Table Section */}
            <Paper 
                variant="outlined" 
                sx={{ 
                    borderRadius: '16px', 
                    borderColor: '#e5e7eb', 
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
            >
                <TableContainer>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...headCellSx, pl: 3 }}>Công ty</TableCell>
                                <TableCell sx={headCellSx}>Ngày gửi hồ sơ</TableCell>
                                <TableCell sx={headCellSx}>Nguồn yêu cầu</TableCell>
                                <TableCell sx={{ ...headCellSx, pr: 3, textAlign: 'center' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={4} sx={{ px: 3, py: 2 }}>
                                            <Skeleton variant="text" height={40} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Không có yêu cầu phê duyệt nào đang chờ
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedList.map((company) => (
                                    <TableRow key={company.id} hover sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                        <TableCell sx={{ ...bodyCellSx, pl: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    variant="rounded" 
                                                    sx={{ 
                                                        bgcolor: '#eff6ff', 
                                                        color: '#2563eb', 
                                                        border: '1px solid #dbeafe',
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <BusinessIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" color="#111827">
                                                        {company.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                        ID: {company.id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={bodyCellSx}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TimeIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                                                <Typography variant="body2">
                                                    {company.createdAt ? format(new Date(company.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={bodyCellSx}>
                                            <Chip 
                                                label="Nhà tuyển dụng" 
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: '600', 
                                                    fontSize: '0.75rem',
                                                    bgcolor: '#f0f9ff',
                                                    color: '#0369a1',
                                                    border: '1px solid #e0f2fe'
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell sx={{ ...bodyCellSx, pr: 3, textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                                onClick={() => {
                                                    setSelectedId(company.id);
                                                    setIsModalOpen(true);
                                                }}
                                                sx={{ 
                                                    textTransform: 'none', 
                                                    borderRadius: '8px',
                                                    boxShadow: 'none',
                                                    px: 2,
                                                    bgcolor: '#111827',
                                                    '&:hover': { bgcolor: '#1f2937', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                                                }}
                                            >
                                                Xem hồ sơ
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination Section */}
                {!loading && totalPages > 1 && (
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6' }}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={(_, v) => setPage(v)}
                            shape="rounded"
                            size="small"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontWeight: 600,
                                    '&.Mui-selected': {
                                        bgcolor: '#111827',
                                        color: '#fff',
                                        '&:hover': { bgcolor: '#1f2937' }
                                    }
                                }
                            }}
                        />
                    </Box>
                )}
            </Paper>

            <ApprovalDetailModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedId(null);
                }}
                companyId={selectedId}
            />
        </Box>
    );
};

export default CompanyApproval;
