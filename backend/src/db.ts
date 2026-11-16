import mysql from "mysql2/promise";
import dotenv from "dotenv";

// 型をインポートする
import type { RowDataPacket } from "mysql2/promise";
import { promiseHooks } from "node:v8";

// .envを読み込む
dotenv.config({ path: ".env" });

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD設定:", !!process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

// DB接続設定
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 8889,
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
};

// DB接続プールを作成する
const pool = mysql.createPool(dbConfig);

// DB接続プールを破棄する関数
export async function closePool() {
  try {
    await pool.end();
    console.log("データベース接続プールを破棄しました");
  } catch (err) {
    console.error("データベース接続プールの破棄中にエラーが発生しました", err);
  }
}

// SQLを実行する関数
export async function query<T = any>(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
    return rows as T[];
  } catch (err) {
    console.error("SQLの実行中にエラーが発生しました", err);
    throw err;
  }
}
