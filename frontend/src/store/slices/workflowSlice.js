import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0
  }
};

export const fetchWorkflows = createAsyncThunk('workflows/fetchAll', async (params, thunkAPI) => {
  try {
    const response = await api.get('/workflows', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch workflows';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchWorkflowById = createAsyncThunk('workflows/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/workflows/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch workflow';
    return thunkAPI.rejectWithValue(message);
  }
});

const workflowSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    clearCurrentWorkflow: (state) => {
      state.currentWorkflow = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workflows = action.payload.data.items || [];
        state.pagination = {
          page: action.payload.data.page,
          limit: action.payload.data.limit,
          totalPages: action.payload.data.totalPages,
          total: action.payload.data.total
        };
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkflowById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkflowById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWorkflow = action.payload.data.workflow;
      })
      .addCase(fetchWorkflowById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;
