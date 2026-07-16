import type { ReactElement } from 'react';

// ─── Feature data ───────────────────────────────────────────────────────────

type Feature = { icon: string; title: string; body: string };

const features: Feature[] = [
	{
		icon: '💬',
		title: 'Real-time messaging',
		body: 'Send messages, files, and reactions instantly. Threads keep conversations organised without drowning the main channel.',
	},
	{
		icon: '🔒',
		title: 'End-to-end encryption',
		body: 'Every private conversation is secured with E2EE. Only you and your recipient can read what you send.',
	},
	{
		icon: '🤖',
		title: 'Built-in AI assistant',
		body: 'Summarise long threads, draft replies, and extract action items — all without leaving the chat window.',
	},
	{
		icon: '👥',
		title: 'Social graph',
		body: 'Add friends, see mutual connections, and build your professional network directly inside your workspace.',
	},
	{
		icon: '🔗',
		title: '500+ integrations',
		body: 'Connect GitHub, Jira, Zapier, Slack bridges, and hundreds more via the Nexa Marketplace.',
	},
	{
		icon: '📱',
		title: 'Everywhere you work',
		body: 'Native apps for iOS, Android, Windows, macOS and Linux. Web client works in any modern browser.',
	},
];

// ─── Testimonial data ────────────────────────────────────────────────────────

type Testimonial = { quote: string; name: string; role: string; initials: string; color: string };

const testimonials: Testimonial[] = [
	{
		quote: 'Nexa Chat replaced three tools we were paying for. Onboarding took under an hour and the team has never looked back.',
		name: 'Priya Sharma',
		role: 'CTO, Luminary Labs',
		initials: 'PS',
		color: '#6C63FF',
	},
	{
		quote: 'The AI summary feature alone saves me 30 minutes every morning. I actually look forward to catching up on overnight threads now.',
		name: 'David Okonkwo',
		role: 'Engineering Manager, Vertex Systems',
		initials: 'DO',
		color: '#8B5CF6',
	},
	{
		quote: "We migrated 400 users from Slack in a weekend. The import tooling is surprisingly painless and the pricing can't be beat.",
		name: 'Sophie Marchand',
		role: 'Head of Operations, Aether Co.',
		initials: 'SM',
		color: '#A78BFA',
	},
];

// ─── FAQ data ────────────────────────────────────────────────────────────────

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
	{
		q: 'Is Nexa Chat really free for small teams?',
		a: 'Yes — teams of up to 25 people get the full Free tier forever, with 10,000 message history and 10 channels. No credit card required.',
	},
	{
		q: 'Can I self-host Nexa Chat?',
		a: 'Absolutely. Business plan customers can deploy Nexa Chat on their own infrastructure. We provide Docker images, Kubernetes Helm charts, and full documentation.',
	},
	{
		q: 'How does end-to-end encryption work?',
		a: 'E2EE uses per-session key pairs generated on your device. The server never holds your decryption keys, so even Nexa Chat admins cannot read encrypted messages.',
	},
	{
		q: 'Can I import history from Slack or another tool?',
		a: 'Yes. We support imports from Slack, HipChat, and CSV exports. Existing channels, users, and message history all transfer cleanly.',
	},
	{
		q: 'What happens when I exceed the Free tier limits?',
		a: "Older messages fall outside the 10,000-message window but are not deleted. Upgrade to Pro at any time to unlock the full history — it'll all still be there.",
	},
];

// ─── Component ───────────────────────────────────────────────────────────────

