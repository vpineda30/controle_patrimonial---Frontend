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

const numeros = [
  { valor: '1.284', rotulo: 'Patrimônios' },
  { valor: '48', rotulo: 'Ambientes' },
  { valor: '76', rotulo: 'Movimentações/mês' },
]

export default function LandingPage() {
  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.logo}>SESI SENAI</span>
        <Link href="/dashboard" className={styles.botaoTopo}>
          Acessar sistema
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroConteudo}>
          <span className={styles.selo}>
            <ShieldCheck size={15} strokeWidth={2.4} />
            Controle Patrimonial Escolar
          </span>
          <h1 className={styles.titulo}>
            Cada bem da escola no <span>lugar certo</span>, sempre sob controle.
          </h1>
          <p className={styles.subtitulo}>
            Uma plataforma completa para registrar, localizar, movimentar e dar
            manutenção em todo o patrimônio da instituição, com rastreabilidade
            total.
          </p>
          <div className={styles.acoes}>
            <Link href="/dashboard" className={styles.botaoPrimario}>
              Entrar no painel
              <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link href="/patrimonios" className={styles.botaoSecundario}>
              Ver patrimônios
            </Link>
          </div>

          <div className={styles.numeros}>
            {numeros.map((n) => (
              <div key={n.rotulo} className={styles.numeroItem}>
                <strong>{n.valor}</strong>
                <span>{n.rotulo}</span>
              </div>
            ))}
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
        <Link href="/dashboard" className={styles.linkRodape}>
          Acessar sistema
        </Link>
      </footer>
    </div>
  )
}
