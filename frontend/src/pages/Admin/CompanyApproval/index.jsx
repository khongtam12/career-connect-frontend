import React, { useEffect, useMemo, useState } from 'react';
import useCompanyApprovalStore from '@/stores/useCompanyApprovalStore';
import ApprovalDetailModal from './ApprovalDetailModal';
import {
    Box, 
    Typography, 
    Button, 
    Chip,
    Avatar,
    Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { 
    Visibility as VisibilityIcon,
    Business as BusinessIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CompanyApproval = () => {
    const { pendingList, loading, fetchPending } = useCompanyApprovalStore();
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Công ty',
                size: 300,
                Cell: ({ row, cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: 'primary.50', color: 'primary.main', border: '1px solid #e0e0e0' }}>
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="700" color="text.primary">
                                {cell.getValue()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {row.original.id}
                            </Typography>
                        </Box>
                    </Box>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Ngày gửi hồ sơ',
                size: 200,
                Cell: ({ cell }) => (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                            {cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Typography>
                    </Stack>
                ),
            },
            {
                accessorKey: 'requestedBy',
                header: 'Nguồn yêu cầu',
                size: 150,
                Cell: () => <Chip label="Nhà tuyển dụng" size="small" variant="tonal" color="info" sx={{ fontWeight: '600' }} />,
            },
            {
                id: 'actions',
                header: 'Thao tác',
                size: 150,
                Cell: ({ row }) => (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                            setSelectedId(row.original.id);
                            setIsModalOpen(true);
                        }}
                        sx={{ 
                            textTransform: 'none', 
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                        }}
                    >
                        Xem hồ sơ
                    </Button>
                ),
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: pendingList,
        state: { isLoading: loading },
        enableColumnActions: false,
        enableColumnFilters: true,
        enablePagination: true,
        enableSorting: true,
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                overflow: 'hidden'
            },
        },
        muiTableHeadCellProps: {
            sx: {
                bgcolor: '#f8f9fa',
                color: '#5c5c5c',
                fontWeight: '700',
                py: 2
            },
        },
    });

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
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
                        color="warning" 
                        variant="filled" 
                        sx={{ fontWeight: 'bold', borderRadius: '8px' }} 
                    />
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => fetchPending()}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: '#e5e7eb',
                        color: '#374151',
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

            <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden', mb: 4 }}>
                <MaterialReactTable table={table} />
            </Box>

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
