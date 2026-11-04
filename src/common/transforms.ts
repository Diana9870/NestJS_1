import { TransformFnParams } from 'class-transformer';

/** Trims string values; any other type is passed on so validators can reject it. */
export const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;
