var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),

    LazyLoad = React.createClass({
        displayName: 'LazyLoad',
        propTypes: {
            height: React.PropTypes.string,
            onLoad: React.PropTypes.func
        },
        getInitialState: function() {
            return {
                visible: false
            };
        },
        handleScroll: function() {
            var bounds = ReactDOM.findDOMNode(this).getBoundingClientRect(),
                scrollTop = window.pageYOffset,
                top = bounds.top + scrollTop,
                height = bounds.bottom - bounds.top,
                adLoadBuffer = this.props.adLoadBuffer || 200;

            if(top === 0 || (top - adLoadBuffer <= (scrollTop + window.innerHeight) && (top + height) > scrollTop)){
                this.setState({visible: true});
                this.handleVisible();
            }
        },
        handleVisible: function() {
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('resize', this.handleScroll);
            if(this.props.onLoad) {this.props.onLoad();}
        },
        componentDidMount: function() {
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', this.handleScroll);
            this.handleScroll();
        },
        componentDidUpdate: function() {
            if(!this.state.visible) this.handleScroll();
        },
        componentWillUnmount: function() {
            this.handleVisible();
        },
        render: function () {
            var renderEl = '',
                preloadHeight = {
                    height: this.props.height
                },
                classes = ClassNames({
                    'lazy-load': true,
                    'lazy-load-visible': this.state.visible
                });

            return (
                React.createElement("div", {style: preloadHeight, className: classes},
                    this.state.visible ? this.props.children : ''
                )
            );
        }
    });

module.exports = LazyLoad;
