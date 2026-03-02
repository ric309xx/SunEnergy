import os
from datetime import datetime

def deploy():
    print("=========================================")
    print("🚀 準備將網站自動部署至 Netlify...")
    print("=========================================")
    print("由於我們匯入了內容管理系統(CMS)，所有的內容都會被當作資料存放在 GitHub 中。")
    print("因此，最安全且唯一支援 CMS 後台的自動部署方式是透過 Git 進行同步！\n")
    
    commit_msg = f"Auto deploy update (Triggered via script): {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    # 執行 Git 指令
    print("⏳ [1/3] 正在將所有修改加入版本控制...")
    os.system("git add .")
    
    print("⏳ [2/3] 正在建立部署版本紀錄...")
    os.system(f'git commit -m "{commit_msg}"')
    
    print("⏳ [3/3] 正在上傳至 GitHub 並觸發 Netlify 自動重建...")
    result = os.system("git push")
    
    print("\n=========================================")
    if result == 0:
        print("🎉 部署指令發送成功！")
        print("Netlify 已經收到通知，將在接下來的 1~2 分鐘內自動更新您的網站。")
    else:
        print("❌ 部署失敗！")
        print("請確認您是否已經將本地的 Git 庫連接到 GitHub，並且擁有推播權限。")
    print("=========================================")

if __name__ == "__main__":
    deploy()
