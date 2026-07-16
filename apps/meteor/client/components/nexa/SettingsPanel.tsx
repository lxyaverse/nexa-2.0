import { Box, Button, Toggle, Text, Select, Tab, Tabs, Icon } from '@rocket.chat/fuselage';
import type { ReactNode } from 'react';
import { useState, memo } from 'react';

type SettingSection = 'account' | 'appearance' | 'privacy' | 'notifications' | 'security';

type SettingsPanelProps = {
	onSave?: (settings: Record<string, any>) => void;
	onCancel?: () => void;
	loading?: boolean;
};

const SettingsPanel = ({ onSave, onCancel, loading = false }: SettingsPanelProps) => {
	const [activeTab, setActiveTab] = useState(0);
	const [settings, setSettings] = useState({
		// Account
		email: 'user@example.com',
		username: 'username',
		displayName: 'User Name',
		bio: 'Add your bio here',

		// Appearance
		theme: 'dark',
		fontSize: 'medium',
		compactMode: false,
		customColors: true,

		// Privacy
		profileVisibility: 'public',
		allowMessages: true,
		showOnlineStatus: true,
		allowFriendRequests: true,

		// Notifications
		emailNotifications: true,
		pushNotifications: true,
		desktopNotifications: true,
		soundNotifications: true,
		notificationLevel: 'mentions',

		// Security
		twoFactorEnabled: false,
		sessionTimeout: '30',
	});

	const handleSettingChange = (key: string, value: any) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSave = () => {
		onSave?.(settings);
	};

	const renderSettingRow = (label: string, key: string, type: 'toggle' | 'select' | 'input' = 'toggle', options?: Array<[string, string]>) => (
		<Box
			display='flex'
			justifyContent='space-between'
			alignItems='center'
			padding={12}
			borderBottom='1px solid'
			borderBottomColor='component'
		>
			<Text fontScale='p1'>{label}</Text>
			<Box>
				{type === 'toggle' && (
					<Toggle
						checked={settings[key]}
						onChange={() => handleSettingChange(key, !settings[key])}
					/>
				)}
				{type === 'select' && options && (
					<Select
						value={settings[key]}
						onChange={(value) => handleSettingChange(key, value)}
						options={options}
						width='200px'
					/>
				)}
			</Box>
		</Box>
	);

	return (
		<Box className='rcx-settings-panel' display='flex' flexDirection='column' height='100%'>
			<Box
				className='rcx-settings-panel__header'
				padding={16}
				borderBottom='1px solid'
				borderBottomColor='component'
			>
				<Text fontScale='h3' fontWeight='bold'>
					Settings
				</Text>
			</Box>

			<Box className='rcx-settings-panel__content' display='flex' flexGrow={1} overflow='auto'>
				<Tabs value={activeTab} onChange={setActiveTab} orientation='vertical' width='200px'>
					<Tab label={<Box display='flex' gap={8}><Icon name='user' /> Account</Box>}>
						<Box display='flex' flexDirection='column' padding={16} flexGrow={1}>
							<Text fontScale='p2' fontWeight='bold' marginBottom={12}>
								Account Settings
							</Text>
							{renderSettingRow('Email', 'email')}
							{renderSettingRow('Username', 'username')}
							{renderSettingRow('Display Name', 'displayName')}
							{renderSettingRow('Bio', 'bio')}
							<Box display='flex' gap={8} marginTop={16}>
								<Button onClick={() => handleSettingChange('password', true)}>
									Change Password
								</Button>
							</Box>
						</Box>
					</Tab>

					<Tab label={<Box display='flex' gap={8}><Icon name='palette' /> Appearance</Box>}>
						<Box display='flex' flexDirection='column' padding={16} flexGrow={1}>
							<Text fontScale='p2' fontWeight='bold' marginBottom={12}>
								Appearance Settings
							</Text>
							{renderSettingRow(
								'Theme',
								'theme',
								'select',
								[
									['light', 'Light'],
									['dark', 'Dark'],
									['auto', 'Auto (System)'],
								],
							)}
							{renderSettingRow(
								'Font Size',
								'fontSize',
								'select',
								[
									['small', 'Small'],
									['medium', 'Medium'],
									['large', 'Large'],
								],
							)}
							{renderSettingRow('Compact Mode', 'compactMode')}
							{renderSettingRow('Custom Colors', 'customColors')}
						</Box>
					</Tab>

					<Tab label={<Box display='flex' gap={8}><Icon name='shield' /> Privacy</Box>}>
						<Box display='flex' flexDirection='column' padding={16} flexGrow={1}>
							<Text fontScale='p2' fontWeight='bold' marginBottom={12}>
								Privacy Settings
							</Text>
							{renderSettingRow(
								'Profile Visibility',
								'profileVisibility',
								'select',
								[
									['public', 'Public'],
									['friends', 'Friends Only'],
									['private', 'Private'],
								],
							)}
							{renderSettingRow('Allow Direct Messages', 'allowMessages')}
							{renderSettingRow('Show Online Status', 'showOnlineStatus')}
							{renderSettingRow('Allow Friend Requests', 'allowFriendRequests')}
						</Box>
					</Tab>

					<Tab label={<Box display='flex' gap={8}><Icon name='bell' /> Notifications</Box>}>
						<Box display='flex' flexDirection='column' padding={16} flexGrow={1}>
							<Text fontScale='p2' fontWeight='bold' marginBottom={12}>
								Notification Settings
							</Text>
							{renderSettingRow('Email Notifications', 'emailNotifications')}
							{renderSettingRow('Push Notifications', 'pushNotifications')}
							{renderSettingRow('Desktop Notifications', 'desktopNotifications')}
							{renderSettingRow('Sound Notifications', 'soundNotifications')}
							{renderSettingRow(
								'Notify For',
								'notificationLevel',
								'select',
								[
									['mentions', 'Mentions Only'],
									['keywords', 'Keywords'],
									['all', 'All Messages'],
								],
							)}
						</Box>
					</Tab>

					<Tab label={<Box display='flex' gap={8}><Icon name='lock' /> Security</Box>}>
						<Box display='flex' flexDirection='column' padding={16} flexGrow={1}>
							<Text fontScale='p2' fontWeight='bold' marginBottom={12}>
								Security Settings
							</Text>
							{renderSettingRow('Two-Factor Authentication', 'twoFactorEnabled')}
							{renderSettingRow(
								'Session Timeout',
								'sessionTimeout',
								'select',
								[
									['15', '15 minutes'],
									['30', '30 minutes'],
									['60', '1 hour'],
									['never', 'Never'],
								],
							)}
							<Box display='flex' gap={8} marginTop={16}>
								<Button onClick={() => {}} secondary>
									Logout All Devices
								</Button>
								<Button onClick={() => {}} secondary>
									View Active Sessions
								</Button>
							</Box>
						</Box>
					</Tab>
				</Tabs>
			</Box>

			<Box
				className='rcx-settings-panel__footer'
				display='flex'
				gap={8}
				padding={16}
				borderTop='1px solid'
				borderTopColor='component'
				justifyContent='flex-end'
			>
				<Button onClick={onCancel} secondary>
					Cancel
				</Button>
				<Button onClick={handleSave} primary disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</Box>
		</Box>
	);
};

export default memo(SettingsPanel);
