# Taskflow – MERN Trello-lite

A task/project management board built with MongoDB, Express, React and Node. Boards, lists and cards with drag-and-drop, board membership, and owner/member permissions.

## Features

- **Authentication** – Register, login, JWT-based sessions, forgot/reset password (reset link is logged to the server console in development, no email service connected yet).
- **Boards** – Create, view, delete. Each board tracks an owner.
- **Lists** – Create, rename, reorder, delete (cascades to its cards).
- **Cards** – Create, edit, delete, drag-and-drop between lists.
- **Members & permissions** – Board owners can invite existing users by email and remove members. Only the owner can edit/delete the board or manage members; any member can manage lists and cards.

## Tech stack

**Frontend:** React (Vite), React Router, Tailwind CSS, @dnd-kit (drag-and-drop), Axios, lucide-react
**Backend:** Express, Mongoose, MongoDB Atlas, JSON Web Tokens, bcrypt

## Data models

| Model | Fields | Notes |
|---|---|---|
| `User` | name, email, password (hashed) | Password never returned by default queries |
| `Board` | title, description, owner (ref User) | |
| `BoardMember` | user (ref), board (ref), role (`OWNER` / `MEMBER`) | One row per user per board; unique index on (user, board) |
| `List` | title, position, board (ref) | Ordered within a board |
| `Card` | title, description, position, list (ref), assignedTo (ref User, optional) | Ordered within a list |

## API overview

All routes below `/api/boards`, `/api/lists`, `/api/cards` require a `Authorization: Bearer <token>` header.

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

**Boards**
- `GET /api/boards` – boards the user is a member of
- `POST /api/boards`
- `GET /api/boards/:boardId` – board with its lists, cards, and members
- `PATCH /api/boards/:boardId` – owner only
- `DELETE /api/boards/:boardId` – owner only
- `POST /api/boards/:boardId/members` – owner only, invite by email
- `DELETE /api/boards/:boardId/members/:userId` – owner only
- `POST /api/boards/:boardId/lists`

**Lists**
- `PATCH /api/lists/:listId`
- `DELETE /api/lists/:listId`
- `POST /api/lists/:listId/cards`

**Cards**
- `PATCH /api/cards/:cardId` – edit, move to another list, or reassign
- `DELETE /api/cards/:cardId`

## Setup

### Server