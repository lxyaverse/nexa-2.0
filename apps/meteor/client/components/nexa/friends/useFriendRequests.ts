/**
 * useFriendRequests — Nexa Chat social graph hook
 *
 * This is a client-side stub. In production, these functions should call
 * Rocket.Chat REST endpoints (e.g. /api/v1/friends.list, /api/v1/friends.request)
 * which are to be added on the server side.
 *
 * For now the hook manages state locally so the UI is fully functional
 * and ready to be wired up to real endpoints.
 */
import { useCallback, useState } from 'react';

import type { FriendUser } from './FriendRequests';

type UseFriendRequestsReturn = {
	incoming: FriendUser[];
	outgoing: FriendUser[];
	friends: FriendUser[];
	suggestions: FriendUser[];
	accept: (userId: string) => void;
	decline: (userId: string) => void;
	cancel: (userId: string) => void;
	addFriend: (userId: string) => void;
	block: (userId: string) => void;
};

/**
 * Move a user from one list to another by _id.
 */
const moveUser = (
	from: FriendUser[],
	to: FriendUser[],
	userId: string,
	patch?: Partial<FriendUser>,
): [FriendUser[], FriendUser[]] => {
	const user = from.find((u) => u._id === userId);
	if (!user) return [from, to];
	return [
		from.filter((u) => u._id !== userId),
		[...to, { ...user, ...patch }],
	];
};

export const useFriendRequests = (initial?: Partial<UseFriendRequestsReturn>): UseFriendRequestsReturn => {
	const [incoming, setIncoming] = useState<FriendUser[]>(initial?.incoming ?? DEMO_INCOMING);
	const [outgoing, setOutgoing] = useState<FriendUser[]>(initial?.outgoing ?? DEMO_OUTGOING);
	const [friends, setFriends] = useState<FriendUser[]>(initial?.friends ?? DEMO_FRIENDS);
	const [suggestions, setSuggestions] = useState<FriendUser[]>(initial?.suggestions ?? DEMO_SUGGESTIONS);

	const accept = useCallback((userId: string) => {
		setIncoming((prev) => {
			const [newIncoming, newFriend] = moveUser(prev, [], userId, { friendStatus: 'friends' });
			setFriends((f) => [...f, ...(prev.find((u) => u._id === userId) ? [{ ...prev.find((u) => u._id === userId)!, friendStatus: 'friends' as const }] : [])]);
			return newIncoming;
		});
	}, []);

	const decline = useCallback((userId: string) => {
		setIncoming((prev) => prev.filter((u) => u._id !== userId));
	}, []);

	const cancel = useCallback((userId: string) => {
		setOutgoing((prev) => prev.filter((u) => u._id !== userId));
	}, []);

	const addFriend = useCallback((userId: string) => {
		setSuggestions((prev) => {
			const user = prev.find((u) => u._id === userId);
			if (user) setOutgoing((o) => [...o, { ...user, friendStatus: 'pending_outgoing' }]);
			return prev.filter((u) => u._id !== userId);
		});
	}, []);

	const block = useCallback((userId: string) => {
		setFriends((prev) => prev.filter((u) => u._id !== userId));
	}, []);

	return { incoming, outgoing, friends, suggestions, accept, decline, cancel, addFriend, block };
};

/* ---------------------------------------------------------------------------
 * Demo data — replace with API calls once endpoints are available
 * -------------------------------------------------------------------------*/

const DEMO_INCOMING: FriendUser[] = [
	{
		_id: 'user-1',
		username: 'alex.nova',
		name: 'Alex Nova',
		status: 'online',
		bio: 'Building the future, one commit at a time.',
		mutualFriends: 3,
		friendStatus: 'pending_incoming',
	},
	{
		_id: 'user-2',
		username: 'mia.ray',
		name: 'Mia Ray',
		status: 'away',
		mutualFriends: 1,
		friendStatus: 'pending_incoming',
	},
];

const DEMO_OUTGOING: FriendUser[] = [
	{
		_id: 'user-3',
		username: 'jake.frost',
		name: 'Jake Frost',
		status: 'offline',
		bio: 'Designer. Coffee enthusiast.',
		friendStatus: 'pending_outgoing',
	},
];

const DEMO_FRIENDS: FriendUser[] = [
	{
		_id: 'user-4',
		username: 'sara.kim',
		name: 'Sara Kim',
		status: 'online',
		bio: 'Full-stack dev at Nexa.',
		friendStatus: 'friends',
	},
	{
		_id: 'user-5',
		username: 'omar.diaz',
		name: 'Omar Diaz',
		status: 'busy',
		friendStatus: 'friends',
	},
];

const DEMO_SUGGESTIONS: FriendUser[] = [
	{
		_id: 'user-6',
		username: 'luna.park',
		name: 'Luna Park',
		status: 'online',
		bio: 'AI researcher and writer.',
		mutualFriends: 5,
		friendStatus: 'none',
	},
	{
		_id: 'user-7',
		username: 'felix.chen',
		name: 'Felix Chen',
		status: 'away',
		mutualFriends: 2,
		friendStatus: 'none',
	},
];
