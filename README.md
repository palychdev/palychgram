# PalychGram

Приватный мод-клиент для Telegram Web в виде Firefox-расширения.
Цель: визуальные темы + удобство + локальные твики поверх `web.telegram.org` (WebK / WebZ).

> Честно о границах: серверные вещи (настоящий Premium, скрытие online/read на сервере,
> пересылка из `noforwards` с авторством, секретные чаты в Web) расширением не делаются.
> Здесь — только то, что стабильно работает через DOM/CSS/storage. См. `docs/FEATURES.md`.

## Статус: v0.2 wave-1

Волна 1 (стабильное) — готово:
- [x] Темы (6 пресетов), акцент, плотность, pills/chips папок, скругление аватаров
- [x] Blur-privacy + хоткей Alt+Shift+B
- [x] Скрытие рекламы/похожих/сторис, снятие copy-запретов
- [x] Журнал удалённых (FAB-панель, последние 100, очистка)
- [x] Секунды во времени, неокруглённые счётчики, бейдж ID чата
- [x] Снег, auto-pause, перевод выделенного, копирование ссылки/ID
- [x] Popup + Options + backup export/import

Дальше — v0.3 по `docs/ROADMAP.md`.

## Разработка (Firefox)

1. Открой `about:debugging#/runtime/this-firefox`
2. Load Temporary Add-on → выбери `manifest.json` из этой папки
3. Открой `https://web.telegram.org/k` или `/z`
4. Настройки расширения: иконка → PalychGram, или `about:addons` → Preferences

Постоянная установка: подпись через AMO (позже) или `web-ext sign`.

## Структура

```
manifest.json
src/
  content/palychgram.js   — точка входа в странице, применяет настройки
  content/themes.css      — CSS-переменные тем
  content/privacy-blur.css— blur-режим
  background/background.js— контекстные меню, перевод-заглушка
  popup/popup.html|js     — быстрые тумблеры
  options/options.html|js — полная страница настроек
  lib/deleted-cache.js    — журнал удалённых (IndexedDB)
  lib/ghost.js            — экспериментальные флаги (выкл. по умолчанию)
  lib/premium-local.js    — ТОЛЬКО локальный визуал, без обмана
docs/FEATURES.md          — карта фич ExteraGram/AyuGram → реализуемость в Web
```

## Приватность

- Всё хранится локально (`storage.local` / IndexedDB).
- Нет своего бэкенда, нет телеметрии.
- Журнал удалённых пишет только то, что ты сам увидел в открытом чате.
