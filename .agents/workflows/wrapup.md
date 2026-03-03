---
description: 專案告一段落時自動整理並更新管理文件 (CHANGELOG, task, timesheet)
---
這是一個工作告一段落時的自動化指令，當使用者輸入 `/wrapup` (或是在自然語言中要求「幫我做專案結算」) 時，請嚴格按照以下步驟執行：

1. **分析本次工作進度**：
   - 查看近期的 git 歷史或是與使用者的對話紀錄，總結出「本次或這幾天新增與修復了什麼功能」。

2. **更新 CHANGELOG.md**：
   - 找到 `CHANGELOG.md` 檔案，在現有日期標題下（或新增今日日期的標題），以列點方式（如 `Fixed`、`Changed`、`Added`）描述剛剛分析出的改動，且文字需淺顯易懂。

3. **同步更新 task.md (雙版本)**：
   - 開啟 `task.md` 以及 Artifact 資料夾 (`C:\Users\Administrator\.gemini\antigravity\brain\77df3304-1550-41dc-8379-c6db794aa2d9\task.md`) 的待辦清單版本。
   - 將本次完成的工作對應到清單，並打勾 `[x]`。如果有不屬於預設清單的新增功能，則在適合的分類下增列該項目並打勾。

4. **追加 timesheet.md 工時**：
   - 根據剛剛總結的工作量，評估出合理的工時時數（如 0.5、1.5 小時）。
   - 在 `timesheet.md` 表格底部新增一列，填寫今日日期、執行的階段名稱、時數，並在最後一欄標註大致完成的項目。

5. **版本控制與發布**：
// turbo-all
   - 執行 `git add task.md timesheet.md CHANGELOG.md`
   - 執行 `git commit -m "docs: 專案進度結算與管理文件自動更新"`
   - 執行 `git push origin main`

6. 完成後，向使用者總結回報本次新增了多少工時、打勾了哪些任務，並請他們確認。
