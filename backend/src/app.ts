import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 型をインポートする
import type { Request, Response } from "express";

// .envを読み込む
dotenv.config();

// 環境変数からポート番号を取得する
const port = Number(process.env.PORT) || 3000;

// Webサーバーの土台を作成する
const app = express();

// CORSを設定する
app.use(
  cors({
    origin: "http://localhost:5173", //　許可するオリジン
    methods: ["GET"], // 許可するHTTPメソッド
  }),
);
// TODOのデータ
const todos = [
  { id: 1, title: "Reactを勉強する", completed: true, createdAt: new Date() },
  { id: 2, title: "Node.jsを勉強する", completed: true, createdAt: new Date() },
  { id: 3, title: "TODOアプリを作る", completed: false, createdAt: new Date() },
];

// TODOの全データを返すルート
app.get("/api/todos", (req: Request, res: Response) => {
  res.json(todos);
});

// 定義したルート以外へのアクセスに対する処理（404）
app.use((req: Request, res: Response) => {
  res.status(400).set("Content-Type", "text/html; charset=utf-8");
  res.send("<h1>ページが見つかりませんでした</h1>");
});

// Webサーバーを指定したポートで起動する
app.listen(port, () => {
  console.log("Webサーバーが起動しました！");
});
