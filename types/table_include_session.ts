import type { Table } from '~/generated/prisma/browser'

export type TableSessionInclude = {
	id: string;
	status?: 'ACTIVE' | 'CLOSED';
};

export type TableIncludeSession = Table & {
	sessions: TableSessionInclude[];
};
