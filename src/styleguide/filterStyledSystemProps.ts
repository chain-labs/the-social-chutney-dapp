import styledSystemPropTypes from '@styled-system/prop-types';

// An object where keys are all props in styled-system and value is true.
// For example: { color: true, fontSize: true, ...}
// It is used in filtering props from styled components
export const allStyledSystemProps = Object.keys(styledSystemPropTypes).reduce((acc, curr) => {
	const key = styledSystemPropTypes[curr];
	if (typeof key === 'object') {
		Object.keys(key).forEach((k) => {
			acc[k] = true;
		});
	} else {
		acc[key] = true;
	}

	return acc;
}, {});

// A filter function that can be passed with 'shouldForwardProp'
// in styled components to filter out all the style props from
// the HTML
export const filterStyledSytemProps = (prop, defaultValidatorFn) =>
	!allStyledSystemProps[prop] && defaultValidatorFn(prop);
