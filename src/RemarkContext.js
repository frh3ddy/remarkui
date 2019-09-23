import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import samsara from 'samsarajs'

const { DOM: { Context } } = samsara

const context = new Context()
context.setPerspective(1000)
context.setPerspectiveOrigin(20)

export const SamsaraContext = React.createContext({ContextParentNode: undefined})

const RemarkContext = ({ children }) => {
    const refEl = useRef(null)
    useEffect(() => {
        if (refEl.current) {
            context.mount(refEl.current)
        }
    }, [refEl])
    return (
        <SamsaraContext.Provider value={{ context, ContextParentNode: context }}>
            <div ref={refEl}>
                {children}
            </div>
        </SamsaraContext.Provider>
    )
}

RemarkContext.propTypes = {
    children: PropTypes.node,
}

export default RemarkContext
