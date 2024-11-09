import { getContentAsObject } from 'src/utils/content';
import { OrgTypes, PeekabooObj } from '../types';
import * as z from 'zod';

function _wrapObjects(src: Record<string, any> | string | number | boolean | unknown[]): z.ZodType {
	switch (typeof src) {
		case 'string':
			return z.string().optional();
		case 'number':
			return z.number().optional();
		case 'boolean':
			return z.boolean().optional();
		case 'object':
			if (Array.isArray(src)) {
				if (src.length === 0) {
					return z.array(z.any()).optional().optional();
				} else {
					const firstType = _wrapObjects(src[0]);
					return z.array(firstType).optional();
				}
			} else {
				const obj = Object.keys(src).reduce(
					(acc, key) => {
						acc[key] = _wrapObjects(src[key]);
						return acc;
					},
					{} as Record<string, any>
				);

				return z.object(obj).optional();
			}
		default:
			console.error(`${src} is not registered type: ${typeof src}`);
			return z.any().optional();
	}
}

function _getSchemaFromObj<U>(contentObj: OrgTypes<U>) {
	return _wrapObjects(contentObj) as z.ZodType<OrgTypes<U>>;
}

function getSchema<U>(peekaboo: PeekabooObj<U>) {
	const contentObj = getContentAsObject(peekaboo);
	return _wrapObjects(contentObj) as z.ZodType<OrgTypes<U>>;
}
export { _wrapObjects, getSchema, _getSchemaFromObj };
