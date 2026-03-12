import axios, { AxiosInstance } from 'axios';
import { User, SessionLog, Partner, Technique, Injury, WeeklyReport, MonthlyReport } from '../types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  // Auth
  async login(email: string, displayName?: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post('/v1/auth/login', { email, displayName });
    this.token = response.data.token;
    return {
      user: response.data,
      token: response.data.token,
    };
  }

  async getMe(): Promise<User> {
    const response = await this.client.get('/v1/auth/me');
    return response.data;
  }

  // Sessions
  async createSession(data: Partial<SessionLog>): Promise<SessionLog> {
    const response = await this.client.post('/v1/sessions', data);
    return response.data;
  }

  async getSessions(from?: string, to?: string, limit?: number): Promise<SessionLog[]> {
    const response = await this.client.get('/v1/sessions', {
      params: { from, to, limit: limit || 50 },
    });
    return response.data;
  }

  async getSession(id: string): Promise<SessionLog> {
    const response = await this.client.get(`/v1/sessions/${id}`);
    return response.data;
  }

  async updateSession(id: string, data: Partial<SessionLog>): Promise<SessionLog> {
    const response = await this.client.put(`/v1/sessions/${id}`, data);
    return response.data;
  }

  async deleteSession(id: string): Promise<void> {
    await this.client.delete(`/v1/sessions/${id}`);
  }

  // Partners
  async createPartner(data: Partial<Partner>): Promise<Partner> {
    const response = await this.client.post('/v1/partners', data);
    return response.data;
  }

  async getPartners(): Promise<Partner[]> {
    const response = await this.client.get('/v1/partners');
    return response.data;
  }

  async updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
    const response = await this.client.patch(`/v1/partners/${id}`, data);
    return response.data;
  }

  // Techniques
  async createTechnique(data: Partial<Technique>): Promise<Technique> {
    const response = await this.client.post('/v1/techniques', data);
    return response.data;
  }

  async getTechniques(category?: string): Promise<Technique[]> {
    const response = await this.client.get('/v1/techniques', {
      params: { category },
    });
    return response.data;
  }

  // Injuries
  async createInjury(data: Partial<Injury>): Promise<Injury> {
    const response = await this.client.post('/v1/injuries', data);
    return response.data;
  }

  async getInjuries(): Promise<Injury[]> {
    const response = await this.client.get('/v1/injuries');
    return response.data;
  }

  async updateInjury(id: string, data: Partial<Injury>): Promise<Injury> {
    const response = await this.client.patch(`/v1/injuries/${id}`, data);
    return response.data;
  }

  // Reports
  async getWeeklyReport(weekStart: string): Promise<WeeklyReport> {
    const response = await this.client.get('/v1/reports/weekly', {
      params: { week_start: weekStart },
    });
    return response.data;
  }

  async getMonthlyReport(month: string): Promise<MonthlyReport> {
    const response = await this.client.get('/v1/reports/monthly', {
      params: { month },
    });
    return response.data;
  }

  // Sync
  async pushChanges(changes: any[]) {
    const response = await this.client.post('/v1/sync/push', { changes });
    return response.data;
  }

  async pullChanges(since?: string) {
    const response = await this.client.get('/v1/sync/pull', {
      params: { since },
    });
    return response.data;
  }
}

export default new ApiClient();
