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
import styles from './login.module.css'

const destaques = [
  { icon: Package, texto: 'Registro e tombamento de bens' },
  { icon: DoorOpen, texto: 'Mapa de ambientes da escola' },
  { icon: ArrowLeftRight, texto: 'Movimentações rastreáveis' },
  { icon: Wrench, texto: 'Controle de manutenção' },
]

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false)

  return (
    <div className={styles.pagina}>
      <aside className={styles.marca}>
        <div className={styles.marcaTopo}>
          <span className={styles.logo}>SESI SENAI</span>
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

          <form
            className={styles.formulario}
            onSubmit={(e) => e.preventDefault()}
          >
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
              <span className={styles.rotulo}>Senha</span>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcone} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
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
              <Link href="#" className={styles.link}>
                Esqueci a senha
              </Link>
            </div>

            <button type="submit" className={styles.botaoPrimario}>
              Entrar
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </form>

          <p className={styles.rodapeForm}>
            Ainda não tem conta?{' '}
            <Link href="/cadastro-usuario" className={styles.link}>
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