export function NexaLanding(): ReactElement {
	return (
		<div className='nexa-landing'>
			{/* Nav */}
			<nav className='nexa-landing__nav'>
				<a href='/' className='nexa-landing__nav-logo' aria-label='Nexa Chat home'>
					<span className='nexa-landing__nav-logo-mark' aria-hidden='true'>N</span>
					<span className='nexa-landing__nav-logo-text'>Nexa Chat</span>
				</a>
				<ul className='nexa-landing__nav-links'>
					<li><a href='#features'>Features</a></li>
					<li><a href='#pricing'>Pricing</a></li>
					<li><a href='#faq'>FAQ</a></li>
				</ul>
				<div className='nexa-landing__nav-actions'>
					<a href='/login' className='nexa-landing__btn nexa-landing__btn--ghost'>Sign in</a>
					<a href='/register' className='nexa-landing__btn nexa-landing__btn--primary'>Get started free</a>
				</div>
			</nav>

			{/* Hero */}
			<section className='nexa-landing__hero' aria-labelledby='hero-heading'>
				<div className='nexa-landing__hero-content'>
					<div className='nexa-landing__hero-eyebrow'>Next-generation team communication</div>
					<h1 id='hero-heading' className='nexa-landing__hero-heading'>
						Where your team<br />
						<span className='nexa-landing__hero-heading-accent'>does its best work</span>
					</h1>
					<p className='nexa-landing__hero-body'>
						Nexa Chat brings together real-time messaging, AI-powered summaries, end-to-end encryption, and
						a rich social graph — in one beautifully designed workspace.
					</p>
					<div className='nexa-landing__hero-ctas'>
						<a href='/register' className='nexa-landing__btn nexa-landing__btn--primary nexa-landing__btn--lg'>
							Start for free
						</a>
						<a href='#features' className='nexa-landing__btn nexa-landing__btn--ghost nexa-landing__btn--lg'>
							See how it works
						</a>
					</div>
					<p className='nexa-landing__hero-note'>No credit card required &middot; Free forever for small teams</p>
				</div>
				<div className='nexa-landing__hero-visual' aria-hidden='true'>
					<div className='nexa-landing__chat-preview'>
						<div className='nexa-landing__chat-preview-header'>
							<span className='nexa-landing__chat-preview-channel'># design-team</span>
							<span className='nexa-landing__chat-preview-members'>12 members</span>
						</div>
						<div className='nexa-landing__chat-preview-messages'>
							<div className='nexa-landing__preview-msg'>
								<div className='nexa-landing__preview-avatar' style={{ background: '#6C63FF' }}>AK</div>
								<div>
									<div className='nexa-landing__preview-name'>Aiko Kimura</div>
									<div className='nexa-landing__preview-text'>Just shipped the redesign. Check Figma link in pinned messages.</div>
								</div>
							</div>
							<div className='nexa-landing__preview-msg'>
								<div className='nexa-landing__preview-avatar' style={{ background: '#8B5CF6' }}>MR</div>
								<div>
									<div className='nexa-landing__preview-name'>Marcus Reid</div>
									<div className='nexa-landing__preview-text'>Looks incredible! The color system is so clean.</div>
								</div>
							</div>
							<div className='nexa-landing__preview-msg nexa-landing__preview-msg--ai'>
								<div className='nexa-landing__preview-avatar nexa-landing__preview-avatar--ai'>AI</div>
								<div>
									<div className='nexa-landing__preview-name'>Nexa AI <span className='nexa-landing__ai-badge'>Assistant</span></div>
									<div className='nexa-landing__preview-text'>Thread summary: Aiko shipped the Figma redesign. Marcus approved the color system. No open action items.</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section id='features' className='nexa-landing__section nexa-landing__section--features' aria-labelledby='features-heading'>
				<div className='nexa-landing__section-inner'>
					<div className='nexa-landing__section-header'>
						<div className='nexa-landing__eyebrow'>Capabilities</div>
						<h2 id='features-heading' className='nexa-landing__section-title'>
							Everything your team needs
						</h2>
						<p className='nexa-landing__section-subtitle'>
							Powerful features that scale from a two-person startup to a 10,000-person enterprise.
						</p>
					</div>
					<ul className='nexa-landing__features-grid'>
						{features.map((f) => (
							<li key={f.title} className='nexa-landing__feature-card'>
								<div className='nexa-landing__feature-icon' aria-hidden='true'>{f.icon}</div>
								<h3 className='nexa-landing__feature-title'>{f.title}</h3>
								<p className='nexa-landing__feature-body'>{f.body}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Social proof */}
			<section className='nexa-landing__section nexa-landing__section--testimonials' aria-labelledby='testimonials-heading'>
				<div className='nexa-landing__section-inner'>
					<div className='nexa-landing__section-header'>
						<div className='nexa-landing__eyebrow'>Trusted by teams worldwide</div>
						<h2 id='testimonials-heading' className='nexa-landing__section-title'>
							What people are saying
						</h2>
					</div>
					<ul className='nexa-landing__testimonials'>
						{testimonials.map((t) => (
							<li key={t.name} className='nexa-landing__testimonial'>
								<blockquote className='nexa-landing__testimonial-quote'>&ldquo;{t.quote}&rdquo;</blockquote>
								<footer className='nexa-landing__testimonial-footer'>
									<div
										className='nexa-landing__testimonial-avatar'
										style={{ background: t.color }}
										aria-hidden='true'
									>
										{t.initials}
									</div>
									<div>
										<div className='nexa-landing__testimonial-name'>{t.name}</div>
										<div className='nexa-landing__testimonial-role'>{t.role}</div>
									</div>
								</footer>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Pricing teaser */}
			<section id='pricing' className='nexa-landing__section nexa-landing__section--pricing' aria-labelledby='pricing-heading'>
				<div className='nexa-landing__section-inner nexa-landing__section-inner--narrow'>
					<div className='nexa-landing__section-header'>
						<div className='nexa-landing__eyebrow'>Simple pricing</div>
						<h2 id='pricing-heading' className='nexa-landing__section-title'>
							Start free, scale when ready
						</h2>
						<p className='nexa-landing__section-subtitle'>
							No per-seat gotchas on the Free tier. When you grow, Pro is just&nbsp;
							<strong>$8 per user per month</strong>.
						</p>
					</div>
					<div className='nexa-landing__pricing-cards'>
						<div className='nexa-landing__pricing-card'>
							<div className='nexa-landing__pricing-name'>Free</div>
							<div className='nexa-landing__pricing-amount'>$0</div>
							<div className='nexa-landing__pricing-desc'>Up to 25 members, forever.</div>
							<a href='/register' className='nexa-landing__btn nexa-landing__btn--outline nexa-landing__btn--full'>Get started</a>
						</div>
						<div className='nexa-landing__pricing-card nexa-landing__pricing-card--highlight'>
							<div className='nexa-landing__pricing-badge'>Most popular</div>
							<div className='nexa-landing__pricing-name'>Pro</div>
							<div className='nexa-landing__pricing-amount'>$8 <span>/ user / mo</span></div>
							<div className='nexa-landing__pricing-desc'>Unlimited everything. Priority support.</div>
							<a href='/register' className='nexa-landing__btn nexa-landing__btn--primary nexa-landing__btn--full'>Start Pro trial</a>
						</div>
						<div className='nexa-landing__pricing-card'>
							<div className='nexa-landing__pricing-name'>Business</div>
							<div className='nexa-landing__pricing-amount'>Custom</div>
							<div className='nexa-landing__pricing-desc'>SSO, self-host, dedicated support.</div>
							<a href='https://nexachat.com/contact-sales' className='nexa-landing__btn nexa-landing__btn--outline nexa-landing__btn--full'>Contact sales</a>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section id='faq' className='nexa-landing__section' aria-labelledby='faq-heading'>
				<div className='nexa-landing__section-inner nexa-landing__section-inner--narrow'>
					<div className='nexa-landing__section-header'>
						<div className='nexa-landing__eyebrow'>FAQ</div>
						<h2 id='faq-heading' className='nexa-landing__section-title'>Common questions</h2>
					</div>
					<dl className='nexa-landing__faq'>
						{faqs.map((item) => (
							<div key={item.q} className='nexa-landing__faq-item'>
								<dt className='nexa-landing__faq-q'>{item.q}</dt>
								<dd className='nexa-landing__faq-a'>{item.a}</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			{/* Bottom CTA */}
			<section className='nexa-landing__section nexa-landing__section--cta' aria-labelledby='cta-heading'>
				<div className='nexa-landing__section-inner nexa-landing__section-inner--narrow'>
					<h2 id='cta-heading' className='nexa-landing__cta-title'>
						Ready to transform how your team communicates?
					</h2>
					<p className='nexa-landing__cta-body'>
						Join thousands of teams already using Nexa Chat. Set up takes less than five minutes.
					</p>
					<a href='/register' className='nexa-landing__btn nexa-landing__btn--primary nexa-landing__btn--xl'>
						Create your free workspace
					</a>
				</div>
			</section>

			{/* Footer */}
			<footer className='nexa-landing__footer'>
				<div className='nexa-landing__footer-inner'>
					<div className='nexa-landing__footer-brand'>
						<span className='nexa-landing__nav-logo-mark' aria-hidden='true'>N</span>
						<span className='nexa-landing__nav-logo-text'>Nexa Chat</span>
					</div>
					<nav className='nexa-landing__footer-links' aria-label='Footer navigation'>
						<a href='https://nexachat.com/docs'>Documentation</a>
						<a href='https://nexachat.com/privacy'>Privacy</a>
						<a href='https://nexachat.com/terms'>Terms</a>
						<a href='https://nexachat.com/contact-sales'>Contact</a>
					</nav>
					<p className='nexa-landing__footer-copy'>&copy; {new Date().getFullYear()} Nexa Chat Inc. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}

export default NexaLanding;
