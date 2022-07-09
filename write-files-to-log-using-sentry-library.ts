// Để ghi log vào file chúng ta thường sử dụng thư viện và phải cấu hình chúng.
//
// Giới thiệu thư viện sentry
//
// Cài đặt
//
// npm install --save @sentry/node @sentry/tracing
// Sử dụng sentry trong dự án:

import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

// or using CommonJS
// const express = require('express');
// const Sentry = require('@sentry/node');
// const Tracing = require("@sentry/tracing");

const app = express();

Sentry.init({
  dsn: "https://a624550fae80476180550f36b16fed36@o1289785.ingest.sentry.io/6509151",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000);