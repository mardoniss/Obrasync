import { Issue, IssuePriority, IssueStatus, User, UserRole } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'eng.carlos',
    full_name: 'Eng. Carlos Silva',
    role: UserRole.ADMIN,
    avatar_url: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'u2',
    username: 'enc.joao',
    full_name: 'João Pedro (Encarregado)',
    role: UserRole.FIELD,
    avatar_url: 'https://picsum.photos/100/100?random=2'
  }
];

let MOCK_ISSUES: Issue[] = [
  {
    id: 'i1',
    title: 'Infiltração no Teto',
    description: 'Mancha de umidade aparecendo no canto da sala.',
    status: IssueStatus.OPEN,
    priority: IssuePriority.HIGH,
    location: 'Bloco A - Apto 101',
    created_by: 'u1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    photo_url_before: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: 'i2',
    title: 'Rodapé Solto',
    description: 'Rodapé de madeira descolando na parede da cozinha.',
    status: IssueStatus.IN_PROGRESS,
    priority: IssuePriority.MEDIUM,
    location: 'Bloco B - Hall',
    assigned_to: 'u2',
    created_by: 'u1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4000000).toISOString(),
    photo_url_before: 'https://picsum.photos/400/300?random=11'
  },
  {
    id: 'i3',
    title: 'Pintura Manchada',
    description: 'Retocar pintura da porta principal.',
    status: IssueStatus.REVIEW,
    priority: IssuePriority.LOW,
    location: 'Bloco A - Corredor',
    assigned_to: 'u2',
    created_by: 'u1',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    photo_url_before: 'https://picsum.photos/400/300?random=12',
    photo_url_after: 'https://picsum.photos/400/300?random=13'
  },
  {
    id: 'i4',
    title: 'Lâmpada Queimada',
    description: 'Trocar lâmpada da escada de incêndio.',
    status: IssueStatus.APPROVED,
    priority: IssuePriority.LOW,
    location: 'Bloco C - Escada',
    assigned_to: 'u2',
    created_by: 'u1',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    photo_url_before: 'https://picsum.photos/400/300?random=14',
    photo_url_after: 'https://picsum.photos/400/300?random=15'
  }
];

// Service Methods
export const api = {
  login: async (username: string): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 600)); // Simulate network
    const user = MOCK_USERS.find(u => u.username === username);
    return user || null;
  },

  getIssues: async (): Promise<Issue[]> => {
    await new Promise(r => setTimeout(r, 400));
    return [...MOCK_ISSUES];
  },

  getUsers: async (): Promise<User[]> => {
    await new Promise(r => setTimeout(r, 300));
    return [...MOCK_USERS];
  },

  createIssue: async (issue: Omit<Issue, 'id' | 'created_at' | 'updated_at'>): Promise<Issue> => {
    await new Promise(r => setTimeout(r, 800));
    const newIssue: Issue = {
      ...issue,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    MOCK_ISSUES = [newIssue, ...MOCK_ISSUES];
    return newIssue;
  },

  updateIssueStatus: async (id: string, status: IssueStatus, photoUrl?: string): Promise<Issue> => {
    await new Promise(r => setTimeout(r, 600));
    const idx = MOCK_ISSUES.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Issue not found');

    const updated = {
      ...MOCK_ISSUES[idx],
      status,
      updated_at: new Date().toISOString(),
      ...(photoUrl ? { photo_url_after: photoUrl } : {})
    };
    MOCK_ISSUES[idx] = updated;
    return updated;
  },

  assignIssue: async (id: string, userId: string): Promise<Issue> => {
    await new Promise(r => setTimeout(r, 400));
    const idx = MOCK_ISSUES.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Issue not found');

    const updated = {
      ...MOCK_ISSUES[idx],
      assigned_to: userId,
      updated_at: new Date().toISOString()
    };
    MOCK_ISSUES[idx] = updated;
    return updated;
  },

  // Simulate file upload returning a random URL
  uploadPhoto: async (file: File): Promise<string> => {
    await new Promise(r => setTimeout(r, 1500)); // Simulate upload time
    return `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;
  }
};