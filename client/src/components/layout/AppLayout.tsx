import React from 'react'

const AppLayout = () => (WrappedComponent:any) => {
    return (props:any) =>{

        return (
        <div>
            <div>Header</div>
            <WrappedComponent {...props} />
            <div>Footer</div>

        </div>
      )
    }
}

export default AppLayout