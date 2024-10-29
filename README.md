# Todo Project

This is a Todo application built with **Django REST Framework** for the backend and **React** for the frontend. The application allows users to manage their tasks efficiently.

## Features

- User authentication
- Create, read, update, and delete (CRUD) tasks
- User-specific task management
- Responsive UI built with React

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.x
- Django
- Django REST Framework
- Node.js and npm (for React)

## Getting Started

### Clone the Repository

## Setup Instructions

### 1. Create a GitHub Token
To use this project and enable GitHub Gist export functionality, you'll need to create a personal access token on GitHub:
- Go to your [GitHub settings](https://github.com/settings/tokens).
- Click on **Generate new token**.
- Choose the necessary permissions (usually, `gist` permission is enough for creating Gists).
- Copy the generated token (it will be displayed only once).

### 2. Add the Token to Your Environment
1. Create a `.env` file in the backend root directory of the project.
2. Add the following line to `.env`:
   ```plaintext
   GITHUB_TOKEN=your_personal_access_token_here
