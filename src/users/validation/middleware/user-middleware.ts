import {query} from "express-validator";

export const pageNumberValidation = query("pageNumber")
    .toInt()
    .default(1)
    .isInt({ min: 1 })                        // Минимум 1
    .withMessage("pageNumber must be >= 1");

export const pageSizeValidation = query("pageSize")
    .toInt()
    .default(10)
    .isInt({ min: 1, max: 100 })              // От 1 до 100
    .withMessage("pageSize must be between 1 and 100");

export const sortDirectionValidation = query("sortDirection")
    .default("desc")
    .isIn(['asc', 'desc'])                    // Только asc или desc
    .withMessage("sortDirection must be 'asc' or 'desc'");

export const sortByValidation = query("sortBy").default("createdAt");



export const userPaginateValidation = [
    pageNumberValidation,
    pageSizeValidation,
    sortDirectionValidation,
    sortByValidation
]