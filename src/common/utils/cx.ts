import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';

export const cx = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));