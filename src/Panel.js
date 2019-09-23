import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import samsara from 'samsarajs'
import PanelView from './views/PanelView'
import { SamsaraContext } from './RemarkContext'

const { Layouts: { SequentialLayout, FlexibleLayout } } = samsara

const PanelContext = React.createContext({PanelParentNode: undefined})

function getMethod(parent) {
    switch (true) {
    case parent instanceof SequentialLayout:
        return 'push'
    case parent instanceof FlexibleLayout:
        return 'push'
    default:
        return 'add'
    }
}

function getFlex({
    height, width, minHeight, minWidth,
}) {
    return isNaN(width || minHeight || minWidth || height) ? 1 : undefined
}

const Panel = ({
    isRoot,
    children,
    height, width, minHeight, minWidth,
    opacity,
    proportions,
    margin,
    color,
    zIndex,
    border,
    cornerRadius,
    alignment,
    x,
    y,
    z,
    layout,
}) => {
    const { ContextParentNode } = useContext(SamsaraContext)
    const { PanelParentNode } = useContext(PanelContext)
    let parentNode = isRoot === false ? PanelParentNode : ContextParentNode

    const flex = getFlex({height, width, minHeight, minWidth})
    const method = getMethod(parentNode)

    let _proportions = [1, 1]
    if (typeof width === 'string' || typeof height === 'string') {
        if (width) {
            _proportions[0] = parseInt(width, 10) / 100
        }

        if (height) {
            _proportions[1] = parseInt(height, 10) / 100
        }
    } else {
        _proportions = undefined
    }

    const viewOptions = {
        _opacity: opacity === undefined ? 1 : opacity,
        minHeight,
        _proportions,
        margin,
        color,
        width,
        zIndex: zIndex ? zIndex() : undefined,
        height,
        border,
        cornerRadius,
        alignment,
        translation: [x, y, z],
        layout,
    }

    const panelView = new PanelView(viewOptions)

    parentNode[method](panelView, flex)

    useEffect(() => {
        panelView.background.setProperties({
            'z-index': zIndex() ? 1 : 0,
        })
    }, [panelView, zIndex])

    useEffect(() => {
        panelView.updateTranslation([x, y, z])
    }, [panelView, x, y, z])

    useEffect(() => {
        panelView.updateSize([width, height])
    }, [width, height, panelView])

    useEffect(() => {
        panelView.updateColor(color)
    }, [color, panelView])

    useEffect(() => {
        panelView.updateOpacity(opacity)
        return () => {
            if (getMethod(parentNode) === 'push') {
                parentNode.unlink(panelView)
            }
            setTimeout(() => panelView.remove(), 66)
        }
    }, [opacity, panelView, parentNode])

    const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, {isRoot: false})
    )

    return (
        <PanelContext.Provider value={{ PanelParentNode: panelView.node }}>
            {childrenWithProps}
        </PanelContext.Provider>
    )
}

Panel.defaultProps  = {
    zIndex: () => {}
}

export default Panel
