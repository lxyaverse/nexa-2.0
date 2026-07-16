import type { IUser } from '@rocket.chat/core-typings';
import { Box, Text, Badge, Icon, Avatar } from '@rocket.chat/fuselage';
import type { ReactNode } from 'react';
import { memo } from 'react';

type UsernameCardProps = {
	user: IUser;
	showBio?: boolean;
	showStatus?: boolean;
	onMention?: (username: string) => void;
	actionButton?: ReactNode;
	verified?: boolean;
	premium?: boolean;
};

const UsernameCard = ({
	user,
	showBio = true,
	showStatus = true,
	onMention,
	actionButton,
	verified,
	premium,
}: UsernameCardProps) => {
	const handleMention = () => {
		if (onMention && user.username) {
			onMention(`@${user.username}`);
		}
	};

	return (
		<Box className='rcx-username-card' display='flex' flexDirection='column' gap={12}>
			<Box display='flex' alignItems='center' gap={12} width='100%'>
				<Avatar url={user.avatar} username={user.username} size='large' />
				
				<Box display='flex' flexDirection='column' gap={4} flexGrow={1}>
					<Box display='flex' alignItems='center' gap={8}>
						<Text fontScale='h3' fontWeight='bold' className='rcx-username-card__name'>
							{user.name || user.username}
						</Text>
						
						{verified && (
							<Badge icon='check' className='rcx-username-card__verified' title='Verified User'>
								Verified
							</Badge>
						)}
						
						{premium && (
							<Badge icon='star' className='rcx-username-card__premium' title='Premium Member'>
								Pro
							</Badge>
						)}
					</Box>

					<Box display='flex' alignItems='center' gap={4}>
						<Icon name='at' size='x16' color='secondary' />
						<Text fontScale='p2' color='secondary' className='rcx-username-card__username'>
							{user.username}
						</Text>
						{onMention && (
							<button
								onClick={handleMention}
								className='rcx-username-card__mention-btn'
								title={`Mention ${user.username}`}
								aria-label={`Mention ${user.username}`}
							>
								<Icon name='reply' size='x16' />
							</button>
						)}
					</Box>

					{showStatus && user.status && (
						<Box display='flex' alignItems='center' gap={6}>
							<Box
								className={`rcx-status rcx-status--${user.status}`}
								display='inline-block'
								width='x8'
								height='x8'
								borderRadius='full'
							/>
							<Text fontScale='caption' color='secondary' textTransform='capitalize'>
								{user.status}
							</Text>
						</Box>
					)}
				</Box>

				{actionButton && <Box>{actionButton}</Box>}
			</Box>

			{showBio && user.bio && (
				<Box className='rcx-username-card__bio' padding={8} backgroundColor='surface' borderRadius={6}>
					<Text fontScale='p2'>{user.bio}</Text>
				</Box>
			)}
		</Box>
	);
};

export default memo(UsernameCard);
