import React from 'react';
import { Platform } from 'react-native';
import type { LucideIcon, LucideProps } from 'lucide-react-native';

/**
 * Web-compatible wrapper for Lucide icons.
 * 
 * lucide-react-native icons don't properly handle the `color` prop on web,
 * causing "Failed to set indexed property on CSSStyleDeclaration" errors.
 * 
 * This wrapper converts the `color` prop to `stroke` for web compatibility
 * while maintaining the same API across platforms.
 */

interface IconProps extends Omit<LucideProps, 'color'> {
    Icon: LucideIcon;
    color?: string;
    size?: number;
    strokeWidth?: number;
    fill?: string;
}

export default function Icon({
    Icon: LucideIconComponent,
    color,
    size = 24,
    strokeWidth,
    fill,
    ...props
}: IconProps) {
    // On web, use stroke instead of color to avoid CSS style errors
    const iconProps = Platform.select({
        web: {
            stroke: color,
            fill: fill || 'none',
            width: size,
            height: size,
            strokeWidth,
            ...props,
        },
        default: {
            color,
            size,
            fill,
            strokeWidth,
            ...props,
        },
    });

    return <LucideIconComponent {...(iconProps as LucideProps)} />;
}

/**
 * Creates a web-compatible icon component from a Lucide icon.
 * 
 * Usage:
 * import { MapPin } from 'lucide-react-native';
 * const WebMapPin = createWebIcon(MapPin);
 * <WebMapPin color={theme.primary} size={20} />
 */
export function createWebIcon(LucideIconComponent: LucideIcon) {
    return function WebIcon(props: Omit<IconProps, 'Icon'>) {
        return <Icon Icon={LucideIconComponent} {...props} />;
    };
}
