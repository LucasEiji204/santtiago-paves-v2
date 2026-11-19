import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { PageTitle } from '../components/PageTitle'
import { STORE, formatWhatsAppDisplay, whatsAppLink } from '../config'

/**
 * Política de Privacidade em linguagem simples (LGPD — Lei 13.709/2018).
 * Reflete como o site funciona hoje: nenhum dado pessoal é salvo em servidor;
 * o pedido é enviado pelo próprio cliente, via WhatsApp.
 * Se o funcionamento mudar (ex.: cadastro, banco de dados, analytics),
 * atualize este texto.
 */
export function PrivacyPage() {
  const updatedAt = '18 de novembro de 2026'

  return (
    <>
      <PageTitle title="Política de Privacidade" />
      <Header showBack />
      <main id="conteudo" className="max-w-3xl mx-auto px-margin-mobile py-12 pb-32">
        <h1 className="font-headline-md text-headline-md text-primary mb-2">Política de Privacidade</h1>
        <p className="text-label-sm text-on-surface-variant mb-10">Atualizada em {updatedAt}</p>

        <div className="space-y-8 font-body-md text-on-surface leading-relaxed [&_h2]:font-headline-sm [&_h2]:text-headline-sm [&_h2]:text-primary [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          <section>
            <h2>Resumo</h2>
            <p>
              O site do {STORE.name} <strong>não guarda seus dados pessoais</strong>. Não temos cadastro, login nem
              banco de dados. Os dados que você digita ao finalizar o pedido servem só para montar a mensagem que{' '}
              <strong>você mesmo envia</strong> pelo WhatsApp.
            </p>
          </section>

          <section>
            <h2>Quais dados pedimos e por quê</h2>
            <ul>
              <li><strong>Nome e telefone:</strong> para sabermos de quem é o pedido e falarmos com você.</li>
              <li><strong>Endereço, CEP e complemento</strong> (só para entrega): para levar o pedido até você.</li>
              <li><strong>Forma de pagamento e troco:</strong> para combinarmos o pagamento.</li>
              <li><strong>Observações do produto:</strong> para preparar o pedido do seu jeito.</li>
            </ul>
            <p className="mt-3">
              A base legal é a execução do pedido que você solicitou (art. 7º, V, da LGPD).
            </p>
          </section>

          <section>
            <h2>Para onde vão os dados</h2>
            <p>
              Quando você toca em “Finalizar e enviar pelo WhatsApp”, o site abre o WhatsApp com a mensagem pronta. Nada
              é enviado até você tocar em enviar dentro do WhatsApp. A partir daí, a conversa fica no WhatsApp (um
              serviço da Meta, com política de privacidade própria) e é usada apenas para atender o seu pedido.
            </p>
          </section>

          <section>
            <h2>O que fica no seu aparelho</h2>
            <p>
              Para a sacola não se perder se você recarregar a página, os <strong>produtos escolhidos</strong> ficam
              salvos no armazenamento local do seu navegador. Nenhum dado pessoal é salvo ali, e você pode apagar a
              qualquer momento limpando os dados do site no navegador. Não usamos cookies de rastreamento nem
              publicidade.
            </p>
          </section>

          <section>
            <h2>Serviços de terceiros</h2>
            <p>
              O site carrega fontes e ícones do Google Fonts e imagens hospedadas pelo Google. Ao abrir o site, o seu
              navegador se conecta a esses serviços, que podem registrar dados técnicos como o endereço IP.
            </p>
          </section>

          <section>
            <h2>Seus direitos</h2>
            <p>
              Você pode pedir a qualquer momento para saber quais dados seus temos, corrigi-los ou apagá-los — por
              exemplo, apagar a conversa do pedido. É só falar com a gente pelo{' '}
              <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-caramel-deep underline underline-offset-2">
                WhatsApp {formatWhatsAppDisplay()}
              </a>
              {STORE.email && (
                <>
                  {' '}ou pelo e-mail{' '}
                  <a href={`mailto:${STORE.email}`} className="text-caramel-deep underline underline-offset-2">{STORE.email}</a>
                </>
              )}
              .
            </p>
          </section>
        </div>
      </main>
      <Footer compact />
      <BottomNav />
    </>
  )
}
