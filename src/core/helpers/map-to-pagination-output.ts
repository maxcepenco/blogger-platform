// Фабричная функция, которая создает специализированные функции пагинации
// DB - тип данных из базы данных (например UserDb, BlogDb)
// VM - тип данных для клиента (например UserViewModel, BlogViewModel)


import {WithId} from "mongodb";
import {PaginateQueryOutput} from "../types/pagination-output-model";

function createPaginationMapper<DB, VM>(
    // Принимает функцию-маппер, которая преобразует DB документ в VM объект
    mapFn: (item: WithId<DB>) => VM
) {
    // Возвращает новую функцию, которая будет работать с конкретными типами DB и VM
    return function(
        items: WithId<DB>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number
    ): PaginateQueryOutput<VM> {  // Возвращает объект пагинации с массивом VM объектов

        // Вычисляем общее количество страниц (округляем вверх)
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,           // Общее количество страниц
            page: pageNumber,     // Текущая страница
            pageSize,             // Размер страницы
            totalCount,           // Общее количество записей
            items: items.map(mapFn)  // Преобразуем каждый DB объект в VM объект с помощью mapFn
        };
    };
}

// Создание специализированной функции для пагинации пользователей
// TypeScript автоматически выводит типы: DB=UserDb, VM=UserViewModel
// const mapToUserPagination = createPaginationMapper(mapToUserViewModel);

// Создание специализированной функции для пагинации блогов
// TypeScript автоматически выводит типы: DB=BlogDb, VM=BlogViewModel
// const mapToBlogPagination = createPaginationMapper(mapToBlogViewModel);

// Создание специализированной функции для пагинации постов
// TypeScript автоматически выводит типы: DB=PostDb, VM=PostViewModel
// const mapToPostPagination = createPaginationMapper(mapToPostViewModel);
