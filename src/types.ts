export interface Project {
  id: string;
  name: string;
  balance: number;
  clientId: string;
}

export interface Payment {
  id?: string;
  clientName:string;
  date: string;
  amount: number;
  projectId: string;
  type: 'Consulting Fee' | 'Bonus';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectName?: string;
  budget?: number;
  dueDate?: string;
}
