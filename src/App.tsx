import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigationType, useParams } from 'react-router-dom'
import { ArrowDown, ArrowRight, BadgeInfo, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Download, Flower2, Heart, Info, Instagram, MapPin, Menu, Phone, Share2, UserRound, X } from 'lucide-react'

const SITE = {
  name: 'Beaurn Wellness Studio', slogan: 'Beaurn to live, Beaurn to be yourself.', tagline: 'Reviens à toi.',
  address: 'Camp SIC, Titi Garage', phone: '+237 658 65 96 40', tel: '+237658659640', wa: '237658659640',
  reservio: 'https://beaurn-pilates.reservio.com/', events: 'https://beaurn-pilates.reservio.com/events',
  login: 'https://accounts.reservio.com/fr/connexion?backlink=https%3A%2F%2Fbeaurn-pilates.reservio.com%2F&fromId=bp',
  privacy: 'https://beaurn-pilates.reservio.com/privacy-policy', terms: 'https://beaurn-pilates.reservio.com/terms-and-conditions',
  instagram: 'https://www.instagram.com/beaurncmr/', tiktok: import.meta.env.VITE_TIKTOK_URL || '#', maps: 'https://www.google.com/maps/dir/?api=1&destination=3.886284096092611%2C11.550904167334805',
}
const wa = (message = '') => `https://wa.me/${SITE.wa}${message ? `?text=${encodeURIComponent(message)}` : ''}`
const coaches = [
  { slug: 'aisha', name: 'Aïsha', role: 'Coach Pilates & Yoga', initials: 'A' },
  { slug: 'aurelie', name: 'Aurélie', role: 'Coach Pilates', initials: 'A' },
  { slug: 'carla', name: 'Coach Carla', role: 'Coach Pilates', initials: 'C' },
  { slug: 'hilarion', name: 'Coach Hilarion', role: 'Coach Pilates', initials: 'H' },
  { slug: 'ornella', name: 'Ornella', role: 'Coach Pilates & Bien-être', initials: 'O' },
]
const courses = [
  { name: 'Pilates classique', slug: 'classique', desc: 'Renforce le corps et améliore la posture.', duration: 50, level: 'Tous niveaux', art: 'pose' },
  { name: 'Pilates doux', slug: 'doux', desc: 'Idéal pour se reconnecter à soi.', duration: 50, level: 'Tous niveaux', art: 'calm' },
  { name: 'Pilates dynamique', slug: 'dynamique', desc: "Tonifie et booste l'énergie.", duration: 50, level: 'Niveau intermédiaire', art: 'move' },
  { name: 'Yoga', slug: 'yoga', desc: 'Apaise le mental et assouplit le corps.', duration: 60, level: 'Tous niveaux', art: 'yoga' },
]
const photoAssets: Record<string, string> = {
  hero: `${import.meta.env.BASE_URL}images/pilates-flow.webp`,
  stretch: `${import.meta.env.BASE_URL}images/pilates-side.webp`,
  'course-0': `${import.meta.env.BASE_URL}images/pilates-boat.webp`,
  'course-1': `${import.meta.env.BASE_URL}images/pilates-rest.webp`,
  'course-2': `${import.meta.env.BASE_URL}images/pilates-side.webp`,
  'course-3': `${import.meta.env.BASE_URL}images/yoga-meditation.webp`,
  'planning-bg': `${import.meta.env.BASE_URL}images/studio-mats.webp`,
  'coach-0': `${import.meta.env.BASE_URL}images/coach-aisha.webp`,
  'coach-1': `${import.meta.env.BASE_URL}images/coach-aurelie.webp`,
  'coach-2': `${import.meta.env.BASE_URL}images/coach-carla.webp`,
  'coach-3': `${import.meta.env.BASE_URL}images/coach-hilarion.webp`,
  'coach-4': `${import.meta.env.BASE_URL}images/yoga-meditation.webp`,
  'exp-0': `${import.meta.env.BASE_URL}images/studio-rollers.webp`,
  'exp-1': `${import.meta.env.BASE_URL}images/mat-bottle.webp`,
  'exp-2': `${import.meta.env.BASE_URL}images/community-duo.webp`,
  'exp-3': `${import.meta.env.BASE_URL}images/pilates-split.webp`,
  'exp-4': `${import.meta.env.BASE_URL}images/group-meditation.webp`,
  'exp-5': `${import.meta.env.BASE_URL}images/studio-mats.webp`,
  venue: `${import.meta.env.BASE_URL}images/studio-corner.webp`,
}
const external = { target: '_blank', rel: 'noopener noreferrer' } as const
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }> }

