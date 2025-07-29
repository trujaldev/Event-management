## Event Management System

A modern event management application built with React, featuring interactive UI and event filter and searching functionality.

### Features

- Create, view, edit, and delete events
- Filter events by search, status, and category
- Preserved event data using local storage
- URL-based filtering and navigation
- Responsive design for all devices

### Tech Stack

- React.js 19
- React Router v7 for navigation
- Mantine UI v8 for components
- Tailwind CSS for styling
- React Context API for state management
- Zod for validation
- Dayjs for handling dates
- bcrypt-ts for handling password hashing
- query-string for handling url params

### Project Structure

```
src/
    ├── components/
    │   ├── common/        # Reusable UI components
    │   └── shared/        # Shared business components
    ├── contexts/          # React Context providers
    ├── hooks/            # Custom React hooks
    ├── layouts/          # Page layouts
    ├── routes/           # Route components and protection
    ├── types/           # TypeScript types/interfaces
    ├── utils/           # Helper functions and constants
    └── tests/           # Test files
```

### Key Functionalities

- Dynamic URL-based filtering
- Real-time search and filtering
- Persistent data storage
- CRUD operations for events
- Responsive UI components
- Form validation
- Error handling

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/trujaldev/Event-management.git
cd Event-management
```

2. Install dependencies:

```bash
yarn
```

3. Start development server:

```bash
yarn dev
```

4. Access and run the dev server at `http://localhost:5173`

### Usage

- Add new events using the create form
- Filter events using search bar or category filters
- Events persist with filters in URL params, same view can be shared
- URL parameters sync with current filters

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

### License

MIT License - feel free to use and modify for your projects
