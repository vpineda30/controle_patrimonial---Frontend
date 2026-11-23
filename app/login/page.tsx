'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  DoorOpen,
  ArrowLeftRight,
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import styles from './login.module.css'

const destaques = [
  { icon: Package, texto: 'Registro e tombamento de bens' },
  { icon: DoorOpen, texto: 'Mapa de ambientes da escola' },
  { icon: ArrowLeftRight, texto: 'Movimentações rastreáveis' },
  { icon: Wrench, texto: 'Controle de manutenção' },
]

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const result = await authApi.login(email, senha)
      localStorage.setItem('auth_token', result.token)
      localStorage.setItem('auth_user', JSON.stringify(result.user))
      router.push('/dashboard')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível entrar')
    } finally {
      setCarregando(false)
    }
  }

  async function recuperarSenha() {
    const recuperacaoEmail = window.prompt('Informe seu e-mail:')
    if (!recuperacaoEmail) return
    try {
      await authApi.forgotPassword(recuperacaoEmail)
      setErro('Solicitação de recuperação enviada.')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao solicitar recuperação')
    }
  }

  return (
    <div className={styles.pagina}>
      <aside className={styles.marca}>
        <div className={styles.marcaTopo}>
          <img src="logo.png" className={styles.logo} alt="" />
          <p className={styles.marcaLegenda}>Controle Patrimonial</p>
        </div>

        <div className={styles.marcaConteudo}>
          <h2 className={styles.marcaTitulo}>
            Bem-vindo de volta ao controle do seu patrimônio.
          </h2>
          <ul className={styles.listaDestaques}>
            {destaques.map(({ icon: Icon, texto }, i) => (
              <li
                key={texto}
                className={styles.destaque}
                style={{ animationDelay: `${0.1 * i + 0.3}s` }}
              >
                <span className={styles.destaqueIcone}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.marcaRodape}>
          SESI SENAI · Gestão de bens escolares
        </p>
      </aside>

      <main className={styles.painel}>
        <div className={styles.formularioBox}>
          <header className={styles.cabecalho}>
            <h1 className={styles.titulo}>Entrar</h1>
            <p className={styles.subtitulo}>
              Acesse sua conta para gerenciar o patrimônio da escola.
            </p>
          </header>

          <form className={styles.formulario} onSubmit={entrar}>
            <label className={styles.campo}>
              <span className={styles.rotulo}>E-mail</span>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcone} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@sesisenai.org.br"
                  className={styles.input}
                />
              </div>
            </label>

            <label className={styles.campo}>
              <span className={styles.rotulo}>Senha</span>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcone} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.olho}
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className={styles.linhaOpcoes}>
              <label className={styles.lembrar}>
                <input type="checkbox" className={styles.checkbox} />
                Lembrar de mim
              </label>
              <button type="button" onClick={recuperarSenha} className={styles.link}>
                Esqueci a senha
              </button>
            </div>

            {erro && <p style={{ color: '#b42318', margin: 0 }}>{erro}</p>}

            <button type="submit" className={styles.botaoPrimario} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </form>

          <p className={styles.rodapeForm}>
            Ainda não tem conta?{' '}
            <Link href="/register" className={styles.link}>
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