function Logo({ light = false }: { light?: boolean }) { return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Beaurn Wellness Studio, accueil"><span>BEAURN</span><small>WELLNESS STUDIO</small></Link> }
function Button({ children, to, href, variant = 'primary', className = '' }: { children: React.ReactNode; to?: string; href?: string; variant?: string; className?: string }) { const cls = `button ${variant} ${className}`; return to ? <Link className={cls} to={to}>{children}</Link> : <a className={cls} href={href} {...(href?.startsWith('http') ? external : {})}>{children}</a> }
function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const guide = useRef<HTMLDialogElement>(null)
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSecure = window.isSecureContext
  const isProduction = import.meta.env.PROD
  useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)')
    const refreshInstalled = () => setInstalled(displayMode.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    const onPrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent) }
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null) }
    refreshInstalled()
    displayMode.addEventListener('change', refreshInstalled)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => { displayMode.removeEventListener('change', refreshInstalled); window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled) }
  }, [])
  if (installed) return null
  const handleInstall = async () => {
    if (!isSecure || !isProduction || !installPrompt) { guide.current?.showModal(); return }
    const prompt = installPrompt
    setInstallPrompt(null)
    await prompt.prompt()
    const choice = await prompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
  }
  return <>
    <button type="button" className="button outline pwa-install-button" onClick={handleInstall}><Download size={15}/>{installPrompt ? 'Installer Beaurn' : isAppleMobile ? 'Ajouter Beaurn à l’écran d’accueil' : 'Comment installer Beaurn'}</button>
    <dialog ref={guide} className="pwa-install-guide" aria-labelledby="pwa-guide-title" onClick={event => { if (event.target === guide.current) guide.current?.close() }}>
      <div className="pwa-guide-content"><button type="button" className="pwa-guide-close" aria-label="Fermer" onClick={() => guide.current?.close()}><X size={19}/></button><span className="eyebrow">BEAURN SUR VOTRE TÉLÉPHONE</span><h2 id="pwa-guide-title">Installer l’application</h2>
        {!isSecure && <p className="pwa-guide-warning">Cette adresse n’est pas sécurisée. Ouvrez la version du site en HTTPS pour pouvoir l’installer.</p>}
        {isSecure && !isProduction && <p className="pwa-guide-warning">Cette prévisualisation locale n’est pas la version installable. Publiez le site sur une adresse HTTPS, puis ouvrez cette adresse sur votre téléphone.</p>}
        {isSecure && isProduction && (isAppleMobile ? <p>Dans Safari, touchez <strong>Partager</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>. Activez ensuite <strong>Ouvrir comme app</strong>.</p> : <p>Dans Chrome, ouvrez le menu <strong>⋮</strong>, puis choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p>)}
        {isSecure && isProduction && <p className="pwa-guide-note">L’installation ajoute Beaurn à votre écran d’accueil et ouvre le site dans une fenêtre dédiée.</p>}
      </div>
    </dialog>
  </>
}
function SectionTitle({ eyebrow, children, id }: { eyebrow: string; children: React.ReactNode; id?: string }) { return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2 id={id}>{children}</h2></div> }
function Photo({ label, className = '', art = 'exp-0', eager = false }: { label: string; className?: string; art?: string; eager?: boolean }) { return <div className={`photo photo-${art} ${className}`}><img src={photoAssets[art] ?? photoAssets['exp-0']} alt={label} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} /></div> }
function Header() {
  const [open, setOpen] = useState(false); const location = useLocation(); const trigger = useRef<HTMLButtonElement>(null); const panel = useRef<HTMLDivElement>(null); const wasOpen = useRef(false)
  useEffect(() => { setOpen(false) }, [location])
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open') }, [open])
  useEffect(() => { if (open) panel.current?.querySelector<HTMLElement>('a')?.focus(); else if (wasOpen.current) trigger.current?.focus(); wasOpen.current = open; const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); if (open && e.key === 'Tab' && panel.current) { const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('a,button')); const first = focusable[0], last = focusable[focusable.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() } } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [open])
  const nav = [['Accueil', '/#accueil'], ['Nos cours', '/#cours'], ["L'équipe", '/#equipe'], ['Tarifs', '/#tarifs'], ['À propos', '/#a-propos'], ['Contact', '/#contact']]
  return <header className="header"><div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Navigation principale">{nav.map(([label, href]) => <Link key={label} to={href}>{label}</Link>)}</nav><div className="header-actions"><a className="login" href={SITE.login} {...external}>Se connecter</a><Button href={SITE.events} className="header-cta">Réserver une séance <ArrowRight size={15} /></Button></div><button ref={trigger} className="burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    <div ref={panel} id="mobile-navigation" className={`mobile-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}><nav aria-label="Navigation mobile">{nav.map(([label, href]) => <Link key={label} to={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav><Button href={SITE.events}>Réserver une séance <ArrowRight size={16} /></Button><InstallAppButton/><a className="login" href={SITE.login} {...external}>Se connecter</a><a className="social-mini" href={SITE.instagram} {...external}><Instagram size={17} /> Instagram</a></div>
  </header>
}
function Footer() {
  const quickLinks = [['Accueil','/#accueil'],['Nos cours','/#cours'],["L'équipe",'/#equipe'],['Planning','/planning'],['Tarifs','/#tarifs'],['À propos','/#a-propos'],['Contact','/#contact']]
  return <footer className="footer"><div className="container">
    <div className="footer-top">
      <div className="footer-brand"><Logo light/><p className="footer-tag">Reviens à toi.</p><p className="footer-slogan">{SITE.slogan}</p><Button href={SITE.events} className="footer-booking">Réserver une séance <ArrowRight size={14}/></Button></div>
      <nav className="footer-links" aria-label="Liens utiles"><h2>Liens utiles</h2>{quickLinks.map(([label,to])=><Link key={label} to={to}>{label}</Link>)}<a href={SITE.login} {...external}>Espace client</a><Link to="/galerie">Galerie</Link></nav>
      <div className="footer-contact"><h2>Nous contacter</h2><span><MapPin size={15}/><span>{SITE.address}<br/>Yaoundé, Cameroun</span></span><a href={`tel:${SITE.tel}`}><Phone size={15}/>{SITE.phone}</a><a href={wa()} {...external}>Écrire sur WhatsApp <ArrowRight size={13}/></a><a href={SITE.maps} {...external}>Itinéraire <ArrowRight size={13}/></a></div>
      <div className="footer-hours"><h2>Horaires</h2><p><strong>Mar – Ven</strong><span>08h – 20h</span></p><p><strong>Sam – Dim</strong><span>08h – 18h</span></p><p><strong>Lundi</strong><span>Fermé</span></p><div className="footer-social"><a href={SITE.instagram} aria-label="Instagram" {...external}><Instagram size={18}/></a><a href={SITE.tiktok} aria-label="TikTok" {...(SITE.tiktok !== '#' ? external : {})} title={SITE.tiktok === '#' ? 'Ajoutez VITE_TIKTOK_URL pour activer ce lien' : undefined}>♪</a><a href={wa()} aria-label="WhatsApp" {...external}>◉</a></div></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Beaurn Wellness Studio. Tous droits réservés.</span><span><Link to="/politique-de-confidentialite">Politique de confidentialité</Link><Link to="/conditions-generales">Conditions générales</Link></span></div>
  </div></footer>
}
function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation(); const navigationType = useNavigationType(); const previousPath = useRef(loc.pathname); const previousLocationKey = useRef(loc.key); const initialNavigation = useRef(true)
  useEffect(() => {
    const isNewNavigation = initialNavigation.current || loc.key !== previousLocationKey.current
    if (!isNewNavigation) return
    if (loc.hash) {
      const id = decodeURIComponent(loc.hash.slice(1))
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (loc.pathname !== previousPath.current && navigationType === 'PUSH') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    previousPath.current = loc.pathname
    previousLocationKey.current = loc.key
    initialNavigation.current = false
  }, [loc.key, loc.pathname, loc.hash, navigationType])
  useEffect(() => { const coach=coaches.find(c=>loc.pathname.endsWith(`/${c.slug}`)); const titles: Record<string,string> = { '/':'Beaurn Wellness Studio — Pilates & Yoga à Yaoundé','/planning':'Planning des cours — Beaurn Wellness Studio','/equipe':"Notre équipe — Beaurn Wellness Studio",'/galerie':"Galerie — Beaurn Wellness Studio",'/politique-de-confidentialite':'Politique de confidentialité — Beaurn Wellness Studio','/conditions-generales':"Conditions générales — Beaurn Wellness Studio" }; document.title = coach ? `${coach.name} — Beaurn Wellness Studio` : titles[loc.pathname] || 'Page introuvable — Beaurn Wellness Studio'; const canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if(canonical) canonical.href=`${window.location.origin}${loc.pathname}`; const ogUrl=document.querySelector<HTMLMetaElement>('meta[property="og:url"]'); if(ogUrl) ogUrl.content=`${window.location.origin}${loc.pathname}` }, [loc.pathname])
  return <><a href="#contenu" className="skip">Aller au contenu</a><Header/><main id="contenu">{children}</main><Footer/></>
}

function Planner({ full = false }: { full?: boolean }) {
  const iframeUrl = import.meta.env.VITE_RESERVIO_IFRAME_URL?.trim()
  return <div className={`reservio-embed ${full ? 'is-full' : 'is-compact'}`}>
    {iframeUrl ? <iframe title="Calendrier des cours et réservations Beaurn" src={iframeUrl} loading={full ? 'eager' : 'lazy'} referrerPolicy="strict-origin-when-cross-origin" allow="payment *" /> : <div className="reservio-live-fallback">
      <span className="reservio-calendar-icon" aria-hidden="true"><CalendarDays size={26}/></span>
      <div><span className="eyebrow">CALENDRIER EN DIRECT</span><h3>Horaires et disponibilités</h3><p>Retrouvez sur Reservio les prochaines séances, leurs horaires, les places disponibles et tous les détails avant de réserver.</p><Button href={SITE.events}>Voir le calendrier Reservio <ArrowRight size={15}/></Button></div>
    </div>}
    {iframeUrl && <p>Calendrier et disponibilités synchronisés avec Reservio. <a href={SITE.events} {...external}>Ouvrir Reservio dans un nouvel onglet</a>.</p>}
  </div>
}

function Home() {
  const [about, setAbout] = useState(false); const [toast, setToast] = useState(''); const [gallery, setGallery] = useState<number | null>(null)
  const [status, setStatus] = useState({ open: false, message: '' })
  useEffect(() => { const update = () => { const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Douala', weekday: 'long', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); const day = parts.find(p=>p.type==='weekday')?.value || 'Monday'; const hour = Number(parts.find(p=>p.type==='hour')?.value || '0'); const dayIndex = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day); const isWeekend = dayIndex >= 5; const open = dayIndex > 0 && hour >= 8 && hour < (isWeekend ? 18 : 20); let nextDay = day; if (dayIndex === 0) nextDay = 'Tuesday'; else if (hour >= (isWeekend ? 18 : 20)) nextDay = ['Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Tuesday'][dayIndex]; const french: Record<string,string> = { Monday:'lundi',Tuesday:'mardi',Wednesday:'mercredi',Thursday:'jeudi',Friday:'vendredi',Saturday:'samedi',Sunday:'dimanche' }; const when = hour < 8 && dayIndex > 0 ? "aujourd'hui à 08h" : `${french[nextDay]} à 08h`; setStatus({ open, message: open ? 'Ouvert maintenant' : `Fermé — ouvre ${when}` }) }; update(); const timer=window.setInterval(update,60_000); return ()=>window.clearInterval(timer) }, [])
  useEffect(() => { if (gallery === null) return; const key=(e:KeyboardEvent)=>{ if(e.key==='Escape') setGallery(null); if(e.key==='ArrowLeft') setGallery(g=>(g===null?null:(g+2)%3)); if(e.key==='ArrowRight') setGallery(g=>(g===null?null:(g+1)%3)) }; window.addEventListener('keydown',key); return ()=>window.removeEventListener('keydown',key) }, [gallery])
  const share = async () => { try { if (navigator.share) await navigator.share({ title: SITE.name, url: location.href }); else { await navigator.clipboard.writeText(location.href); setToast('Lien copié'); setTimeout(()=>setToast(''),2400) } } catch { /* partage annulé */ } }
  return <>
    <section className="hero" id="accueil"><Photo label="Studio lumineux et pratique de mouvement" art="hero" eager/><div className="hero-overlay"/><div className="container hero-content"><span className="eyebrow">PILATES · YOGA · BIEN-ÊTRE</span><h1>Reviens à toi.</h1><p>Bouge, respire, renforce-toi.<br/>Le Pilates pour un corps plus fort, un esprit plus serein.</p><Button href={SITE.events}>Réserver une séance <ArrowRight size={16}/></Button><small><MapPin size={14}/> Yaoundé · Cameroun</small></div><a className="hero-scroll" href="#a-propos" aria-label="Découvrir Beaurn"><ArrowDown size={18}/></a></section>
    <section id="a-propos" className="section philosophy"><div className="container philosophy-grid"><Photo label="Étirement dans un studio chaleureux" art="stretch"/><div><span className="eyebrow">NOTRE PHILOSOPHIE</span><h2>Plus qu'un sport,<br/><em>un retour à soi.</em></h2><p>Chez Beaurn, nous croyons que chaque corps est unique et mérite d'être écouté. Notre approche du Pilates allie mouvement, respiration et bienveillance pour vous aider à vous reconnecter à votre corps, à votre énergie et à votre équilibre, à votre rythme.</p><button className="button outline" aria-expanded={about} aria-controls="about-more" onClick={()=>setAbout(!about)}>{about ? 'Réduire' : 'Découvrir Beaurn'} <ArrowRight size={15}/></button></div></div>{about && <div id="about-more" className="container about-more"><p className="slogan">{SITE.slogan}</p><h3>Qui sommes-nous ?</h3><p>Pour les abonnements, contactez-nous sur WhatsApp et dites-nous ce que vous voulez : cela sera ajouté à votre profil client. Le paiement se fera ensuite sur place. Les séances sont à répartir comme vous le voulez.</p><p>Chez Beaurn, nous portons une vision simple et profonde : <strong>le mouvement est une renaissance.</strong> Ici, chaque respiration, chaque posture et chaque relâchement musculaire est bien plus qu'un exercice physique. C'est un retour à soi, une reconnexion à son propre rythme, un pas vers une version plus alignée, plus sereine et plus puissante de soi-même. Notre vision est universelle : s'adresser à toutes les femmes, à tous les corps, à tous les âges, mais profondément enracinée dans notre réalité locale.</p><p>Beaurn n'est pas une simple importation du Pilates : c'est une réinvention, un espace d'éveil qui honore les valeurs camerounaises de communauté, de respect du corps et d'écoute intérieure, tout en intégrant les codes contemporains du bien-être holistique. Chez Beaurn, il n'y a pas de corps « idéal », pas de niveau « minimum », pas d'attentes impossibles. Il y a vous, exactement comme vous êtes aujourd'hui. Et cela suffit pour commencer.</p></div>}</section>
    <section className="values"><div className="container values-grid">{[[<Flower2/>, 'Tous les corps', 'Aucune condition physique préalable. Ici, vous êtes à votre place.'],[<Heart/>, 'Tous les niveaux', 'Débutant·e ou confirmé·e, nous vous accompagnons avec bienveillance.'],[<UserRound/>, 'Une approche globale', 'Force, souplesse, mobilité et équilibre, pour un bien-être durable.']].map(([icon,title,desc],i)=><article key={i}><span className="icon-circle">{icon}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
    <section className="section courses-section" id="cours"><div className="container"><div className="section-row"><SectionTitle eyebrow="NOS COURS">Des pratiques pour chaque besoin</SectionTitle><Link className="text-link" to="/planning">Voir tous les cours <ArrowRight size={15}/></Link></div><div className="course-grid">{courses.map((c,i)=><Link key={c.slug} to="/planning" className="course-card"><Photo label={c.name} art={`course-${i}`}/><div className="course-shade"/><div className="course-copy"><h3>{c.name}</h3><p>{c.desc}</p><small><Clock3 size={13}/> {c.duration} min <i/> {c.level}</small></div></Link>)}</div></div></section>
    <section className="planning-teaser" id="planning"><Photo label="Salle de Pilates aux tons chauds" art="planning-bg"/><div className="teaser-shade"/><div className="container teaser-layout"><div className="teaser-copy"><span className="eyebrow">PLANNING DES COURS</span><h2>Trouvez le créneau qui vous convient</h2><p>Consultez notre planning hebdomadaire et réservez votre séance en ligne.</p><Button to="/planning" variant="light">Voir le planning <ArrowRight size={15}/></Button></div><Planner/></div></section>
    <section className="section pricing-section" id="tarifs"><div className="container pricing-layout"><div className="pricing-intro"><SectionTitle eyebrow="NOS FORMULES">Des séances qui s'adaptent à votre rythme</SectionTitle><p>Choisissez la formule qui vous convient et avancez à votre propre rythme, vers vos objectifs.</p><Button href={wa('Bonjour, je souhaite en savoir plus sur vos formules.')}><span className="wa-mark">◉</span> Nous contacter (WhatsApp)</Button></div><div className="price-area"><div className="price-grid">{[['Séance à l’unité','7 000','Par séance'],['Carte de 4 séances','25 000','Soit 6 250 FCFA la séance'],['Carte de 8 séances','36 000','Soit 4 500 FCFA la séance']].map(([title,price,sub])=><article className="price-card" key={title}><h3>{title}</h3><strong>{price} <small>FCFA</small></strong><p>{sub}</p><a href={wa(`Bonjour, je souhaite réserver : ${title}.`)} {...external} className="button primary">Réserver</a></article>)}<article className="price-card subscription"><span className="icon-circle"><BadgeInfo/></span><h3>Abonnements et plus d'informations</h3><a href={wa('Bonjour, je souhaite en savoir plus sur les abonnements.')} {...external} className="button primary">Écrire sur WhatsApp</a></article></div><p className="price-note"><Info size={15}/> Les séances des cartes sont à répartir comme vous le voulez. Pour un abonnement : contactez-nous sur WhatsApp et dites-nous ce que vous voulez, cela sera ajouté à votre profil client. Le paiement se fait ensuite sur place.</p></div></div></section>
    <section className="section team-section" id="equipe"><div className="container split-intro"><div><SectionTitle eyebrow="NOTRE ÉQUIPE">Des coachs engagées à vos côtés</SectionTitle><p>Passionnées et bienveillantes, nos coachs vous accompagnent dans votre parcours, à chaque étape.</p><Button to="/equipe" variant="outline">Découvrir l'équipe <ArrowRight size={15}/></Button></div><div className="coach-grid">{coaches.map((c,i)=><Link key={c.slug} to={`/equipe/${c.slug}`} className="coach-card"><Photo label={c.name} art={`coach-${i}`}/><span><strong>{c.name}</strong><small>{c.role}</small></span></Link>)}</div></div></section>
    <section className="section experience"><div className="container experience-layout"><div><span className="eyebrow">L'EXPÉRIENCE BEAURN</span><p>Un lieu apaisant, une ambiance chaleureuse, et une communauté bienveillante.</p><Button to="/galerie" variant="outline">Voir la galerie <ArrowRight size={15}/></Button><a className="insta-link" href={SITE.instagram} {...external}><Instagram size={15}/> Suivez-nous sur Instagram @beaurncmr</a></div><div className="experience-photos">{['Salle et lumière douce','Tapis roulé et accessoires','Cours collectif de Pilates'].map((label,i)=><button key={label} aria-label={`Agrandir : ${label}`} onClick={()=>setGallery(i)}><Photo label={label} art={`exp-${i}`}/></button>)}</div></div></section>
    <section className="section contact-section" id="contact"><div className="container"><SectionTitle eyebrow="INFOS PRATIQUES">Nous trouver</SectionTitle><div className="contact-layout"><div className="contact-info"><article><MapPin/><div><b>Camp SIC, Titi Garage</b><span>Yaoundé, Cameroun</span><small>Titi garage, Camp SIC</small></div></article><article><Phone/><div><a href={`tel:${SITE.tel}`}><b>{SITE.phone}</b></a><a href={wa()} {...external}>Écrire sur WhatsApp</a></div></article><article><Clock3/><div><b>Horaires</b><span>Mar – Ven : 08h – 20h</span><span>Sam – Dim : 08h – 18h</span><span>Lundi : Fermé</span><small className={`status ${status.open?'is-open':''}`}><i/> {status.message}</small></div></article><article className="map-warning"><MapPin/><div><b>Ne suivez pas aveuglément le GPS de la carte.</b><Button href={SITE.maps}>Voir sur la carte <ArrowRight size={14}/></Button></div></article><button className="share-button" onClick={share}><Share2 size={16}/> Partager</button>{toast && <span role="status" className="toast"><Check size={14}/> {toast}</span>}</div><Photo label="Coin du studio avec plante et banc" art="venue"/></div></div></section>
    {gallery !== null && <div className="modal-backdrop" role="presentation" onClick={()=>setGallery(null)}><div className="gallery-modal" role="dialog" aria-modal="true" aria-label="Galerie Beaurn" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label="Fermer la galerie" onClick={()=>setGallery(null)}><X/></button><button className="gallery-prev" aria-label="Photo précédente" onClick={()=>setGallery((gallery+2)%3)}><ChevronLeft/></button><Photo label={['Salle et lumière douce','Tapis roulé et accessoires','Cours collectif de Pilates'][gallery]} art={`exp-${gallery}`}/><button className="gallery-next" aria-label="Photo suivante" onClick={()=>setGallery((gallery+1)%3)}><ChevronRight/></button><p>{gallery+1} / 3 · {['Salle et lumière douce','Tapis roulé et accessoires','Cours collectif de Pilates'][gallery]}</p></div></div>}
  </>
}

function PlanningPage() { return <div className="inner-page"><div className="container"><p className="breadcrumbs"><Link to="/">Accueil</Link> / Événements</p><SectionTitle eyebrow="NOS COURS">Calendrier des cours</SectionTitle><p className="page-lead">Consultez les horaires, les disponibilités et les détails de chaque cours, puis réservez directement auprès de Reservio.</p><Planner full/></div></div> }
function TeamPage() { return <div className="inner-page"><div className="container"><p className="breadcrumbs"><Link to="/">Accueil</Link> / L'équipe</p><SectionTitle eyebrow="NOTRE ÉQUIPE">Des coachs engagées à vos côtés</SectionTitle><p className="page-lead">Cinq coachs pour vous accompagner avec bienveillance.</p><div className="team-full-grid">{coaches.map((c,i)=><CoachProfile key={c.slug} coach={c} index={i}/>)}</div></div></div> }
function CoachProfile({ coach, index }: { coach: typeof coaches[number]; index:number }) { return <Link className="coach-card" to={`/equipe/${coach.slug}`}><Photo label={coach.name} art={`coach-${index}`}/><span><strong>{coach.name}</strong><small>{coach.role}</small></span></Link> }
function CoachPage() { const { slug = '' }=useParams(); const coach=coaches.find(c=>c.slug===slug); if(!coach) return <NotFound/>; const index=coaches.indexOf(coach); return <div className="inner-page"><div className="container"><p className="breadcrumbs"><Link to="/">Accueil</Link> / <Link to="/equipe">L'équipe</Link> / {coach.name}</p><div className="profile-layout"><Photo label={coach.name} art={`coach-${index}`}/><div><span className="eyebrow">NOTRE ÉQUIPE</span><h1>{coach.name}</h1><p className="profile-role">{coach.role}</p><p>Votre coach est là pour vous accompagner dans votre parcours de remise en forme, vous corriger et vous guider pour pratiquer en toute sécurité, adapter les exercices selon vos objectifs et votre niveau, et rendre chaque séance efficace, motivante et agréable. Avec son expertise et sa passion pour le Pilates, elle vous aidera à renforcer votre corps, améliorer votre posture et retrouver souplesse et équilibre.</p><Button href={SITE.events}>Réserver avec {coach.name} <ArrowRight size={15}/></Button></div></div><h2 className="profile-planning-title">Cours disponibles sur Reservio</h2><p className="page-lead">Consultez le calendrier en direct pour voir les séances, leurs détails et les places restantes.</p><Planner full/><div className="profile-contact"><b>Beaurn Wellness Studio</b><span>{SITE.address} · Yaoundé, Cameroun</span><a href={`tel:${SITE.tel}`}>{SITE.phone}</a><span>Mar – Ven : 08h – 20h · Sam – Dim : 08h – 18h · Lundi fermé</span></div></div></div> }
function GalleryPage() { const [selected,setSelected]=useState<number|null>(null); const imgs=['Salle et tapis roulés','Accessoires de pratique','Cours collectif au studio','Étirement et mobilité','Méditation en groupe','Salle préparée pour les cours']; return <div className="inner-page"><div className="container"><p className="breadcrumbs"><Link to="/">Accueil</Link> / Galerie</p><SectionTitle eyebrow="L'EXPÉRIENCE BEAURN">Un lieu pour revenir à soi</SectionTitle><div className="gallery-grid">{imgs.map((label,i)=><button key={label} onClick={()=>setSelected(i)} aria-label={`Agrandir : ${label}`}><Photo label={label} art={`exp-${i}`}/></button>)}</div>{selected!==null&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="gallery-modal" role="dialog" aria-modal="true" aria-label="Photo galerie" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label="Fermer" onClick={()=>setSelected(null)}><X/></button><button className="gallery-prev" aria-label="Photo précédente" onClick={()=>setSelected((selected+imgs.length-1)%imgs.length)}><ChevronLeft/></button><Photo label={imgs[selected]} art={`exp-${selected}`}/><button className="gallery-next" aria-label="Photo suivante" onClick={()=>setSelected((selected+1)%imgs.length)}><ChevronRight/></button><p>{imgs[selected]}</p></div></div>}</div></div> }
function LegalPage({ terms=false }: {terms?:boolean}) { const title=terms?'Conditions générales':'Politique de confidentialité'; const link=terms?SITE.terms:SITE.privacy; return <div className="inner-page legal"><div className="container"><p className="breadcrumbs"><Link to="/">Accueil</Link> / {title}</p><SectionTitle eyebrow="BEAURN WELLNESS STUDIO">{title}</SectionTitle><p>Cette page présente un gabarit à compléter et à valider par Beaurn Wellness Studio.</p><p><strong>Contenu à valider par Beaurn Wellness Studio.</strong> Les informations définitives relatives à {terms?'l’utilisation des services, aux réservations et aux paiements':'la collecte, l’utilisation et la conservation des données personnelles'} devront être ajoutées avant publication.</p><h2>Version actuelle</h2><p>Consultez également le document actuellement hébergé par Reservio :</p><a className="text-link" href={link} {...external}>{title} sur Reservio <ArrowRight size={15}/></a><h2>Contact</h2><p>Beaurn Wellness Studio · Camp SIC, Titi Garage, Yaoundé, Cameroun · <a href={`tel:${SITE.tel}`}>{SITE.phone}</a></p></div></div> }
function NotFound() { return <div className="inner-page"><div className="container not-found"><span className="eyebrow">PAGE INTROUVABLE</span><h1>On se retrouve à l'accueil ?</h1><Button to="/">Retour à l'accueil <ArrowRight size={15}/></Button></div></div> }
function AppRoutes() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/planning" element={<PlanningPage/>}/><Route path="/equipe" element={<TeamPage/>}/><Route path="/equipe/:slug" element={<CoachPage/>}/><Route path="/galerie" element={<GalleryPage/>}/><Route path="/politique-de-confidentialite" element={<LegalPage/>}/><Route path="/conditions-generales" element={<LegalPage terms/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout> }
export default function App() { return <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppRoutes/></BrowserRouter> }
