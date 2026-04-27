import React, { useEffect, useMemo, useState } from 'react';
import useRecruiterStore from '@/stores/useRecruiterStore';
import RecruiterStatusSwitch from './RecruiterStatusSwitch';
import RecruiterForm from './RecruiterForm';
import RecruiterDeleteConfirm from './RecruiterDeleteConfirm';
import { 
    Box, 
    Typography, 
    Button, 
    Paper,
    Container,
    IconButton,
    Tooltip
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const RecruiterList = () => {
    const { recruiters, loading, fetchRecruiters } = useRecruiterStore();
    
    const [formState, setFormState] = useState({ isOpen: false, mode: 'create', data: null });
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
                        <Tooltip title="Chỉnh sửa">
                            <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => setFormState({ isOpen: true, mode: 'edit', data: row.original })}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
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
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setFormState({ isOpen: true, mode: 'create', data: null })}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Thêm mới
                </Button>
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

            <RecruiterForm 
                isOpen={formState.isOpen} 
                onClose={() => setFormState({ ...formState, isOpen: false })} 
                mode={formState.mode}
                initialData={formState.data}
            />
            <RecruiterDeleteConfirm 
                isOpen={deleteState.isOpen}
                onClose={() => setDeleteState({ isOpen: false, id: null })}
                recruiterId={deleteState.id}
            />
        </Container>
    );
};

export default RecruiterList;
