class ApiClient {
  private async refreshTokeniFNeeded() {
    await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
  }

  async request(url: string, options: RequestInit = {}) {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      await this.refreshTokeniFNeeded();
      response = await fetch(url, {
        ...options,
        credentials: "include",
      });
    }

    return response;
  }
}

export const apiClient = new ApiClient();