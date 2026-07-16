import { Box, SidebarItem } from '@rocket.chat/fuselage';
import type { ReactNode } from 'react';
import { memo } from 'react';

export type SidebarGenericItemProps = {
	href?: string;
	active?: boolean;
	featured?: boolean;
	children: ReactNode;
	externalUrl?: boolean;
};

const SidebarGenericItem = ({ href, active, externalUrl, children, ...props }: SidebarGenericItemProps) => (
	<SidebarItem
		className='rcx-sidebar-item'
		selected={active}
		clickable
		is='a'
		href={href}
		{...(externalUrl && { target: '_blank', rel: 'noopener noreferrer' })}
		{...props}
	>
		<Box display='flex' flexDirection='row' alignItems='center' width='100%' className='rcx-sidebar-item-content'>
			{children}
		</Box>
	</SidebarItem>
);

export default memo(SidebarGenericItem);
