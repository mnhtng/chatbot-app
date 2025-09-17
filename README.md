# Session

- Client: `const { data: session } = useSession()`
- Server: `const session = await auth()`

# Environment variable

```md
| File               | Được dùng khi nào                                | Ghi đè lẫn nhau   |
| ------------------ | ------------------------------------------------ | ---------------   |
| `.env`             | Dùng chung cho tất cả môi trường                 | Cơ bản            |
| `.env.local`       | Ghi đè `.env`, chỉ dùng trong **local dev**      | ✅ Ghi đè         |
| `.env.production`  | Dùng khi `next build` trên môi trường production | ✅ Ghi đè `.env`  |
| `.env.development` | Dùng khi chạy `next dev`                         | ✅ Ghi đè `.env`  |
| `.env.test`        | Dùng khi test                                    | ✅ Ghi đè `.env`  |
```

- Biến dùng ở phía Client(trong component React)/Server phải bắt đầu bằng `NEXT_PUBLIC_`
- Biến chỉ dùng ở phía Server không cần bắt đầu bằng `NEXT_PUBLIC_`

# Lưu ý khi deploy

- 1. Public access network
- 2. Cấu hình callbackURL và authURL + config auth2

# Next note

- `layout.tsx` có thể lồng nhau - không bị ghi đè
- `template.tsx` reload lại toàn bộ state, props mỗi khi có thay đổi của bất kỳ state, props nào trong web
