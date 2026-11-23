'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  UserPlus,
  Users,
  ClipboardCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import styles from './register.module.css'

const destaques = [
  { icon: UserPlus, texto: 'Crie seu acesso em poucos passos' },
  { icon: Users, texto: 'Perfis por função e permissão' },
  { icon: ClipboardCheck, texto: 'Controle total sobre os bens' },
]

export default function CadastroUsuarioPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function criarConta(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authApi.register(nome, email, senha)
      router.push('/login')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível criar a conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <aside className={styles.marca}>
        <div className={styles.marcaTopo}>
          <span className={styles.logo}>SESI SENAI</span>
          <p className={styles.marcaLegenda}>Controle Patrimonial</p>
        </div>

        <div className={styles.marcaConteudo}>
          <span className={styles.selo}>
            <ShieldCheck size={15} strokeWidth={2.4} />
            Acesso institucional
          </span>
          <h2 className={styles.marcaTitulo}>
            Comece a gerenciar o patrimônio da sua escola hoje.
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
            <h1 className={styles.titulo}>Criar conta</h1>
            <p className={styles.subtitulo}>
              Preencha seus dados para começar a usar o sistema.
            </p>
          </header>

          <form className={styles.formulario} onSubmit={criarConta}>
            <label className={styles.campo}>
              <span className={styles.rotulo}>Nome completo</span>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcone} />
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className={styles.input}
                />
              </div>
            </label>

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
                  placeholder="Crie uma senha"
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

            <label className={styles.termos}>
              <input type="checkbox" required className={styles.checkbox} />
              <span>
                Concordo com os{' '}
                <Link href="#" className={styles.link}>
                  termos de uso
                </Link>{' '}
                da instituição.
              </span>
            </label>

            {erro && <p style={{ color: '#b42318', margin: 0 }}>{erro}</p>}

            <button type="submit" className={styles.botaoPrimario} disabled={carregando}>
              {carregando ? 'Criando...' : 'Criar conta'}
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </form>

          <p className={styles.rodapeForm}>
            Já tem uma conta?{' '}
            <Link href="/login" className={styles.link}>
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
