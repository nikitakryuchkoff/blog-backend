import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно содержать минимум 3 символа").isLength({
    min: 3,
  }),
  body("avatarUrl", "Неверная ссылка на аватар").optional().isURL(),
];

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }),
];
export const postCreateValidation = [
  body("title", "Введиет заголовок статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Введите текст")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isString(),
  body("imageUrl", "Неверная ссылка на аватар").optional().isString(),
];
export const commentCreateValidation = [
  body("text", "Введиет текст комментария")
    .isLength({
      min: 3,
    })
    .isString(),
];
