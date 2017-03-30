import _ from 'lodash';

export const templatedUrl = (url, props) => {
    const templatedProps = _(url).words(/{{[a-z]*}}/g)
                            .map(item => item.replace(/{{|}}/g, ''));

    let result = url;

    templatedProps.forEach(item => {
        result = result.replace(`{{${item}}}`, props[item]);
    });

    return result.replace('/', '');
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
