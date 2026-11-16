import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { query, closePool } from "./db";

// 型をインポートする
import type { Request, Response } from "express";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

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
/*
// TODOのデータ
const todos = [
  { id: 1, title: "Reactを勉強する", completed: true, createdAt: new Date() },
  { id: 2, title: "Node.jsを勉強する", completed: true, createdAt: new Date() },
  { id: 3, title: "TODOアプリを作る", completed: false, createdAt: new Date() },
];
*/

// サーバーえらーを処理する関数
function handleServerError(
  res: Response,
  err: unknown,
  message: string = "サーバーエラー",
) {
  console.error(err);
  res.status(500).json({ error: message });
}

// TODOの全データを返すルート
/*
app.get("/api/todos", (req: Request, res: Response) => {
  res.json(todos);
});
*/
app.get("/api/todos", async (req: Request, res: Response) => {
  try {
    const sql =
      "SELECT id, title, completed, created_at AS createdAt FROM todos ORDER BY createdAt DESC";
    const rows = await query<Todo>(sql);

    res.status(200).json(rows);
  } catch (err) {
    handleServerError(res, err);
  }
});

// 定義したルート以外へのアクセスに対する処理（404）
app.use((req: Request, res: Response) => {
  res.status(400).set("Content-Type", "text/html; charset=utf-8");
  res.send("<h1>ページが見つかりませんでした</h1>");
});

// アプリ終了時にDB接続プールを安全に破棄する
["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal}を受信。アプリケーションの終了処理中...`);
    await closePool();
    process.exit();
  });
});

// Webサーバーを指定したポートで起動する
app.listen(port, () => {
  console.log("Webサーバーが起動しました！");
});
