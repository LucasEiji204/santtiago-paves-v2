import { Link } from 'react-router-dom'
import { STORE, formatWhatsAppDisplay, whatsAppLink } from '../config'
import { Icon } from './Icon'

const YEAR = new Date().getFullYear()

const linkClass = 'text-[15px] opacity-75 hover:opacity-100 hover:text-caramel-rich transition-colors'

function ContactList() {
  return (
    <>
      <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-2`}>
        <Icon name="call" className="text-sm" /> WhatsApp {formatWhatsAppDisplay()}
        <span className="sr-only">(abre em nova aba)</span>
      </a>
      {STORE.email && (
        <a href={`mailto:${STORE.email}`} className={`${linkClass} flex items-center gap-2`}>
          <Icon name="mail" className="text-sm" /> {STORE.email}
        </a>
      )}
      {STORE.city && (
        <span className="opacity-80 flex items-center gap-2">
          <Icon name="location_on" className="text-sm" /> {STORE.city}
        </span>
      )}
      {STORE.social.instagram && (
        <a href={STORE.social.instagram} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-2`}>
          <Icon name="photo_camera" className="text-sm" /> Instagram
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      )}
    </>
  )
}

export function Footer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8 bg-chocolate-dark text-cream-vanilla mt-20 mb-20 md:mb-0">
        <div className="flex flex-col items-center md:items-start gap-4">
          <p className="font-serif text-headline-sm text-cream-vanilla">{STORE.name}</p>
          <p className="font-body-md text-cream-vanilla/80 max-w-xs text-center md:text-left">
            © {YEAR} {STORE.name}. {STORE.tagline}. Transformando momentos em lembranças deliciosas.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap justify-center gap-6 md:gap-12 font-body-md">
          <Link to="/#historia" className={linkClass}>Nossa História</Link>
          <Link to="/cardapio" className={linkClass}>Cardápio</Link>
          <Link to="/privacidade" className={linkClass}>Privacidade</Link>
          <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Contato<span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </nav>
      </footer>
    )
  }

  return (
    <footer id="contato" className="scroll-mt-24 bg-chocolate-dark text-cream-vanilla w-full py-16 pb-28 md:pb-16 px-margin-mobile md:px-margin-desktop flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <p className="font-serif text-headline-md text-cream-vanilla mb-4">{STORE.name}</p>
          <p className="opacity-80 font-body-md">{STORE.tagline}. Transformando tradição em momentos de luxo e prazer.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <nav aria-labelledby="rodape-navegacao" className="flex flex-col gap-4">
            <h2 id="rodape-navegacao" className="eyebrow text-caramel-rich">Navegação</h2>
            <Link to="/#historia" className={linkClass}>Nossa História</Link>
            <Link to="/cardapio" className={linkClass}>Cardápio</Link>
            <Link to="/#favoritos" className={linkClass}>Favoritos</Link>
          </nav>
          <div className="flex flex-col gap-4">
            <h2 className="eyebrow text-caramel-rich">Institucional</h2>
            <Link to="/privacidade" className={linkClass}>Política de Privacidade</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="eyebrow text-caramel-rich">Contato</h2>
            <ContactList />
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-cream-vanilla/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
        <p>© {YEAR} {STORE.name}. {STORE.tagline}.</p>
        <p>Desenvolvido com sofisticação.</p>
      </div>
    </footer>
  )
}
