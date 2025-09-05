import express, { type Request, Response, NextFunction } from "express";
import "./middleware";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'petconnect-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set user from session if available
  if (req.session.userId) {
    req.user = req.session.user;
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the port specified in the environment variable PORT
  // Default to 5001 if not specified to avoid conflicts.
  // This serves both the API and the client.
  const port = parseInt(process.env.PORT || '3001', 10);
  
  const startServer = (attemptPort: number) => {
    server.listen({
      port: attemptPort,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${attemptPort}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${attemptPort} is in use, trying ${attemptPort + 1}`);
        startServer(attemptPort + 1);
      } else {
        log(`Server error: ${err.message}`);
        process.exit(1);
      }
    });
  };
  
  startServer(port);
})();
