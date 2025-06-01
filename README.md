# 🤖 Chatbot App

Ứng dụng chatbot thông minh được xây dựng với Next.js, cho phép người dùng tương tác với AI/Chatbot thông qua giao diện chat trực quan.

#### 👉 Website demo: <https://chatbot-app-psi-blue.vercel.app>

## ✨ Tính năng chính

- 💬 Giao diện chat trực quan và dễ sử dụng
- 👤 Hỗ trợ đăng nhập và tài khoản người dùng
    - Đăng nhập bằng email/password
    - Đăng nhập bằng Google
    - Đăng nhập bằng GitHub
- 🔍 Tìm kiếm lịch sử chat
- 📱 Responsive trên mọi thiết bị
- 🎯 Hai mode trò chuyện: AI và Chatbot
- 👥 Hỗ trợ người dùng khách (không cần đăng nhập)
- 💾 Lưu trữ lịch sử chat
- 🔒 Bảo mật với JWT

## 🚀 Công nghệ sử dụng

- Next.js 15
- TypeScript
- Tailwind CSS
- Auth.js
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

# Authentication
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
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
2. Đăng nhập hoặc sử dụng với tư cách khách
3. Chọn chế độ AI (AI thông thường hoặc Chatbot)
4. Bắt đầu chat bằng cách nhập tin nhắn/lựa chọn quick chat
5. Sử dụng tính năng tìm kiếm để tìm lại các cuộc hội thoại cũ

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.
