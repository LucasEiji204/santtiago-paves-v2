import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'

export function NotFoundPage() {
  return (
    <>
      <PageTitle title="Página não encontrada" />
      <Header showBack />
      <main id="conteudo" className="min-h-[60vh] flex items-center justify-center px-margin-mobile py-16 text-center">
        <div>
          <Icon name="cookie" className="text-6xl text-caramel-deep mb-6" />
          <h1 className="font-headline-md text-headline-md text-primary mb-4">Página não encontrada</h1>
          <p className="text-on-surface-variant mb-8">O endereço pode estar errado ou a página saiu do ar.</p>
          <Link
            to="/cardapio"
            className="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-4 rounded-xl font-label-md hover:bg-primary transition-colors"
          >
            <Icon name="restaurant_menu" /> Ver Cardápio
          </Link>
        </div>
      </main>
      <Footer compact />
      <BottomNav />
    </>
  )
}
