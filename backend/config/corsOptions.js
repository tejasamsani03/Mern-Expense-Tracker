const allowedOrigins = [
  'https://mern-expense-tracker-87jg.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173', // A common port for Vite dev servers
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, or curl)
    // or requests from our allowed list.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 200, // For legacy browser support
};

export default corsOptions;