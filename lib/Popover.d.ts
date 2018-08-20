/// <reference types="react" />
import * as React from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Geometry, Placement, Rect, Size } from './PopoverGeometry';
export declare type Orientation = 'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right';
export interface PopoverProps {
    visible?: boolean;
    onClose?: () => void;
    arrowSize?: Size;
    placement?: Placement | 'auto';
    fromRect: Rect;
    displayArea?: Rect;
    backgroundStyle?: ViewStyle;
    arrowStyle: ViewStyle;
    popoverStyle?: ViewStyle;
    contentStyle: ViewStyle;
    duration?: number;
    easing?: (show: boolean) => (value: number) => number;
    useNativeDriver?: boolean;
    supportedOrientations?: Orientation[];
}
export interface PopoverState extends Geometry {
    contentSize: Size;
    visible: boolean;
    isAwaitingShow: boolean;
    animation: Animated.Value;
    showContent: boolean;
}
export declare class Popover extends React.PureComponent<PopoverProps, PopoverState> {
    static propTypes: any;
    static defaultProps: Partial<PopoverProps>;
    static displayName: string;
    private defaultDisplayArea;
    constructor(props: PopoverProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private computeGeometry;
    private onOrientationChange;
    private updateState;
    private measureContent;
    private getTranslateOrigin;
    componentWillReceiveProps(nextProps: PopoverProps): void;
    private startAnimation;
    private onShown;
    private onHidden;
    private computeStyles;
    render(): JSX.Element;
}
