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
import styles from './register.module.css'

const destaques = [
  { icon: UserPlus, texto: 'Crie seu acesso em poucos passos' },
  { icon: Users, texto: 'Perfis por função e permissão' },
  { icon: ClipboardCheck, texto: 'Controle total sobre os bens' },
]

export default function CadastroUsuarioPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false)

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

          <form
            className={styles.formulario}
            onSubmit={(e) => e.preventDefault()}
          >
            <label className={styles.campo}>
              <span className={styles.rotulo}>Nome completo</span>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcone} />
                <input
                  type="text"
                  required
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
                  placeholder="voce@sesisenai.org.br"
                  className={styles.input}
                />
              </div>
            </label>

            <label className={styles.campo}>
              <span className={styles.rotulo}>Função</span>
              <select className={styles.select} defaultValue="">
                <option value="" disabled>
                  Selecione sua função
                </option>
                <option value="secretaria">Secretaria</option>
                <option value="coordenacao">Coordenação</option>
                <option value="almoxarifado">Almoxarifado</option>
                <option value="direcao">Direção</option>
              </select>
            </label>

            <label className={styles.campo}>
              <span className={styles.rotulo}>Senha</span>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcone} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
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

            <button type="submit" className={styles.botaoPrimario}>
              Criar conta
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
