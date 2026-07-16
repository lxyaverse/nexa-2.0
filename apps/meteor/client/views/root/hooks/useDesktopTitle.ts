import { useSetting } from '@rocket.chat/ui-contexts';
import { useEffect } from 'react';

export const useDesktopTitle = () => {
	const title = useSetting('Site_Name', 'Nexa Chat');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!title) return;
		window.RocketChatDesktop?.setTitle(title);
	}, [title]);
};
