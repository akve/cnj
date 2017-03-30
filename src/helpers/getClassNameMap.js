export default (type, className='') => {
    if (type === 'button') {
        const classNameMap = {
            'btn-primary': 'primary',
            'btn-success': 'primary',
            'btn-danger': 'secondary',
            'col-md-12': 'fullWidth',
            'col-lg-12': 'fullWidth'
        }
        const customProps = {}
        const filteredClassNames = []

        className.split(' ').forEach(item => {
            const prop = classNameMap[item];

            if (prop) {
                customProps[prop] = true;
            } else {
                filteredClassNames.push(item);
            }
        })

        return {
            customProps,
            className: filteredClassNames.join(' ')
        }
    }
}
