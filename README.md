# 🛠 SLVFX Job Board Aggregator

A modern job board platform that aggregates job listings from multiple sources including RemoteOK, WeWorkRemotely, and more. Built with Next.js, Node.js, and PostgreSQL.

## ✨ Features

- 🔍 **Job Search & Filtering**: Search by title, company, location, skills, and more
- 📱 **Responsive Design**: Mobile-first design with beautiful UI
- 🔐 **User Authentication**: Register, login, and manage your profile
- ❤️ **Save Jobs**: Save interesting jobs to your personal list
- 🛎️ **Job Alerts**: Set up alerts for specific criteria
- 📊 **Real-time Updates**: Jobs are scraped every 30 minutes
- 🎨 **Modern UI**: Built with Tailwind CSS and Lucide icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd slvfx-job
npm run install:all
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE slvfx_job_board;
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your database credentials and other settings.

4. Run database setup:
```bash
npm run setup:db
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

### 4. Initial Job Scraping

```bash
# Run initial job scraping
npm run scrape
```

## 📁 Project Structure

```
slvfx-job/
├── backend/                 # Node.js/Express API
│   ├── api/scrapers/       # Job scraping modules
│   ├── db/                 # Database connection & schema
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── scheduler.js        # Job scraping scheduler
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── contexts/         # React contexts
├── scripts/              # Utility scripts
└── README.md
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

- **Database**: PostgreSQL connection details
- **JWT**: Secret key for authentication
- **API Keys**: Optional external service keys
- **Email**: SMTP settings for notifications

### Database Schema

The application uses PostgreSQL with the following main tables:

- `jobs` - Job listings with normalized data
- `users` - User accounts and profiles
- `saved_jobs` - User's saved job relationships
- `job_alerts` - User's job alert configurations
- `job_sources` - Job source configurations

## 🎯 API Endpoints

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `GET /api/jobs/:id` - Get specific job
- `GET /api/jobs/stats/overview` - Job statistics
- `GET /api/jobs/filters/options` - Available filter options

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Features
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/saved-jobs` - Get saved jobs
- `POST /api/users/saved-jobs` - Save a job
- `DELETE /api/users/saved-jobs/:id` - Remove saved job

## 🔄 Job Scraping

The platform automatically scrapes jobs from:

- **RemoteOK** - Via public API
- **WeWorkRemotely** - Via web scraping
- **Wellfound** - Via web scraping (planned)
- **Indeed** - Via web scraping (planned)

### Manual Scraping

```bash
# Run scrapers manually
npm run scrape

# Run specific scraper
cd backend
node scripts/scrape-remoteok.js
```

### Scheduled Scraping

The scheduler runs every 30 minutes by default. Configure in `backend/scheduler.js`:

```javascript
// Change cron schedule
cron.schedule('*/30 * * * *', () => {
  this.runScrapers();
});
```

## 🎨 Frontend Features

### Components

- **JobCard** - Individual job listing display
- **SearchFilters** - Advanced filtering sidebar
- **AuthProvider** - Authentication context
- **Navigation** - Main navigation component

### Hooks

- **useJobs** - Fetch and filter jobs
- **useSavedJobs** - Manage saved jobs
- **useAuth** - Authentication state

## 🚀 Deployment

### Backend Deployment

1. **Railway/Render**:
```bash
# Set environment variables
# Deploy from GitHub
```

2. **Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Deployment

1. **Vercel**:
```bash
# Connect GitHub repository
# Vercel will auto-deploy
```

2. **Netlify**:
```bash
# Build command: npm run build
# Publish directory: frontend/.next
```

## 🔒 Security Considerations

- **Rate Limiting**: Implemented on API endpoints
- **Input Validation**: All inputs are validated
- **SQL Injection**: Protected with parameterized queries
- **CORS**: Configured for production domains
- **JWT**: Secure token-based authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with details

## 🔮 Future Features

- [ ] Email notifications for job alerts
- [ ] RSS feed export
- [ ] Advanced analytics dashboard
- [ ] Company profiles and reviews
- [ ] Salary insights and trends
- [ ] AI-powered job matching
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

**Built with ❤️ by the SLVFX Team**
