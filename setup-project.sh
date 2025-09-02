#!/bin/bash

echo "🚀 Настройка Node.js проекта с TypeScript и Express..."

# Инициализация проекта
echo "📦 Инициализация pnpm проекта..."
pnpm init

# Установка основных зависимостей
echo "⬇️ Установка Express..."
pnpm add express express-validator

# Установка dev зависимостей
echo "⬇️ Установка dev зависимостей..."
pnpm add -D typescript @types/express jest ts-jest @types/jest @types/node supertest @types/supertest eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier nodemon

# Инициализация TypeScript
echo "🔧 Инициализация TypeScript..."
pnpm tsc --init

# Создание структуры папок
echo "📁 Создание структуры папок..."
mkdir -p src

# Создание index.ts
echo "📄 Создание index.ts..."
cat > src/index.ts << 'EOF'
import express from 'express';
import { setupApp } from './setup-app';

const app = express();
const PORT = process.env.PORT || 3000;

setupApp(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
EOF

# Создание setup-app.ts
echo "📄 Создание setup-app.ts..."
cat > src/setup-app.ts << 'EOF'
import express, { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export function setupApp(app: Application): void {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World!' });
  });

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.post('/users', [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json({ message: 'User created', data: req.body });
  });
}
EOF

# Инициализация git
echo "🔧 Инициализация git..."
git init

echo "✅ Проект успешно настроен!"
echo "🚀 Для запуска выполните: pnpm dev"
