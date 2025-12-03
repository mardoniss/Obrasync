import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Issue, IssueStatus, UserRole, User } from '../types';
import { api } from '../services/mockService';
import { Button, Card, StatusBadge, PriorityBadge, FileUploadButton } from '../components/UI';
import { ArrowLeft, MapPin, Calendar, User as UserIcon, Check, X, Play, Camera, Image as ImageIcon } from 'lucide-react';

interface IssueDetailProps {
  user: User;
  onUpdate: () => void; // Trigger refresh
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ user, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const issues = await api.getIssues();
        const found = issues.find(i => i.id === id);
        if (found) setIssue(found);
      } catch (error) {
        console.error("Failed to load issue", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleStatusChange = async (newStatus: IssueStatus, photoUrl?: string) => {
    if (!issue) return;
    setIsActionLoading(true);
    try {
      if (newStatus === IssueStatus.IN_PROGRESS && !issue.assigned_to) {
        // Auto assign if taking the job
        await api.assignIssue(issue.id, user.id);
      }
      await api.updateIssueStatus(issue.id, newStatus, photoUrl);
      
      const updated = { ...issue, status: newStatus, ...(photoUrl ? { photo_url_after: photoUrl } : {}) };
      setIssue(updated);
      onUpdate();
      setShowResolveModal(false);
    } catch (e) {
      alert('Erro ao atualizar status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setIsActionLoading(true);
    try {
      const url = await api.uploadPhoto(file);
      await handleStatusChange(IssueStatus.REVIEW, url);
    } catch (e) {
      alert('Erro no upload da imagem');
      setIsActionLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!issue) return <div className="p-8 text-center">Pendência não encontrada.</div>;

  const isAdmin = user.role === UserRole.ADMIN;
  
  // Workflow Logic
  const canStart = !isAdmin && issue.status === IssueStatus.OPEN;
  const canResolve = !isAdmin && issue.status === IssueStatus.IN_PROGRESS;
  const canApprove = isAdmin && issue.status === IssueStatus.REVIEW;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-500" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{issue.title}</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <StatusBadge status={issue.status} />
        <PriorityBadge priority={issue.priority} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Details */}
        <Card className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Descrição</label>
            <p className="text-slate-700 mt-1 whitespace-pre-wrap">{issue.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
               <label className="flex items-center text-xs text-slate-400 mb-1">
                 <MapPin className="w-3 h-3 mr-1" /> Local
               </label>
               <p className="text-sm font-medium">{issue.location}</p>
            </div>
            <div>
               <label className="flex items-center text-xs text-slate-400 mb-1">
                 <Calendar className="w-3 h-3 mr-1" /> Criado em
               </label>
               <p className="text-sm font-medium">{new Date(issue.created_at).toLocaleDateString()}</p>
            </div>
             <div>
               <label className="flex items-center text-xs text-slate-400 mb-1">
                 <UserIcon className="w-3 h-3 mr-1" /> Responsável
               </label>
               <p className="text-sm font-medium">{issue.assigned_to ? 'Atribuído' : 'Não atribuído'}</p>
            </div>
          </div>
        </Card>

        {/* Photos */}
        <div className="space-y-4">
           {issue.photo_url_before && (
             <Card className="overflow-hidden">
               <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 border-b">
                 Foto Inicial (Antes)
               </div>
               <img src={issue.photo_url_before} alt="Issue Before" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in" />
             </Card>
           )}

           {issue.photo_url_after && (
             <Card className="overflow-hidden border-green-200">
               <div className="bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 border-b border-green-200">
                 Foto Solução (Depois)
               </div>
               <img src={issue.photo_url_after} alt="Issue After" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in" />
             </Card>
           )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:sticky md:bottom-4 md:rounded-xl md:border md:shadow-lg md:mx-auto md:max-w-3xl z-40">
        <div className="flex gap-3 justify-end items-center">
            {canStart && (
               <Button className="w-full md:w-auto" onClick={() => handleStatusChange(IssueStatus.IN_PROGRESS)} isLoading={isActionLoading}>
                 <Play className="w-4 h-4 mr-2" />
                 Iniciar Serviço
               </Button>
            )}

            {canResolve && (
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => setShowResolveModal(true)} disabled={isActionLoading}>
                <Camera className="w-4 h-4 mr-2" />
                Concluir e Enviar Foto
              </Button>
            )}

            {canApprove && (
              <>
                <Button variant="danger" className="flex-1 md:flex-none" onClick={() => handleStatusChange(IssueStatus.REJECTED)} isLoading={isActionLoading}>
                   <X className="w-4 h-4 mr-2" />
                   Reprovar
                </Button>
                <Button variant="success" className="flex-1 md:flex-none" onClick={() => handleStatusChange(IssueStatus.APPROVED)} isLoading={isActionLoading}>
                   <Check className="w-4 h-4 mr-2" />
                   Aprovar
                </Button>
              </>
            )}

            {!canStart && !canResolve && !canApprove && (
               <p className="text-sm text-slate-500 w-full text-center md:text-right">
                 Nenhuma ação disponível para seu status atual.
               </p>
            )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-2">Concluir Pendência</h3>
            <p className="text-slate-500 text-sm mb-6">Para marcar como resolvido, você precisa tirar uma foto do serviço realizado.</p>
            
            <div className="space-y-3">
              <FileUploadButton 
                label="Tirar Foto da Solução" 
                isLoading={isActionLoading}
                onFileSelect={handlePhotoUpload} 
              />
              <Button variant="ghost" className="w-full" onClick={() => setShowResolveModal(false)} disabled={isActionLoading}>
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};