import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { useCallingApi } from 'src/modules/calling/services/calling-api.service';
import { callLogFiltersState, callLogState } from 'src/modules/calling/states/callLogState';
import { Call } from 'src/modules/calling/types/calling.types';

export const useCallLog = () => {
  const [calls, setCalls] = useRecoilState(callLogState);
  const [filters, setFilters] = useRecoilState(callLogFiltersState);
  const { calls: apiCalls, callsLoading } = useCallingApi();

  const filteredCalls = useMemo(() => {
    if (!apiCalls) return [];

    return apiCalls.filter(call => {
      if (filters.direction && call.direction !== filters.direction) {
        return false;
      }
      
      if (filters.status && call.status !== filters.status) {
        return false;
      }
      
      if (filters.outcome && call.outcome !== filters.outcome) {
        return false;
      }
      
      if (filters.dateRange) {
        const callDate = new Date(call.startTime);
        if (callDate < filters.dateRange.start || callDate > filters.dateRange.end) {
          return false;
        }
      }
      
      return true;
    });
  }, [apiCalls, filters]);

  const setDirectionFilter = (direction?: string) => {
    setFilters(prev => ({ ...prev, direction }));
  };

  const setStatusFilter = (status?: string) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const setOutcomeFilter = (outcome?: string) => {
    setFilters(prev => ({ ...prev, outcome }));
  };

  const setDateRangeFilter = (dateRange?: { start: Date; end: Date }) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getCallsByPerson = (personId: string): Call[] => {
    return filteredCalls.filter(call => call.personId === personId);
  };

  const getCallsByCompany = (companyId: string): Call[] => {
    return filteredCalls.filter(call => call.companyId === companyId);
  };

  const getCallStats = () => {
    const totalCalls = filteredCalls.length;
    const completedCalls = filteredCalls.filter(call => call.status === 'completed').length;
    const connectedCalls = filteredCalls.filter(call => call.outcome === 'connected').length;
    
    const totalDuration = filteredCalls
      .filter(call => call.duration)
      .reduce((sum, call) => sum + (call.duration || 0), 0);
    
    const avgDuration = completedCalls > 0 ? totalDuration / completedCalls : 0;
    const successRate = totalCalls > 0 ? (connectedCalls / totalCalls) * 100 : 0;

    return {
      totalCalls,
      completedCalls,
      connectedCalls,
      totalDuration,
      avgDuration,
      successRate,
    };
  };

  return {
    calls: filteredCalls,
    loading: callsLoading,
    filters,
    setDirectionFilter,
    setStatusFilter,
    setOutcomeFilter,
    setDateRangeFilter,
    clearFilters,
    getCallsByPerson,
    getCallsByCompany,
    getCallStats,
  };
};
