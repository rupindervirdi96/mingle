# Mingle

A small social network: share posts and photos, add friends, chat in real time and get notified the moment something happens.

**Live:** https://mingle-app-virdi.onrender.com

## Features

- **Feed** – posts with photos, likes, comments, delete, share links, infinite scroll; friends' new posts appear live.
- **Friends** – requests (send / confirm / delete / cancel), suggestions ranked by mutual friends, unfriend, people search.
- **Messages** – real-time chat over Socket.IO with typing indicators, read receipts ("Seen"), unread counts, online presence, message history paging and retry for failed sends.
- **Notifications** – friend requests, accepted requests, likes and comments, delivered live with a bell badge, toasts, an inbox page, inline Confirm/Delete for requests, and optional desktop notifications when Mingle is in a background tab.
- **Profiles** – cover and profile photos (Cloudinary), bio, intro details (work, education, city, relationship), friends list.
- Light and dark themes, responsive layout with a mobile tab bar.

## Stack

| Part | Tech |
| --- | --- |
| Server | Node 22, Express 5, Mongoose 8 (MongoDB), Socket.IO 4, JWT auth |
| Client | React 19, Vite, Redux Toolkit, React Router, Sass, lucide icons |

```
server.js            Express app + Socket.IO bootstrap, serves client/build
config/              DB connection and settings (see "Configuration")
lib/                 realtime (sockets, presence), notifications, profile helpers, errors
models/              Mongoose models
routes/              REST API, all under /api
client/              React app (Vite)
```

## Running locally

```bash
npm install
npm install --prefix client

# Use your own database for development - config/default.json points at a shared cluster.
export MONGO_URI="mongodb://127.0.0.1:27017/mingle"   # PowerShell: $env:MONGO_URI="..."
export JWT_SECRET="any-long-random-string"

npm run dev        # API on :5000, client on :3000 (proxied)
```

Production build: `npm run build` (installs and builds the client into `client/build`), then `npm start`.

## Configuration

Settings come from `config/*.json` and are overridden by environment variables (`config/custom-environment-variables.json`):

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `SMTP_USER`, `SMTP_PASS` | Gmail address and app password for signup verification emails. If unset, email verification is turned off and people can sign up directly. |
| `SMTP_SERVICE` | Nodemailer service name (default `Gmail`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset used for photos |
| `PORT` | Port to listen on (Render sets this) |

## Deploying on Render

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- Set the environment variables above in the Render dashboard.

## Upgrading from the original version

Existing users, profiles, friends and posts keep working as-is. Old chat rooms are copied into the new conversation format automatically the first time each user opens their messages.

## API overview

All endpoints are under `/api` and, except auth, need `Authorization: Bearer <token>`.

| Area | Endpoints |
| --- | --- |
| Auth | `GET /auth/config`, `POST /auth/send-code`, `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Profiles | `GET /profiles/search?q=`, `GET /profiles/:id`, `PATCH /profiles/me`, `POST /profiles/me/info`, `DELETE /profiles/me/info/:index` |
| Friends | `GET /friends`, `GET /friends/suggestions`, `POST /friends/requests/:id`, `POST /friends/requests/:id/accept`, `DELETE /friends/requests/:id`, `DELETE /friends/:id` |
| Posts | `GET /posts/feed`, `GET /posts/user/:profileId`, `GET /posts/:id`, `POST /posts`, `DELETE /posts/:id`, `POST /posts/:id/like`, `POST /posts/:id/comments`, `DELETE /posts/:id/comments/:commentId` |
| Chats | `GET /chats`, `POST /chats/with/:profileId`, `GET /chats/:id/messages`, `POST /chats/:id/messages`, `POST /chats/:id/read` |
| Notifications | `GET /notifications`, `POST /notifications/read-all`, `POST /notifications/:id/read`, `DELETE /notifications/:id` |

Socket events (server → client): `chat:message`, `chat:read`, `chat:typing`, `presence`, `presence:list`, `notification:new`, `notification:removed`, `notification:read`, `friends:update`, `post:new`. Client → server: `chat:typing`.
