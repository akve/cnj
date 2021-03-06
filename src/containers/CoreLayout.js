import React from 'react'

export const CoreLayout = ({ children }) => (
  <div className='fluid-container'>
      {children}
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
