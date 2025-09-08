// src/core/middleware/validation/query-pagination-sorting.validation-middleware.ts
import { query } from 'express-validator';
import { SortDirection } from '../../types/sort-direction';
import { PaginationAndSorting } from '../../types/pagination-and-sorting.input';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE   = 10;
const DEFAULT_SORT_BY     = 'createdAt';          // ← первое поле из enum
const ALLOWED_DIRECTIONS  = Object.values(SortDirection);

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
    pageNumber:   DEFAULT_PAGE_NUMBER,
    pageSize:     DEFAULT_PAGE_SIZE,
    sortBy:       DEFAULT_SORT_BY,
    sortDirection: SortDirection.Desc,
};

/**
 * Генерирует rules для express-validator.
 * @param sortFieldsEnum enum с разрешёнными полями сортировки
 */
export function paginationAndSortingValidation<T extends string>(
    sortFieldsEnum?: Record<string, T>,
) {
    const allowedSortFields = sortFieldsEnum
        ? Object.values(sortFieldsEnum)
        : [DEFAULT_SORT_BY];

    return [
        /* ---------------- Фильтр по имени ---------------- */
        query('searchNameTerm')
            .optional({ nullable: true })
            .isString()
            .withMessage('searchNameTerm must be a string'),

        /* ---------------- Пагинация ---------------- */
        query('pageNumber')
            .optional()                        // параметр опционален
            .isInt({ min: 1 })                 // >0
            .withMessage('pageNumber must be a positive integer')
            .toInt()
            .default(DEFAULT_PAGE_NUMBER),     // default после toInt()

        query('pageSize')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('pageSize must be between 1 and 100')
            .toInt()
            .default(DEFAULT_PAGE_SIZE),

        /* ---------------- Сортировка ---------------- */
        query('sortBy')
            .optional()                        // без default → пустое значение не валидируется
            .isIn(allowedSortFields)
            .withMessage(
                `sortBy must be one of: ${allowedSortFields.join(', ')}`,
            ),

        query('sortDirection')
            .optional()
            .isIn(ALLOWED_DIRECTIONS)
            .withMessage(
                `sortDirection must be one of: ${ALLOWED_DIRECTIONS.join(', ')}`,
            ),
    ];
}
