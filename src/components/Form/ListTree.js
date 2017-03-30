import React, { Component, PropTypes } from 'react';
import Tree, { TreeNode } from 'rc-tree';
import _ from 'lodash';

import './rc-tree.css';

export default class ListTree extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired,
        selected: PropTypes.array
    }

    static defaultProps = {
        selected: [],
        showIcon: false
    }

    onSelect = (id, data) => {
        this.props.onChange(id, data);
    }

    onExpand = (id, data) => {
        this.props.onExpand && this.props.onExpand(id, data);
    }

    render() {
        return (
            <Tree
                onExpand={this.onExpand}
                onSelect={this.onSelect}
                selectedKeys={this.props.selected}
                {..._.omit(this.props, ['selected', 'onExpand', 'onSelect'])}
            >
                {this.renderChildren()}
            </Tree>
        );
    }

    renderChildren(items=this.props.items) {
        return items.map(item => {
            const isChildrenExist = _.size(item.children);
            const selectable = _.isNil(item.selectable) || item.selectable;

            return <TreeNode
                title={item.label || item.value}
                key={item.value}
                disabled={item.disabled}
                selectable={selectable}
                isLeaf={!!isChildrenExist}
            >
                {isChildrenExist && this.renderChildren(item.children)}
            </TreeNode>
        });
    }
}
