import type { ReactElement } from 'react';

type Tier = {
	id: 'free' | 'pro' | 'business';
	name: string;
	price: string;
	period: string;
	description: string;
	cta: string;
	highlight: boolean;
	badge?: string;
	features: string[];
};

const tiers: Tier[] = [
	{
		id: 'free',
		name: 'Free',
		price: '$0',
		period: 'forever',
		description: 'Everything you need to get started with modern team communication.',
		cta: 'Current plan',
		highlight: false,
		features: [
			'Up to 25 team members',
			'10,000 message history',
			'10 channels & direct messages',
			'500 MB file storage',
			'Basic integrations (10 apps)',
			'Community support',
		],
	},
	{
		id: 'pro',
		name: 'Pro',
		price: '$8',
		period: 'per user / month',
		description: 'Advanced features for growing teams that need more power and control.',
		cta: 'Upgrade to Pro',
		highlight: true,
		badge: 'Most popular',
		features: [
			'Unlimited team members',
			'Unlimited message history',
			'Unlimited channels',
			'50 GB file storage',
			'Unlimited integrations',
			'Priority email support',
			'Advanced analytics dashboard',
			'Custom roles & permissions',
			'Guest user accounts',
			'Two-factor authentication',
		],
	},
	{
		id: 'business',
		name: 'Business',
		price: 'Custom',
		period: 'contact us',
		description: 'Enterprise-grade security, compliance, and dedicated support for large organisations.',
		cta: 'Contact sales',
		highlight: false,
		features: [
			'Everything in Pro',
			'Unlimited file storage',
			'SSO / SAML / LDAP',
			'Custom branding & white-label',
			'SLA-backed uptime guarantee',
			'Dedicated account manager',
			'On-premise deployment option',
			'Advanced audit logs',
			'Custom data retention policies',
			'Compliance exports (GDPR, HIPAA)',
		],
	},
];

type CompareRow = {
	feature: string;
	free: boolean | string;
	pro: boolean | string;
	business: boolean | string;
};

const compareRows: CompareRow[] = [
	{ feature: 'Team members', free: '25', pro: 'Unlimited', business: 'Unlimited' },
	{ feature: 'Message history', free: '10,000', pro: 'Unlimited', business: 'Unlimited' },
	{ feature: 'File storage', free: '500 MB', pro: '50 GB', business: 'Unlimited' },
	{ feature: 'Integrations / apps', free: '10', pro: 'Unlimited', business: 'Unlimited' },
	{ feature: 'Guest accounts', free: false, pro: true, business: true },
	{ feature: 'Custom roles & permissions', free: false, pro: true, business: true },
	{ feature: 'Two-factor authentication', free: false, pro: true, business: true },
	{ feature: 'Advanced analytics', free: false, pro: true, business: true },
	{ feature: 'Audit logs', free: false, pro: false, business: true },
	{ feature: 'SSO / SAML / LDAP', free: false, pro: false, business: true },
	{ feature: 'Custom branding', free: false, pro: false, business: true },
	{ feature: 'SLA uptime guarantee', free: false, pro: false, business: true },
	{ feature: 'On-premise deployment', free: false, pro: false, business: true },
	{ feature: 'Dedicated account manager', free: false, pro: false, business: true },
];

function Check(): ReactElement {
	return (
		<svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden='true'>
			<circle cx='9' cy='9' r='9' fill='#6C63FF' fillOpacity='0.12' />
			<path d='M5 9l3 3 5-5' stroke='#6C63FF' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	);
}

function Cross(): ReactElement {
	return (
		<svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden='true'>
			<path d='M6 6l6 6M12 6l-6 6' stroke='#9CA3AF' strokeWidth='1.75' strokeLinecap='round' />
		</svg>
	);
}

function CellValue({ value }: { value: boolean | string }): ReactElement {
	if (typeof value === 'string') {
		return <span className='nexa-compare__cell-text'>{value}</span>;
	}
	return value ? <Check /> : <Cross />;
}

export function NexaPremiumPage(): ReactElement {
	return (
		<div className='nexa-premium'>
			{/* Header */}
			<header className='nexa-premium__header'>
				<div className='nexa-premium__header-eyebrow'>Nexa Chat Premium</div>
				<h1 className='nexa-premium__header-title'>Choose the right plan for your team</h1>
				<p className='nexa-premium__header-subtitle'>
					Start free and scale as you grow. No hidden fees, no surprises.
				</p>
			</header>

			{/* Tier cards */}
			<div className='nexa-premium__tiers'>
				{tiers.map((tier) => (
					<div
						key={tier.id}
						className={`nexa-premium__tier${tier.highlight ? ' nexa-premium__tier--highlight' : ''}`}
					>
						{tier.badge && (
							<div className='nexa-premium__tier-badge'>{tier.badge}</div>
						)}
						<div className='nexa-premium__tier-header'>
							<div className='nexa-premium__tier-name'>{tier.name}</div>
							<div className='nexa-premium__tier-price'>
								<span className='nexa-premium__tier-price-amount'>{tier.price}</span>
								{tier.price !== 'Custom' && (
									<span className='nexa-premium__tier-price-period'>{tier.period}</span>
								)}
							</div>
							<p className='nexa-premium__tier-desc'>{tier.description}</p>
						</div>

						<button
							type='button'
							className={`nexa-premium__tier-cta${tier.highlight ? ' nexa-premium__tier-cta--primary' : ''}`}
						>
							{tier.cta}
						</button>

						<ul className='nexa-premium__tier-features'>
							{tier.features.map((f) => (
								<li key={f} className='nexa-premium__tier-feature'>
									<Check />
									<span>{f}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			{/* Feature comparison table */}
			<section className='nexa-compare'>
				<h2 className='nexa-compare__title'>Full feature comparison</h2>
				<div className='nexa-compare__table-wrapper'>
					<table className='nexa-compare__table'>
						<thead>
							<tr>
								<th className='nexa-compare__th nexa-compare__th--feature'>Feature</th>
								<th className='nexa-compare__th'>Free</th>
								<th className='nexa-compare__th nexa-compare__th--highlight'>Pro</th>
								<th className='nexa-compare__th'>Business</th>
							</tr>
						</thead>
						<tbody>
							{compareRows.map((row) => (
								<tr key={row.feature} className='nexa-compare__tr'>
									<td className='nexa-compare__td nexa-compare__td--feature'>{row.feature}</td>
									<td className='nexa-compare__td'><CellValue value={row.free} /></td>
									<td className='nexa-compare__td nexa-compare__td--highlight'><CellValue value={row.pro} /></td>
									<td className='nexa-compare__td'><CellValue value={row.business} /></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Footer CTA */}
			<footer className='nexa-premium__footer'>
				<p className='nexa-premium__footer-text'>
					Questions? <a href='https://nexachat.com/contact-sales' target='_blank' rel='noopener noreferrer'>Talk to our sales team</a>
				</p>
			</footer>
		</div>
	);
}

export default NexaPremiumPage;
