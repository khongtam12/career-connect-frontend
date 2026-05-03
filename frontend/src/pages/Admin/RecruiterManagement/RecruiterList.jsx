import React, { useEffect, useMemo, useState } from 'react';
import useRecruiterStore from '@/stores/useRecruiterStore';
import RecruiterStatusSwitch from './RecruiterStatusSwitch';
import RecruiterDeleteConfirm from './RecruiterDeleteConfirm';
import {
    Box,
    Typography,
    Paper,
    Container,
    IconButton,
    Tooltip
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Delete as DeleteIcon } from '@mui/icons-material';

const RecruiterList = () => {
    const { recruiters, loading, fetchRecruiters } = useRecruiterStore();
    
    const [deleteState, setDeleteState] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetchRecruiters(0, 10);
    }, [fetchRecruiters]);

    const columns = useMemo(
        () => [
            { header: 'Tên', accessorKey: 'username' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Công ty', accessorKey: 'companyName' },
            { 
                header: 'Trạng thái', 
                accessorKey: 'status',
                Cell: ({ row }) => <RecruiterStatusSwitch id={row.original.id} initialStatus={row.original.status} />
            },
            {
                id: 'actions',
                header: 'Hành động',
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Xóa">
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => setDeleteState({ isOpen: true, id: row.original.id })}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: recruiters,
        state: { isLoading: loading },
        enableColumnActions: false,
        enableColumnFilters: true,
        enablePagination: true,
        enableSorting: true,
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', p: 1 }}>
                <Typography variant="h6" fontWeight="bold">Danh sách nhà tuyển dụng</Typography>
            </Box>
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

            <RecruiterDeleteConfirm 
                isOpen={deleteState.isOpen}
                onClose={() => setDeleteState({ isOpen: false, id: null })}
                recruiterId={deleteState.id}
            />
        </Container>
    );
};

export default RecruiterList;
