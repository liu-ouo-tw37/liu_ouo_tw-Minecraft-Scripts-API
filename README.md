# Minecraft Bedrock Scripts API

使用 **JavaScript** 與 **Minecraft Bedrock Script API** 開發的自訂遊戲功能與 UI 實作專案。

這個專案是我在學習 Minecraft Scripts API 過程中逐步建立的實驗性作品。我希望不只使用 Minecraft 原生指令，而是透過 `@minecraft/server`、`@minecraft/server-ui` 等 API，自行處理事件、設計 UI、實作小遊戲，並在開發過程中練習問題定位與除錯。

---

## Project Highlights

- 使用 Minecraft Script API 監聽玩家事件
- 自訂 Action Form 與 Chest UI
- 實作多種遊戲模式與互動功能
- 使用 JavaScript 管理遊戲狀態與邏輯
- 處理 Script 執行時機與 API 生命週期問題
- 嘗試突破原生 UI 的限制，自訂更複雜的介面

---

## Tech Stack

- JavaScript
- Minecraft Bedrock Edition
- `@minecraft/server`
- `@minecraft/server-ui`
- Minecraft Behavior Pack / Script API

目前 `manifest.json` 使用：

- Minecraft minimum engine version：`1.21.120`
- `@minecraft/server`：`2.4.0`
- `@minecraft/server-ui`：`2.0.0`

---

## 功能

### Game Mode Changer

使用特定道具開啟 UI，可以快速切換：

- Creative
- Survival
- Adventure
- Spectator

透過 `ActionFormData` 製作操作介面，並依照玩家選擇執行對應指令。

---

### Custom Chest UI

專案使用自訂的 `ChestFormData` 建立類似 Minecraft Chest 的互動式介面。

目前選單中包含：

- Game Mode Changer
- 2048
- Tic-Tac-Toe
- Minesweeper

相較於普通按鈕式選單，Chest UI 能以格子位置與物品圖示呈現功能，使操作方式更接近 Minecraft 原生介面。

---

### Tic-Tac-Toe

以 JavaScript 陣列儲存棋盤狀態，並透過 Chest UI 呈現 O / X。

包含：

- O / X 回合切換
- 已使用格子判斷
- 橫向勝利判斷
- 直向勝利判斷
- 斜線勝利判斷
- 平手判斷
- 重新開始功能

---

### Minesweeper

自行實作踩地雷遊戲邏輯，使用 Chest UI 作為遊戲盤面。

包含：

- 隨機地雷
- 周圍地雷數量計算
- 挖掘模式
- 插旗模式
- 遊戲重置
- 遊戲狀態管理

在開發過程中，我也嘗試讓 UI 支援比原本 Chest 更大的遊戲盤面，進一步研究 UI 尺寸與生成邏輯。

---

## 📁 Project Structure

```text
liu_ouo_tw_Script/
│
├── manifest.json
├── pack_icon.png
│
└── scripts/
    ├── main.js
    ├── index.js
    │
    └── extensions/
        ├── forms.js
        ├── forms.d.ts
        ├── constants.js
        └── typeIds.js
```

### `main.js`

主要遊戲功能與事件處理，例如：

- 道具使用事件
- Game Mode UI
- Tic-Tac-Toe
- Minesweeper
- 遊戲邏輯

### `index.js`

測試與展示自訂 UI，例如：

- Chest UI
- Furnace UI
- Pattern layout

### `extensions/`

UI 與相關資料的延伸模組。

---

## Installation

1. 將 `liu_ouo_tw_Script` 放入 Minecraft Bedrock Edition 的 Behavior Packs 目錄。
2. 建立或編輯世界。
3. 啟用對應 Behavior Pack。
4. 確認 Minecraft 版本及 Script API 相容。
5. 進入世界後即可測試相關功能。

> 此專案主要作為個人學習與實驗用途，不保證所有 Minecraft 版本皆能直接執行。

---

## 👤 Author

**liu_ouo_tw**

A high school student.
