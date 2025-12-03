import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Issue, IssueStatus } from '../types';
import { Card } from '../components/UI';
import { CheckCircle2, Clock, AlertCircle, FileStack } from 'lucide-react';

interface DashboardProps {
  issues: Issue[];
}

export const Dashboard: React.FC<DashboardProps> = ({ issues }) => {
  const stats = useMemo(() => {
    return {
      total: issues.length,
      open: issues.filter(i => i.status === IssueStatus.OPEN).length,
      inProgress: issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length,
      review: issues.filter(i => i.status === IssueStatus.REVIEW).length,
      approved: issues.filter(i => i.status === IssueStatus.APPROVED).length,
    };
  }, [issues]);

  const data = [
    { name: 'Aberto', value: stats.open, color: '#94a3b8' }, // Slate 400
    { name: 'Andamento', value: stats.inProgress, color: '#3b82f6' }, // Blue 500
    { name: 'Revisão', value: stats.review, color: '#f59e0b' }, // Amber 500
    { name: 'Concluído', value: stats.approved, color: '#22c55e' }, // Green 500
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visão Geral</h2>
        <p className="text-slate-500">Acompanhe o progresso das pendências na obra.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={FileStack} colorClass="bg-slate-100 text-slate-600" />
        <StatCard title="Abertos" value={stats.open} icon={AlertCircle} colorClass="bg-red-100 text-red-600" />
        <StatCard title="Revisão" value={stats.review} icon={Clock} colorClass="bg-orange-100 text-orange-600" />
        <StatCard title="Fechados" value={stats.approved} icon={CheckCircle2} colorClass="bg-green-100 text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col min-h-[300px]">
          <h3 className="text-lg font-semibold mb-6">Distribuição por Status</h3>
          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {issues.slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{issue.title}</p>
                  <p className="text-xs text-slate-500">{issue.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                    ${issue.status === IssueStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                      issue.status === IssueStatus.REVIEW ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                    {issue.status === IssueStatus.APPROVED ? 'Concluído' : 
                     issue.status === IssueStatus.REVIEW ? 'Revisão' : 'Pendente'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(issue.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {issues.length === 0 && <p className="text-sm text-slate-400">Nenhuma atividade recente.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};