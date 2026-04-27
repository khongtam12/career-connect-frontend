import React, { useEffect, useMemo, useState } from 'react';
import useCompanyApprovalStore from '@/stores/useCompanyApprovalStore';
import ApprovalDetailModal from './ApprovalDetailModal';
import { 
    Box, 
    Typography, 
    Button, 
    Chip,
    Paper,
    Container
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const PendingApprovals = () => {
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
                header: 'Tên công ty',
                size: 250,
                Cell: ({ cell }) => (
                    <Typography variant="body2" fontWeight="600" color="primary.main">
                        {cell.getValue()}
                    </Typography>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Ngày yêu cầu',
                Cell: ({ cell }) => cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy HH:mm') : 'N/A',
            },
            {
                accessorKey: 'requestedBy',
                header: 'Người yêu cầu',
                Cell: () => <Chip label="Nhà tuyển dụng" size="small" variant="outlined" color="info" />,
            },
            {
                id: 'actions',
                header: 'Hành động',
                Cell: ({ row }) => (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                            setSelectedId(row.original.id);
                            setIsModalOpen(true);
                        }}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Xem chi tiết
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
        enableColumnFilters: false,
        enablePagination: true,
        enableSorting: true,
        renderTopToolbarCustomActions: () => (
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                Danh sách công ty chờ duyệt
            </Typography>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
            },
        },
    });

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
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
        </Container>
    );
};

export default PendingApprovals;
