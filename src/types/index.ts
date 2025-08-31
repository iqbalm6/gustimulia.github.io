export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager';
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Evaluation {
  id: string;
  employeeId: string;
  evaluatorId: string;
  period: string;
  scores: {
    productivity: number;
    quality: number;
    teamwork: number;
    punctuality: number;
    initiative: number;
  };
  comments: string;
  finalScore: number;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
  updatedAt: string;
}