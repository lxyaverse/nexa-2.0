import { Box, IconButton } from '@rocket.chat/fuselage';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type HeaderProps = {
	children?: ReactNode;
	title?: ReactNode;
	onClose?: () => void;
};

const Header = ({ title, onClose, children, ...props }: HeaderProps) => {
	const { t } = useTranslation();

	return (
		<Box display='flex' flexDirection='column' pb={16} className='rcx-sidebar__header' {...props}>
			{(title || onClose) && (
				<Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' flexGrow={1}>
					{title && (
						<Box 
							className='rcx-sidebar__header-title'
							flexShrink={1} 
							withTruncatedText
						>
							{title}
						</Box>
					)}
					{onClose && (
						<IconButton 
							className='rcx-sidebar__close-button'
							small 
							aria-label={t('Close')} 
							icon='cross' 
							onClick={onClose}
						/>
					)}
				</Box>
			)}
			{children}
		</Box>
	);
};

export default Header;
