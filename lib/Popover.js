"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var debounce = require("lodash.debounce");
var PropTypes = require("prop-types");
var React = require("react");
var react_native_1 = require("react-native");
var PopoverGeometry_1 = require("./PopoverGeometry");
var styles = react_native_1.StyleSheet.create({
    container: __assign({}, react_native_1.StyleSheet.absoluteFillObject, { opacity: 0, backgroundColor: 'transparent' }),
    containerVisible: {
        opacity: 1,
    },
    background: __assign({}, react_native_1.StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }),
    popover: __assign({}, react_native_1.Platform.select({
        ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 2,
            shadowOpacity: 0.4,
            backgroundColor: 'transparent',
        },
    }), { position: 'absolute' }),
    content: {
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: '#f2f2f2',
        padding: 8,
    },
    arrow: {
        position: 'absolute',
        borderTopColor: '#f2f2f2',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    showContent: {
        backgroundColor: 'white'
    },
});
var ARROW_DEG = {
    bottom: '-180deg',
    left: '-90deg',
    right: '90deg',
    top: '0deg',
};
var Popover = (function (_super) {
    __extends(Popover, _super);
    function Popover(props) {
        var _this = _super.call(this, props) || this;
        _this.computeGeometry = function (props, contentSize) {
            return PopoverGeometry_1.computeGeometry(contentSize || _this.state.contentSize, props.placement, props.fromRect, props.displayArea || _this.defaultDisplayArea, props.arrowSize);
        };
        _this.onOrientationChange = function (args) {
            var dimensions = react_native_1.Dimensions.get('window');
            _this.defaultDisplayArea = { x: 10, y: 10, width: dimensions.width - 20, height: dimensions.height - 20 };
        };
        _this.updateState = debounce(_this.setState, 100);
        _this.measureContent = function (_a) {
            var _b = _a.nativeEvent.layout, width = _b.width, height = _b.height;
            if (width && height) {
                var contentSize = { width: width, height: height };
                var geom = _this.computeGeometry(_this.props, contentSize);
                var isAwaitingShow_1 = _this.state.isAwaitingShow;
                _this.updateState(__assign({}, geom, { contentSize: contentSize }), function () {
                    if (isAwaitingShow_1) {
                        _this.startAnimation(true);
                    }
                });
            }
        };
        _this.getTranslateOrigin = function () {
            var _a = _this.state, contentSize = _a.contentSize, origin = _a.origin, anchor = _a.anchor;
            var popoverCenter = { x: origin.x + contentSize.width / 2, y: origin.y + contentSize.height / 2 };
            return { x: anchor.x - popoverCenter.x, y: anchor.y - popoverCenter.y };
        };
        _this.startAnimation = function (show) {
            var doneCallback = show ? _this.onShown : _this.onHidden;
            react_native_1.Animated.timing(_this.state.animation, {
                toValue: show ? 1 : 0,
                duration: _this.props.duration,
                useNativeDriver: true,
            }).start(doneCallback);
        };
        _this.onShown = function () { return setTimeout(function () { console.log('shown'); _this.setState({ showContent: true }); }, 500); };
        _this.onHidden = function () { return _this.setState({ visible: false, isAwaitingShow: false }); };
        _this.computeStyles = function () {
            var _a = _this.state, animation = _a.animation, anchor = _a.anchor, origin = _a.origin;
            var translateOrigin = _this.getTranslateOrigin();
            var arrowSize = _this.props.arrowSize;
            var width = arrowSize.width + 2;
            var height = arrowSize.height * 2 + 2;
            return {
                background: [
                    styles.background,
                    _this.props.backgroundStyle,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    },
                ],
                arrow: [
                    styles.arrow,
                    _this.props.arrowStyle,
                    {
                        width: width,
                        height: height,
                        borderTopWidth: height / 2,
                        left: anchor.x - origin.x - width / 2,
                        top: anchor.y - origin.y - height / 2,
                        borderRightWidth: width / 2,
                        borderBottomWidth: height / 2,
                        borderLeftWidth: width / 2,
                        transform: [
                            {
                                scale: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ],
                popover: [
                    styles.popover,
                    _this.props.popoverStyle,
                    { top: origin.y, left: origin.x },
                ],
                content: [
                    styles.content,
                    _this.props.contentStyle,
                    {
                        transform: [
                            { translateX: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [translateOrigin.x, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                            { translateY: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [translateOrigin.y, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                            { scale: animation },
                        ],
                    },
                ],
            };
        };
        _this.state = {
            contentSize: { width: 0, height: 0 },
            anchor: { x: 0, y: 0 },
            origin: { x: 0, y: 0 },
            placement: props.placement === 'auto' ? 'top' : props.placement,
            visible: false,
            isAwaitingShow: false,
            animation: new react_native_1.Animated.Value(0),
            showContent: true
        };
        _this.onOrientationChange();
        return _this;
    }
    Popover.prototype.componentDidMount = function () {
        react_native_1.Dimensions.addEventListener('change', this.onOrientationChange);
    };
    Popover.prototype.componentWillUnmount = function () {
        react_native_1.Dimensions.removeEventListener('change', this.onOrientationChange);
    };
    Popover.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var willBeVisible = nextProps.visible;
        var _a = this.props, visible = _a.visible, fromRect = _a.fromRect, displayArea = _a.displayArea;
        if (willBeVisible !== visible) {
            if (willBeVisible) {
                this.setState({ contentSize: { width: 0, height: 0 }, isAwaitingShow: true, visible: true });
            }
            else {
                this.startAnimation(false);
            }
        }
        else if (willBeVisible && (fromRect !== nextProps.fromRect || displayArea !== nextProps.displayArea)) {
            var geom = this.computeGeometry(nextProps, this.state.contentSize);
            var isAwaitingShow_2 = this.state.isAwaitingShow;
            this.setState(__assign({}, geom), function () {
                if (isAwaitingShow_2) {
                    _this.startAnimation(true);
                }
            });
        }
    };
    Popover.prototype.render = function () {
        var _a = this.state, origin = _a.origin, visible = _a.visible;
        var _b = this.props, onClose = _b.onClose, supportedOrientations = _b.supportedOrientations, useNativeDriver = _b.useNativeDriver;
        var computedStyles = this.computeStyles();
        var contentSizeAvailable = this.state.contentSize.width;
        return (<react_native_1.Modal transparent visible={visible} onRequestClose={onClose} supportedOrientations={supportedOrientations} onOrientationChange={this.onOrientationChange}>
        <react_native_1.View style={[styles.container, contentSizeAvailable && styles.containerVisible]}>

          <react_native_1.TouchableWithoutFeedback onPress={this.props.onClose}>
            <react_native_1.Animated.View style={computedStyles.background} useNativeDriver={true}/>
          </react_native_1.TouchableWithoutFeedback>

          <react_native_1.Animated.View style={computedStyles.popover} useNativeDriver={true}>
            <react_native_1.Animated.View onLayout={this.measureContent} style={[computedStyles.content, this.state.showContent && styles.showContent]} useNativeDriver={true}>
              {this.props.children}
            </react_native_1.Animated.View>
            <react_native_1.Animated.View style={computedStyles.arrow} useNativeDriver={true}/>
          </react_native_1.Animated.View>

        </react_native_1.View>
      </react_native_1.Modal>);
    };
    Popover.propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        arrowSize: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        placement: PropTypes.oneOf(['left', 'top', 'right', 'bottom', 'auto']),
        fromRect: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        displayArea: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        backgroundStyle: PropTypes.any,
        arrowStyle: PropTypes.any,
        popoverStyle: PropTypes.any,
        contentStyle: PropTypes.any,
        duration: PropTypes.number,
        easing: PropTypes.func,
    };
    Popover.defaultProps = {
        visible: false,
        onClose: function () { },
        arrowSize: { width: 16, height: 8 },
        placement: 'auto',
        duration: 300,
        easing: function (show) { return show ? react_native_1.Easing.out(react_native_1.Easing.back(1.70158)) : react_native_1.Easing.inOut(react_native_1.Easing.quad); },
        useNativeDriver: false,
    };
    Popover.displayName = 'Popover';
    return Popover;
}(React.PureComponent));
exports.Popover = Popover;
//# sourceMappingURL=Popover.js.map