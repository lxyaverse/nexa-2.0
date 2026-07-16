import { Box, Icon, Tag } from '@rocket.chat/fuselage';
import type { Keys as IconName } from '@rocket.chat/icons';
import type { ReactNode } from 'react';
import { memo } from 'react';

import SidebarGenericItem from './SidebarGenericItem';

export type SidebarNavigationItemProps = {
	permissionGranted?: (() => boolean) | boolean;
	pathSection: string;
	icon?: IconName;
	label?: string;
	tag?: string;
	currentPath?: string;
	externalUrl?: boolean;
	badge?: () => ReactNode;
};

const SidebarNavigationItem = ({
	permissionGranted,
	pathSection,
	icon,
	label,
	currentPath,
	tag,
	externalUrl,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	badge: Badge,
}: SidebarNavigationItemProps) => {
	const path = pathSection;
	const isActive = !!path && currentPath?.includes(path);

	if (permissionGranted === false || (typeof permissionGranted === 'function' && !permissionGranted())) {
		return null;
	}

	return (
		<SidebarGenericItem active={isActive} href={path} externalUrl={externalUrl} aria-current={isActive ? 'page' : undefined}>
			{icon && <Icon name={icon} size='x20' mi={4} className='rcx-sidebar-item-icon' />}
			<Box
				withTruncatedText
				className='rcx-sidebar-item-label'
				flexGrow={1}
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				width='100%'
			>
				{label} {tag && <Tag className='rcx-sidebar-item-tag'>{tag}</Tag>}
			</Box>
			{Badge ? <Box className='rcx-sidebar-item-badge'><Badge /></Box> : null}
		</SidebarGenericItem>
	);
};

export default memo(SidebarNavigationItem);
