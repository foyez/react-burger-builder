import React, { Fragment } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from './../../hooks/http-error-handler';

const withErrorHandler = (WrapperComponent, axios) => {
	return (props) => {
		const [ error, clearError ] = useHttpErrorHandler(axios);

		return (
			<Fragment>
				<Modal show={error} modalClosed={clearError}>
					{error ? error.message : null}
				</Modal>
				<WrapperComponent {...props} />
			</Fragment>
		);
	};
};

export default withErrorHandler;
