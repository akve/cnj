import React from 'react';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class MuiDialog extends React.Component {

    render() {
        return (
            <MuiThemeProvider>
                <Dialog {...this.props}
                >
                    {this.props.children}
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default MuiDialog;