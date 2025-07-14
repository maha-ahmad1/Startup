import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ee53d0ad89e94f8de4c36910c41026e7@o4509639666171904.ingest.us.sentry.io/4509639685767168",
  integrations: [
    Sentry.feedbackIntegration({
      // Disable the injection of the default widget
      autoInject: false,
    }),
  ],
});