# PalychGram

Приватный мод-клиент для Telegram Web в виде Firefox-расширения.
Цель: визуальные темы + удобство + локальные твики поверх `web.telegram.org` (WebK / WebZ).

> Честно о границах: серверные вещи (настоящий Premium, скрытие online/read на сервере,
> пересылка из `noforwards` с авторством, секретные чаты в Web) расширением не делаются.
> Здесь — только то, что стабильно работает через DOM/CSS/storage. См. `docs/FEATURES.md`.

## Статус: v0.1 scaffold

Волна 1 (стабильное):
- [x] Каркас расширения (MV2, Firefox-first)
- [ ] Темы / CSS-переменные / скругления / плотность
- [ ] Blur-privacy режим (замена «стримеру»)
- [ ] Снятие copy/download запретов в DOM
- [ ] Журнал удалённых (текст, IndexedDB, только увиденное)
- [ ] Контекстное меню: перевод, ID пира, время с секундами

Волна 2+ (эксперименты за флагом): typing-off, confirm-before-story,
отложенная отправка, локальный «премиум-визуал». См. `docs/FEATURES.md`.

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
