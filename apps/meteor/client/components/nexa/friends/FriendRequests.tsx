import { Avatar, Box, Button, Icon, Tag } from '@rocket.chat/fuselage';
import { UserAvatar } from '@rocket.chat/ui-avatar';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FriendStatus = 'pending_incoming' | 'pending_outgoing' | 'friends' | 'blocked' | 'none';

export type FriendUser = {
	_id: string;
	username: string;
	name: string;
	status: 'online' | 'away' | 'busy' | 'offline';
	bio?: string;
	mutualFriends?: number;
	friendStatus: FriendStatus;
};

type FriendRequestsProps = {
	incoming?: FriendUser[];
	outgoing?: FriendUser[];
	suggestions?: FriendUser[];
	friends?: FriendUser[];
	onAccept?: (userId: string) => void;
	onDecline?: (userId: string) => void;
	onCancel?: (userId: string) => void;
	onAddFriend?: (userId: string) => void;
	onBlock?: (userId: string) => void;
	onMessage?: (userId: string) => void;
};

type ActiveTab = 'incoming' | 'outgoing' | 'friends' | 'suggestions';

const STATUS_COLOR: Record<FriendUser['status'], string> = {
	online: '#22c55e',
	away: '#f59e0b',
	busy: '#ef4444',
	offline: '#9ca3af',
};

