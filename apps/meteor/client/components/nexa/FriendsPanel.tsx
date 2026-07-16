import { Box, Button, Badge, Text, Tabs, Tab, Avatar, Icon } from '@rocket.chat/fuselage';
import type { IUser } from '@rocket.chat/core-typings';
import type { ReactNode } from 'react';
import { useState, memo } from 'react';

type FriendStatus = 'pending' | 'accepted' | 'blocked';

type Friend = IUser & {
	status: FriendStatus;
	mutualFriends?: number;
	addedAt?: Date;
};

type FriendsPanelProps = {
	friends?: Friend[];
	pendingRequests?: Friend[];
	blockedUsers?: Friend[];
	onAcceptRequest?: (userId: string) => void;
	onRejectRequest?: (userId: string) => void;
	onRemoveFriend?: (userId: string) => void;
	onBlockUser?: (userId: string) => void;
	onUnblockUser?: (userId: string) => void;
	onViewProfile?: (userId: string) => void;
	onMessage?: (userId: string) => void;
};

const FriendsPanelInternal = ({
	friends = [],
	pendingRequests = [],
	blockedUsers = [],
	onAcceptRequest,
	onRejectRequest,
	onRemoveFriend,
	onBlockUser,
	onUnblockUser,
	onViewProfile,
	onMessage,
}: FriendsPanelProps) => {
	const [activeTab, setActiveTab] = useState(0);

	const renderFriendItem = (friend: Friend, showActions = true) => (
		<Box
			key={friend._id}
			className='rcx-friend-item'
			display='flex'
			alignItems='center'
			gap={12}
			padding={12}
			borderRadius={6}
		>
			<Avatar url={friend.avatar} username={friend.username} size='large' />

			<Box display='flex' flexDirection='column' gap={4} flexGrow={1}>
				<Box display='flex' alignItems='center' gap={8}>
					<Text fontScale='p1' fontWeight='bold'>
						{friend.name || friend.username}
					</Text>
					{friend.status === 'accepted' && friend.mutualFriends && (
						<Badge>{friend.mutualFriends} mutual</Badge>
					)}
				</Box>
				<Text fontScale='caption' color='secondary'>
					@{friend.username}
				</Text>
			</Box>

			{showActions && (
				<Box display='flex' gap={8}>
					{friend.status === 'pending' && (
						<>
							<Button
								small
								primary
								onClick={() => onAcceptRequest?.(friend._id)}
								icon='check'
								title='Accept friend request'
							/>
							<Button
								small
								secondary
								onClick={() => onRejectRequest?.(friend._id)}
								icon='cross'
								title='Reject friend request'
							/>
						</>
					)}
					{friend.status === 'accepted' && (
						<>
							<Button
								small
								secondary
								onClick={() => onMessage?.(friend._id)}
								icon='chat'
								title='Send message'
							/>
							<Button
								small
								secondary
								onClick={() => onViewProfile?.(friend._id)}
								icon='user'
								title='View profile'
							/>
							<Button
								small
								secondary
								onClick={() => onRemoveFriend?.(friend._id)}
								icon='trash'
								title='Remove friend'
							/>
						</>
					)}
					{friend.status === 'blocked' && (
						<Button
							small
							onClick={() => onUnblockUser?.(friend._id)}
							title='Unblock user'
						>
							Unblock
						</Button>
					)}
				</Box>
			)}
		</Box>
	);

	return (
		<Box className='rcx-friends-panel' display='flex' flexDirection='column' gap={12} padding={16}>
			<Text fontScale='h4' fontWeight='bold'>
				Friends & Social
			</Text>

			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tab label={`Friends (${friends.length})`}>
					<Box display='flex' flexDirection='column' gap={8} marginTop={12}>
						{friends.length === 0 ? (
							<Box textAlign='center' padding={16}>
								<Text color='secondary'>No friends yet. Start connecting with people!</Text>
							</Box>
						) : (
							friends.map((friend) => renderFriendItem(friend))
						)}
					</Box>
				</Tab>

				<Tab label={`Requests (${pendingRequests.length})`}>
					<Box display='flex' flexDirection='column' gap={8} marginTop={12}>
						{pendingRequests.length === 0 ? (
							<Box textAlign='center' padding={16}>
								<Text color='secondary'>No pending friend requests</Text>
							</Box>
						) : (
							pendingRequests.map((request) => renderFriendItem(request))
						)}
					</Box>
				</Tab>

				<Tab label={`Blocked (${blockedUsers.length})`}>
					<Box display='flex' flexDirection='column' gap={8} marginTop={12}>
						{blockedUsers.length === 0 ? (
							<Box textAlign='center' padding={16}>
								<Text color='secondary'>No blocked users</Text>
							</Box>
						) : (
							blockedUsers.map((user) => renderFriendItem(user, false))
						)}
					</Box>
				</Tab>
			</Tabs>
		</Box>
	);
};

export default memo(FriendsPanelInternal);
