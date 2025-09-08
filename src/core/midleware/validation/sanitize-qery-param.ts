import {NextFunction} from "express";

import {Request, Response} from "express";

export const sanitizeQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    req.query.pageNumber = Math.max(1, pageNumber) as any; // Число, не строка

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    req.query.pageSize = Math.max(1, Math.min(100, pageSize)) as any; // Число, не строка

    // Остальное без изменений
    const allowedSortBy = ['createdAt', 'name'];
    if (!allowedSortBy.includes(req.query.sortBy as string)) {
        req.query.sortBy = 'createdAt';
    }

    if (!['asc', 'desc'].includes(req.query.sortDirection as string)) {
        req.query.sortDirection = 'desc';
    }

    next();
};
