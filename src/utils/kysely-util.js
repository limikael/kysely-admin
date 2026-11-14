export function kyselyQbeWhere(query, where={}) {
	for (let k in where)
		query=query.where(k,"=",where[k]);

	return query;
}