const UserRow = ({
	user,
	actions,
}: {
	user: FriendUser;
	actions: ReactElement;
}): ReactElement => {
	const { t } = useTranslation();

	return (
		<Box
			display='flex'
			alignItems='center'
			gap={12}
			p={16}
			borderRadius={10}
			style={{
				border: '1px solid var(--rcx-color-stroke-extra-light, #e5e7eb)',
				background: 'var(--rcx-color-surface-room, #ffffff)',
				transition: 'box-shadow 0.15s ease',
			}}
		>
			{/* Avatar with status dot */}
			<Box position='relative' flexShrink={0}>
				<UserAvatar username={user.username} size='x48' />
				<Box
					style={{
						position: 'absolute',
						bottom: 1,
						right: 1,
						width: 12,
						height: 12,
						borderRadius: '50%',
						backgroundColor: STATUS_COLOR[user.status],
						border: '2px solid white',
					}}
				/>
			</Box>

			{/* Name + username + mutual friends */}
			<Box flexGrow={1} minWidth={0}>
				<Box
					fontWeight={600}
					style={{
						fontSize: '0.9375rem',
						color: 'var(--rcx-color-font-titles-labels, #111827)',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{user.name}
				</Box>
				<Box
					style={{
						fontSize: '0.8125rem',
						color: 'var(--color-primary, #6c63ff)',
						fontFamily: 'monospace',
					}}
				>
					@{user.username}
				</Box>
				{user.bio && (
					<Box
						style={{
							fontSize: '0.8125rem',
							color: 'var(--rcx-color-font-hint, #6b7280)',
							marginTop: 2,
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{user.bio}
					</Box>
				)}
				{typeof user.mutualFriends === 'number' && user.mutualFriends > 0 && (
					<Box
						style={{
							fontSize: '0.75rem',
							color: 'var(--rcx-color-font-annotation, #9ca3af)',
							marginTop: 4,
						}}
					>
						<Icon name='team' size='x12' /> {user.mutualFriends} mutual{' '}
						{user.mutualFriends === 1 ? 'friend' : 'friends'}
					</Box>
				)}
			</Box>

			{/* Action buttons */}
			<Box display='flex' gap={8} flexShrink={0}>
				{actions}
			</Box>
		</Box>
	);
};

const FriendRequests = ({
	incoming = [],
	outgoing = [],
	suggestions = [],
	friends = [],
	onAccept,
	onDecline,
	onCancel,
	onAddFriend,
	onBlock,
	onMessage,
}: FriendRequestsProps): ReactElement => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<ActiveTab>('incoming');

	const tabs: Array<{ id: ActiveTab; label: string; count?: number }> = [
		{ id: 'incoming', label: 'Incoming', count: incoming.length },
		{ id: 'outgoing', label: 'Sent', count: outgoing.length },
		{ id: 'friends', label: 'Friends', count: friends.length },
		{ id: 'suggestions', label: 'Suggestions' },
	];

	const renderEmpty = (message: string): ReactElement => (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			gap={12}
			py={40}
			style={{ color: 'var(--rcx-color-font-hint, #6b7280)', textAlign: 'center' }}
		>
			<Icon name='team' size='x48' style={{ opacity: 0.3 }} />
			<Box style={{ fontSize: '0.9375rem' }}>{message}</Box>
		</Box>
	);

	const renderList = (users: FriendUser[]): ReactElement => {
		if (users.length === 0) {
			const emptyMessages: Record<ActiveTab, string> = {
				incoming: 'No pending friend requests',
				outgoing: 'No sent requests',
				friends: 'No friends yet — add some!',
				suggestions: 'No suggestions available',
			};
			return renderEmpty(emptyMessages[activeTab]);
		}

		return (
			<Box display='flex' flexDirection='column' gap={10}>
				{users.map((user) => {
					let actions: ReactElement;

					if (activeTab === 'incoming') {
						actions = (
							<>
								<Button
									small
									primary
									onClick={() => onAccept?.(user._id)}
									style={{ borderRadius: 8, minWidth: 72 }}
								>
									Accept
								</Button>
								<Button
									small
									onClick={() => onDecline?.(user._id)}
									style={{ borderRadius: 8, minWidth: 72 }}
									danger
								>
									Decline
								</Button>
							</>
						);
					} else if (activeTab === 'outgoing') {
						actions = (
							<Button
								small
								onClick={() => onCancel?.(user._id)}
								style={{ borderRadius: 8 }}
							>
								Cancel
							</Button>
						);
					} else if (activeTab === 'friends') {
						actions = (
							<>
								<Button
									small
									primary
									onClick={() => onMessage?.(user._id)}
									style={{ borderRadius: 8 }}
									icon='chat'
									title='Message'
								>
									Message
								</Button>
								<Button
									small
									onClick={() => onBlock?.(user._id)}
									style={{ borderRadius: 8 }}
									icon='ban'
									title='Block'
									danger
								>
									Block
								</Button>
							</>
						);
					} else {
						// suggestions
						actions = (
							<Button
								small
								primary
								onClick={() => onAddFriend?.(user._id)}
								style={{ borderRadius: 8 }}
								icon='user-plus'
							>
								Add
							</Button>
						);
					}

					return <UserRow key={user._id} user={user} actions={actions} />;
				})}
			</Box>
		);
	};

	const currentList =
		activeTab === 'incoming'
			? incoming
			: activeTab === 'outgoing'
			? outgoing
			: activeTab === 'friends'
			? friends
			: suggestions;

	return (
		<Box
			display='flex'
			flexDirection='column'
			height='full'
			style={{ minHeight: 0 }}
		>
			{/* Header */}
			<Box
				p={20}
				pb={0}
				style={{ borderBottom: '1px solid var(--rcx-color-stroke-extra-light, #e5e7eb)' }}
			>
				<Box
					style={{
						fontSize: '1.25rem',
						fontWeight: 700,
						color: 'var(--rcx-color-font-titles-labels, #111827)',
						marginBottom: 16,
						letterSpacing: '-0.015em',
					}}
				>
					Friends
				</Box>

				{/* Tab bar */}
				<Box display='flex' gap={0} style={{ borderBottom: 'none' }}>
					{tabs.map((tab) => (
						<Box
							key={tab.id}
							is='button'
							onClick={() => setActiveTab(tab.id)}
							display='flex'
							alignItems='center'
							gap={6}
							px={14}
							py={10}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								fontSize: '0.875rem',
								fontWeight: activeTab === tab.id ? 700 : 500,
								color:
									activeTab === tab.id
										? 'var(--color-primary, #6c63ff)'
										: 'var(--rcx-color-font-hint, #6b7280)',
								borderBottom: activeTab === tab.id ? '2px solid var(--color-primary, #6c63ff)' : '2px solid transparent',
								transition: 'color 0.12s ease, border-color 0.12s ease',
								whiteSpace: 'nowrap',
							}}
						>
							{tab.label}
							{typeof tab.count === 'number' && tab.count > 0 && (
								<Box
									style={{
										backgroundColor:
											tab.id === 'incoming'
												? 'var(--color-primary, #6c63ff)'
												: 'var(--rcx-color-stroke-medium, #d1d5db)',
										color: tab.id === 'incoming' ? '#ffffff' : 'var(--rcx-color-font-hint, #6b7280)',
										borderRadius: '9999px',
										fontSize: '0.6875rem',
										fontWeight: 700,
										padding: '1px 6px',
										minWidth: 18,
										textAlign: 'center',
									}}
								>
									{tab.count}
								</Box>
							)}
						</Box>
					))}
				</Box>
			</Box>

			{/* List */}
			<Box
				p={16}
				style={{ overflowY: 'auto', flex: 1 }}
			>
				{renderList(currentList)}
			</Box>
		</Box>
	);
};

export default FriendRequests;
