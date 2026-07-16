import { Box, Button, Text, Icon, Avatar, Tab, Tabs } from '@rocket.chat/fuselage';
import type { IUser } from '@rocket.chat/core-typings';
import { useState, memo } from 'react';

type UserProfileProps = {
	user: IUser & {
		bio?: string;
		banner?: string;
		socialLinks?: Array<{
			platform: string;
			url: string;
		}>;
		followers?: number;
		following?: number;
	};
	isCurrentUser?: boolean;
	verified?: boolean;
	premium?: boolean;
	onEditProfile?: () => void;
	onMessage?: () => void;
	onAddFriend?: () => void;
	onRemoveFriend?: () => void;
	onFollowToggle?: () => void;
};

const UserProfile = ({
	user,
	isCurrentUser = false,
	verified,
	premium,
	onEditProfile,
	onMessage,
	onAddFriend,
	onRemoveFriend,
	onFollowToggle,
}: UserProfileProps) => {
	const [activeTab, setActiveTab] = useState(0);

	const socialPlatformIcons: Record<string, string> = {
		twitter: 'x-twitter',
		github: 'github',
		linkedin: 'linkedin',
		instagram: 'instagram',
		website: 'link',
		facebook: 'facebook',
		discord: 'discord',
	};

	return (
		<Box className='rcx-user-profile' display='flex' flexDirection='column'>
			{/* Banner Section */}
			<Box
				className='rcx-user-profile__banner'
				position='relative'
				width='100%'
				height='200px'
				backgroundColor='primary'
				backgroundImage={user.banner ? `url(${user.banner})` : undefined}
				backgroundSize='cover'
				backgroundPosition='center'
				borderRadius='8px 8px 0 0'
			>
				{!user.banner && (
					<Box
						position='absolute'
						width='100%'
						height='100%'
						background='linear-gradient(135deg, var(--nexa-primary) 0%, var(--nexa-secondary) 100%)'
						borderRadius='8px 8px 0 0'
					/>
				)}

				{/* Avatar Overlay */}
				<Box
					className='rcx-user-profile__avatar-container'
					position='absolute'
					bottom={-40}
					left={20}
					display='flex'
					alignItems='flex-end'
					gap={12}
				>
					<Avatar
						url={user.avatar}
						username={user.username}
						size='x-large'
						className='rcx-user-profile__avatar'
					/>
				</Box>
			</Box>

			{/* Profile Header with Actions */}
			<Box
				className='rcx-user-profile__header'
				padding={20}
				paddingTop={60}
				display='flex'
				justifyContent='space-between'
				alignItems='flex-start'
			>
				<Box display='flex' flexDirection='column' gap={8}>
					<Box display='flex' alignItems='center' gap={8}>
						<Text fontScale='h3' fontWeight='bold'>
							{user.name || user.username}
						</Text>
						{verified && (
							<Box className='rcx-badge rcx-badge--verified' title='Verified User'>
								<Icon name='check' size='x16' />
							</Box>
						)}
						{premium && (
							<Box className='rcx-badge rcx-badge--premium' title='Premium Member'>
								<Icon name='star' size='x16' />
							</Box>
						)}
					</Box>

					<Box display='flex' alignItems='center' gap={4}>
						<Icon name='at' size='x16' color='secondary' />
						<Text fontScale='p2' color='secondary'>
							{user.username}
						</Text>
					</Box>

					{/* Stats */}
					<Box display='flex' gap={24} marginTop={8}>
						<Box textAlign='center'>
							<Text fontScale='h4' fontWeight='bold' color='primary'>
								{user.followers || 0}
							</Text>
							<Text fontScale='caption' color='secondary'>
								Followers
							</Text>
						</Box>
						<Box textAlign='center'>
							<Text fontScale='h4' fontWeight='bold' color='primary'>
								{user.following || 0}
							</Text>
							<Text fontScale='caption' color='secondary'>
								Following
							</Text>
						</Box>
					</Box>
				</Box>

				{/* Action Buttons */}
				<Box display='flex' gap={8}>
					{isCurrentUser ? (
						<Button primary onClick={onEditProfile}>
							<Icon name='pencil' size='x16' />
							Edit Profile
						</Button>
					) : (
						<>
							<Button onClick={onMessage} secondary>
								<Icon name='chat' size='x16' />
								Message
							</Button>
							<Button onClick={onFollowToggle} secondary>
								<Icon name='bell' size='x16' />
								Follow
							</Button>
							<Button onClick={onAddFriend} primary>
								<Icon name='plus' size='x16' />
								Add Friend
							</Button>
						</>
					)}
				</Box>
			</Box>

			{/* Bio Section */}
			{user.bio && (
				<Box className='rcx-user-profile__bio' padding={16} borderTop='1px solid' borderTopColor='component'>
					<Text fontScale='p1'>{user.bio}</Text>
				</Box>
			)}

			{/* Social Links */}
			{user.socialLinks && user.socialLinks.length > 0 && (
				<Box
					className='rcx-user-profile__social'
					padding={16}
					borderTop='1px solid'
					borderTopColor='component'
					display='flex'
					gap={12}
				>
					{user.socialLinks.map((link) => (
						<a
							key={link.platform}
							href={link.url}
							target='_blank'
							rel='noopener noreferrer'
							className='rcx-social-link'
							title={link.platform}
						>
							<Icon name={socialPlatformIcons[link.platform] || 'link'} size='x20' />
						</a>
					))}
				</Box>
			)}

			{/* Tabs Section */}
			<Box
				className='rcx-user-profile__tabs'
				borderTop='1px solid'
				borderTopColor='component'
				flexGrow={1}
			>
				<Tabs value={activeTab} onChange={setActiveTab}>
					<Tab label='Posts'>
						<Box padding={16}>
							<Text color='secondary' textAlign='center'>
								Posts feature coming soon
							</Text>
						</Box>
					</Tab>

					<Tab label='Gallery'>
						<Box padding={16}>
							<Text color='secondary' textAlign='center'>
								Gallery feature coming soon
							</Text>
						</Box>
					</Tab>

					<Tab label='Activity'>
						<Box padding={16}>
							<Text color='secondary' textAlign='center'>
								Activity timeline coming soon
							</Text>
						</Box>
					</Tab>
				</Tabs>
			</Box>
		</Box>
	);
};

export default memo(UserProfile);
