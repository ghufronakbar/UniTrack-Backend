ToDoFlutter Backend API Documentation
Base URL: /api
Authentication
Most endpoints require a Bearer token in the Authorization header, except for login and (optionally) register.
Account
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| POST | /api/account/login | No | Login with email and password |
| POST | /api/account/register | Yes | Register a new user |
| GET | /api/account/ | Yes | Get current user profile |
| PUT | /api/account/ | Yes | Edit user profile |
| PATCH | /api/account/edit-password| Yes | Change user password |
| PATCH | /api/account/notification| Yes | Update notification setting |
Semester
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| GET | /api/semester/ | Yes | Get all semesters for user |
| GET | /api/semester/:id | Yes | Get a specific semester |
| POST | /api/semester/ | Yes | Create a new semester |
| PUT | /api/semester/:id | Yes | Edit a semester |
| PATCH | /api/semester/:id | Yes | Mark semester as done/undone |
| DELETE | /api/semester/:id | Yes | Delete a semester |
Course
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| GET | /api/course/ | Yes | Get all courses for user |
| GET | /api/course/:id | Yes | Get a specific course |
| POST | /api/course/ | Yes | Create a new course |
| PUT | /api/course/:id | Yes | Edit a course |
| DELETE | /api/course/:id | Yes | Delete a course |
Task
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| GET | /api/task/ | Yes | Get all tasks for user |
| GET | /api/task/:id | Yes | Get a specific task |
| POST | /api/task/ | Yes | Create a new task |
| PUT | /api/task/:id | Yes | Edit a task |
| DELETE | /api/task/:id | Yes | Delete a task |
Report
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| GET | /api/report/:id | No | Download Excel report for semester |
Analytics
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| GET | /api/analytics/ | Yes | Get analytics for user |
Image
| Method | Path | Auth Required | Description |
|--------|----------------------------|---------------|------------------------------------|
| POST | /api/image/ | No | Upload an image (multipart/form-data, field: image) |
Notes
All endpoints return JSON except /api/report/:id, which returns an Excel file.
For endpoints requiring authentication, include Authorization: Bearer <token> in the header.
For image upload, use multipart/form-data with the field name image.