/** @babel */
import {allowUnsafeNewFunction} from 'loophole';
import resolveFrom from 'resolve-from';
import getPackagePath from './get-package-path';

// (base: string) => xo: Promise<Object>
export default function getXO(base) {
	const getResolveBase = () => base ?
		getPackagePath(base) :
		Promise.resolve(__dirname);

	return getResolveBase()
		.then(base => {
			const resolvedPath = degradingResolve(base, 'xo');
			return dangerouslyRequire(resolvedPath);
		});
}

// (id: string) => any
function dangerouslyRequire(id) {
	let mod;

	allowUnsafeNewFunction(() => {
		mod = require(id);
	});

	return mod;
}

// (base: string, id: string) => resolved: string
function degradingResolve(base, id) {
	return base ?
		resolveFrom.silent(base, id) || require.resolve(id) :
		require.resolve(id);
}
