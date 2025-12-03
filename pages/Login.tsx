import React, { useState } from 'react';
import { api } from '../services/mockService';
import { User } from '../types';
import { Button, Card, Input } from '../components/UI';
import { HardHat } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pre-fill for demo purposes
  const [username, setUsername] = useState('eng.carlos');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const user = await api.login(username);
      if (user) {
        onLogin(user);
      } else {
        setError('Usuário não encontrado. Tente "eng.carlos" ou "enc.joao".');
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl border-0">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent p-4 rounded-xl mb-4 shadow-lg shadow-blue-900/20">
             <HardHat className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ObraSync</h1>
          <p className="text-slate-500 mt-1">Gestão inteligente de canteiro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Input 
              label="Usuário" 
              placeholder="Digite seu usuário..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-lg"
            />
             <p className="text-xs text-slate-400">
               *Demo: use <strong className="text-slate-600">eng.carlos</strong> (Admin) ou <strong className="text-slate-600">enc.joao</strong> (Campo)
             </p>
          </div>
          
          {error && <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center font-medium">{error}</div>}

          <Button type="submit" className="w-full h-12 text-lg" isLoading={isLoading}>
            Entrar
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Versão 1.0.0 (MVP) • React + Supabase</p>
        </div>
      </Card>
    </div>
  );
};