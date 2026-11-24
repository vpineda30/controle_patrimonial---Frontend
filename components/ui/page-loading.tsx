import styles from './page-loading.module.css'

type PageLoadingProps = {
  variant: 'dashboard' | 'grid' | 'form' | 'maintenance' | 'table'
  label?: string
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`${styles.skeleton} ${className}`} aria-hidden="true" />
}

export function PageLoading({
  variant,
  label = 'Carregando conteúdo',
}: PageLoadingProps) {
  return (
    <div className={styles.loading} role="status" aria-label={label}>
      {variant === 'dashboard' && (
        <>
          <div className={styles.metrics}>
            {[0, 1, 2, 3].map((item) => (
              <div className={styles.metric} key={item}>
                <Skeleton className={styles.icon} />
                <div className={styles.metricText}>
                  <Skeleton className={styles.shortLine} />
                  <Skeleton className={styles.valueLine} />
                  <Skeleton className={styles.mediumLine} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.dashboardGrid}>
            <div className={styles.panel}>
              <Skeleton className={styles.titleLine} />
              {[0, 1, 2, 3, 4].map((item) => (
                <Skeleton className={styles.tableLine} key={item} />
              ))}
            </div>
            <div className={styles.panel}>
              <Skeleton className={styles.titleLine} />
              {[0, 1, 2, 3, 4].map((item) => (
                <Skeleton className={styles.listLine} key={item} />
              ))}
            </div>
          </div>
        </>
      )}

      {variant === 'grid' && (
        <>
          <div className={styles.filters}>
            <Skeleton className={styles.searchField} />
            <Skeleton className={styles.selectField} />
          </div>
          <div className={styles.cardsGrid}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div className={styles.card} key={item}>
                <Skeleton className={styles.icon} />
                <Skeleton className={styles.cardTitle} />
                <Skeleton className={styles.mediumLine} />
                <Skeleton className={styles.shortLine} />
              </div>
            ))}
          </div>
        </>
      )}

      {variant === 'form' && (
        <div className={styles.formSections}>
          {[0, 1, 2].map((section) => (
            <div className={styles.formSection} key={section}>
              <Skeleton className={styles.titleLine} />
              <div className={styles.formFields}>
                {[0, 1, 2, 3].map((field) => (
                  <div className={styles.formField} key={field}>
                    <Skeleton className={styles.shortLine} />
                    <Skeleton className={styles.inputField} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Skeleton className={styles.buttonField} />
        </div>
      )}

      {variant === 'maintenance' && (
        <>
          <div className={styles.metricsThree}>
            {[0, 1, 2].map((item) => (
              <div className={styles.metric} key={item}>
                <Skeleton className={styles.icon} />
                <div className={styles.metricText}>
                  <Skeleton className={styles.valueLine} />
                  <Skeleton className={styles.mediumLine} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.maintenanceList}>
            {[0, 1, 2].map((item) => (
              <div className={styles.panel} key={item}>
                <Skeleton className={styles.cardTitle} />
                <Skeleton className={styles.listLine} />
                <Skeleton className={styles.mediumLine} />
              </div>
            ))}
          </div>
        </>
      )}

      {variant === 'table' && (
        <>
          <div className={styles.filters}>
            <Skeleton className={styles.searchField} />
            <Skeleton className={styles.selectField} />
            <Skeleton className={styles.buttonField} />
          </div>
          <div className={styles.panel}>
            <div className={styles.tableHeader}>
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Skeleton className={styles.headerCell} key={item} />
              ))}
            </div>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div className={styles.tableRow} key={item}>
                {[0, 1, 2, 3, 4, 5].map((cell) => (
                  <Skeleton className={styles.cell} key={cell} />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
