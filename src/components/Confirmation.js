import React from 'react';
import Dialog from './MuiDialog';
import FlatButton from 'material-ui/FlatButton';
import { confirmable } from 'react-confirm';

class Confirmation extends React.Component {

    render() {

        const {
            okLabel = 'OK',
            cancelLabel = 'Cancel',
            title,
            confirmation,
            show,
            proceed,
            dismiss,
            cancel,
            modal,
        } = this.props;

        const actions = [
            <FlatButton
                label={cancelLabel}
                secondary={true}
                onClick={cancel}
            />,
            <FlatButton
                label={okLabel}
                primary={true}
                onClick={proceed}
            />,
        ];

        return (
                <Dialog
                    title={title}
                    actions={actions}
                    modal={modal}
                    open={show}
                    onRequestClose={dismiss}
                >
                    {confirmation}
                </Dialog>

        );
    }
}

export default confirmable(Confirmation);