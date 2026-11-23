import Link from 'next/link'
import {
  Package,
  DoorOpen,
  ArrowLeftRight,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import styles from './landing.module.css'

const recursos = [
  {
    icon: Package,
    titulo: 'Registro de bens',
    texto:
      'Cadastre e tombe cada patrimônio da escola com categoria, valor e localização.',
  },
  {
    icon: DoorOpen,
    titulo: 'Mapa de ambientes',
    texto:
      'Saiba exatamente em qual sala, bloco ou setor cada item está alocado.',
  },
  {
    icon: ArrowLeftRight,
    titulo: 'Movimentações',
    texto:
      'Registre transferências entre ambientes com histórico completo e rastreável.',
  },
  {
    icon: Wrench,
    titulo: 'Manutenção',
    texto:
      'Acompanhe itens danificados, extraviados ou em reparo em um só lugar.',
  },
]

export default function LandingPage() {
  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.logo}>SESI SENAI</span>
        <div className={styles.acoesTopo}>
          <Link href="/login" className={styles.botaoTopo}>
            Entrar
          </Link>
          <Link href="/register" className={styles.botaoTopoPrimario}>
            Criar conta
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroConteudo}>
          <h1 className={styles.titulo}>
            Cada bem da escola no <span>lugar certo</span>, sempre sob controle.
          </h1>
          <p className={styles.subtitulo}>
            Uma plataforma completa para registrar, localizar, movimentar e dar
            manutenção em todo o patrimônio da instituição, com rastreabilidade
            total.
          </p>
          <div className={styles.acoes}>
            <Link href="/login" className={styles.botaoPrimario}>
              Entrar
              <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link href="/register" className={styles.botaoSecundario}>
              Criar conta
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.recursos}>
        {recursos.map(({ icon: Icon, titulo, texto }, i) => (
          <article
            key={titulo}
            className={styles.card}
            style={{ animationDelay: `${0.15 * i + 0.3}s` }}
          >
            <div className={styles.cardIcone}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </article>
        ))}
      </section>

      <footer className={styles.rodape}>
        <span>SESI SENAI · Controle Patrimonial</span>
      </footer>
    </div>
  )
}
