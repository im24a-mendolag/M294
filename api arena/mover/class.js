class ApiArenaClient {
    constructor(teamName, secret) {
      this.teamName = teamName;
      this.secret = secret;
      this.baseUrl = 'http://10.69.4.1:3001';
    }
  
    async register(role) {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamName: this.teamName,
          role: role
        })
      });
      return response.json();
    }
  
    async getState() {
      const response = await fetch(`${this.baseUrl}/api/team/${this.teamName}/state`, {
        headers: {
          'Authorization': `Bearer ${this.secret}`
        }
      });
      return response.json();
    }
  
    async move(direction) {
      const response = await fetch(`${this.baseUrl}/api/team/${this.teamName}/move`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ direction })
      });
      return response.json();
    }
  
    async toggleBlock(x, y) {
      const response = await fetch(`${this.baseUrl}/api/team/${this.teamName}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y })
      });
      return response.json();
    }
  }

window.ApiArenaClient = ApiArenaClient;