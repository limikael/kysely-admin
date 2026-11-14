import {useState} from 'react';

export function useAsyncClick(fn) {
	let [loading, setLoading]=useState();

	async function clickHandler() {
		setLoading(true);
		await fn();
		setLoading(false);
	}

	return ({loading, onClick: clickHandler});
}