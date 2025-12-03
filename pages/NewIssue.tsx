import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IssuePriority } from '../types';
import { api } from '../services/mockService';
import { Button, Input, Card, FileUploadButton } from '../components/UI';
import { ArrowLeft, UploadCloud } from 'lucide-react';

export const NewIssue: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: IssuePriority.MEDIUM,
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createIssue({
        ...formData,
        status: 'OPEN' as any,
        created_by: 'current-user-id',
        photo_url_before: photoUrl || undefined
      });
      navigate('/issues');
    } catch (err) {
      alert('Erro ao criar pendência');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // In a real app, show a spinner here while uploading
    try {
      const url = await api.uploadPhoto(file);
      setPhotoUrl(url);
    } catch (e) {
      alert('Erro no upload');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
       <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-500" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Cancelar
      </Button>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Nova Pendência</h1>
        <p className="text-slate-500">Registre um problema encontrado na obra.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <Input 
            label="Título" 
            placeholder="Ex: Infiltração na parede" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <div className="space-y-1">
             <label className="text-sm font-medium">Descrição</label>
             <textarea 
               className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[100px]"
               placeholder="Descreva o problema em detalhes..."
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               required
             />
          </div>

          <Input 
            label="Localização" 
            placeholder="Ex: Bloco A - Apto 402" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            required
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Prioridade</label>
            <select 
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value as IssuePriority})}
            >
              <option value={IssuePriority.LOW}>Baixa</option>
              <option value={IssuePriority.MEDIUM}>Média</option>
              <option value={IssuePriority.HIGH}>Alta</option>
            </select>
          </div>

           <div className="pt-2">
             <label className="text-sm font-medium block mb-2">Foto do Problema (Opcional)</label>
             {photoUrl ? (
               <div className="relative rounded-lg overflow-hidden h-40 border border-slate-200">
                 <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                 <button 
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs"
                 >
                   Remover
                 </button>
               </div>
             ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <FileUploadButton label="Adicionar Foto" onFileSelect={handlePhotoUpload} />
                  <p className="text-xs text-slate-400 mt-2">Clique para selecionar ou usar a câmera</p>
                </div>
             )}
           </div>
        </Card>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Criar Pendência
        </Button>
      </form>
    </div>
  );
};