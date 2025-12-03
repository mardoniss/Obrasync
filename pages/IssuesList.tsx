import React, { useState } from 'react';
import { Issue, IssueStatus, IssuePriority, UserRole, User } from '../types';
import { Card, StatusBadge, PriorityBadge, Button, Input } from '../components/UI';
import { Search, Filter, MapPin, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IssuesListProps {
  issues: Issue[];
  user: User;
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues, user }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || issue.status === filterStatus;
    
    // Field users only see assigned or Open (unassigned) tasks
    // In a real app, this logic might be more complex or handled by backend
    if (user.role === UserRole.FIELD) {
      const isAssignedToMe = issue.assigned_to === user.id;
      const isOpen = issue.status === IssueStatus.OPEN;
      return matchesSearch && matchesStatus && (isAssignedToMe || isOpen);
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pendências</h2>
          <p className="text-slate-500 text-sm">Gerencie os apontamentos da obra</p>
        </div>
        
        {user.role === UserRole.ADMIN && (
          <Button onClick={() => navigate('/issues/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Pendência
          </Button>
        )}
      </div>

      <Card className="p-4 bg-white sticky top-0 md:static z-10 shadow-sm md:shadow-none">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Buscar por título ou local..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select 
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 min-w-[140px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="ALL">Todos Status</option>
              <option value={IssueStatus.OPEN}>Aberto</option>
              <option value={IssueStatus.IN_PROGRESS}>Em Andamento</option>
              <option value={IssueStatus.REVIEW}>Em Revisão</option>
              <option value={IssueStatus.APPROVED}>Concluído</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map(issue => (
          <Card 
            key={issue.id} 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => navigate(`/issues/${issue.id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>
            
            <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{issue.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">{issue.description}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{issue.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Nenhuma pendência encontrada</h3>
            <p className="text-slate-500">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};