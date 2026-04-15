# 🤖 Chatbot App

Ứng dụng chatbot thông minh được xây dựng với Next.js, cho phép người dùng tương tác với AI thông qua giao diện chat trực quan.

#### 👉 Website demo: <https://chatbot-app-psi-blue.vercel.app>

## ✨ Tính năng chính

- 💬 Giao diện chat trực quan và dễ sử dụng
- 🔍 Tìm kiếm lịch sử chat
- 📱 Responsive trên mọi thiết bị
- 🎯 Một mode trò chuyện AI
- 👥 Chế độ người dùng khách (không cần đăng nhập)
- 💾 Lưu trữ lịch sử chat

## 🚀 Công nghệ sử dụng

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM + MongoDB
- Shadcn UI Components

## 🛠️ Cài đặt

1. Clone repository:

```bash
git clone [repository-url]
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Tạo file .env.local và cấu hình các biến môi trường:

```sh
# AI model API key 
DEEPSEEK_API_KEY=your-api-key

# Database
MONGODB_URL=your_mongodb_url
MONGODB_NAME=your_mongodb_name
MONGODB_URI=your_mongodb_uri
```

4. Khởi tạo cơ sở dữ liệu:

```bash
npx prisma generate
npx prisma studio 
```

5. Chạy ứng dụng:

```bash
npm run dev
# hoặc
yarn dev
```

## 📝 Cách sử dụng

1. Truy cập ứng dụng tại <http://localhost:3000>
2. Bắt đầu chat bằng cách nhập tin nhắn/lựa chọn quick chat
3. Sử dụng tính năng tìm kiếm để tìm lại các cuộc hội thoại cũ

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.
