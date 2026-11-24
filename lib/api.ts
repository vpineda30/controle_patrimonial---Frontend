export const API_PREFIX = '/api/backend'

export type LoginResponse = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  token: string
}

export type Bloco = {
  id: string
  numero: number | null
  ambientes?: Ambiente[]
}

export type Ambiente = {
  id: string
  nome: string
  responsavel: string
  blocoId: string
  unidades?: UnidadeItem[]
}

export type UnidadeItem = {
  id: string
  estado: 'ATIVO' | 'EXTRAVIADO' | 'MANUTENÇÃO' | 'DANIFICADO'
  itemId: string
  ambienteId: string | null
  item?: Patrimonio
  ambiente?: Ambiente | null
}

export type Patrimonio = {
  id: string
  tombamento: number
  nome: string
  descricao: string | null
  valor: string | number
  categoria: string
  marca: string
  quantidade: number
  createdAt: string
  unidades?: UnidadeItem[]
}

export type Movimentacao = {
  id: string
  itemId: string
  origem: string
  destino: string
  quantidade: number
  resp: string
  dataMovimentacao: string
  expiresAt: string | null
  item: Patrimonio
}

export type CriarPatrimonio = {
  tombamento: number
  nome: string
  descricao?: string | null
  valor: number
  categoria:
    | 'ELETRÔNICO'
    | 'MÓVEIS'
    | 'MATERIAIS'
    | 'CLIMATIZAÇÃO'
    | 'HIGIENIZAÇÃO'
    | 'ESPORTE'
  marca: string
  quantidade: number
  ambienteId?: string | null
}

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

function getErrorMessage(data: unknown): string | null {
  if (typeof data === 'string') {
    const message = data.trim()
    return message && !message.startsWith('<') ? message : null
  }

  if (Array.isArray(data)) {
    const messages = data
      .map(getErrorMessage)
      .filter((message): message is string => message !== null)
    return messages.length ? messages.join(', ') : null
  }

  if (typeof data === 'object' && data !== null) {
    const payload = data as Record<string, unknown>
    for (const key of ['message', 'error', 'detail', 'errors', 'error_description']) {
      const message = getErrorMessage(payload[key])
      if (message) return message
    }
  }

  return null
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    const backendMessage = getErrorMessage(data)
    const isGenericMessage =
      !backendMessage ||
      backendMessage === `Erro ${response.status}` ||
      backendMessage.toLowerCase() === 'internal server error'
    const isLoginFailure =
      path === '/login' && [401, 500].includes(response.status) && isGenericMessage
    const message = isLoginFailure
      ? 'E-mail ou senha inválidos.'
      : backendMessage ?? `Erro ${response.status}`
    throw new Error(message)
  }

  return data as T
}

export const authApi = {
  login: (email: string, password: string) =>
    api<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    api<{ success: boolean; message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  forgotPassword: (email: string) =>
    api<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  updatePassword: (email: string, password: string) =>
    api<unknown>('/update-password', {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
    }),
}

export const blocosApi = {
  list: () => api<Bloco[]>('/blocos'),
  get: (id: string) => api<Bloco>(`/blocos/${id}`),
  create: (numero: number | null) =>
    api<Bloco>('/blocos', {
      method: 'POST',
      body: JSON.stringify({ numero }),
    }),
  update: (id: string, numero: number | null) =>
    api<{ message: string }>(`/blocos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ numero }),
    }),
  remove: (id: string) =>
    api<{ message: string }>(`/blocos/${id}`, { method: 'DELETE' }),
}

export const ambientesApi = {
  list: () => api<Ambiente[]>('/ambientes'),
  create: (data: {
    id: string
    nome: string
    responsavel: string
    blocoId: string
  }) =>
    api<{ message: string }>('/ambientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Ambiente, 'id' | 'unidades'>>) =>
    api<{ message: string }>(`/ambientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    api<{ message: string }>(`/ambientes/${id}`, { method: 'DELETE' }),
}

export const patrimoniosApi = {
  list: () => api<Patrimonio[]>('/patrimonios'),
  get: (id: string) => api<Patrimonio>(`/patrimonios/${id}`),
  create: (data: CriarPatrimonio) =>
    api<Patrimonio>('/patrimonios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CriarPatrimonio>) =>
    api<{ message: string }>(`/patrimonios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    api<{ message: string }>(`/patrimonios/${id}`, { method: 'DELETE' }),
}

export const unidadesApi = {
  updateState: (
    id: string,
    estado: UnidadeItem['estado'],
  ) =>
    api<{ message: string }>(`/unidades/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    }),
}

export const movimentacoesApi = {
  list: () => api<Movimentacao[]>('/movimentacoes'),
  get: (id: string) => api<Movimentacao>(`/movimentacoes/${id}`),
  create: (data: {
    itemId: string
    origemAmbienteId: string | null
    destinoAmbienteId: string
    quantidade: number
    resp: string
    expiresAt: string
  }) =>
    api<Movimentacao>('/movimentacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
